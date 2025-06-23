#!/usr/bin/env python3
import os
import sys
import argparse
from github import Github
import openai
import openai.error

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--pr-number', type=int, required=True)
    p.add_argument('--repo', type=str, required=True)
    return p.parse_args()

def main():
    args = parse_args()

    key = os.getenv("OPENAI_API_KEY")
    if not key:
        print("ERROR: OPENAI_API_KEY is missing!")
        sys.exit(1)
    openai.api_key = key

    gh = Github(os.getenv("GITHUB_TOKEN"))
    repo = gh.get_repo(args.repo)
    pr = repo.get_pull(args.pr_number)

    files = [(f.filename, f.patch or "") for f in pr.get_files()]
    prompt = "Проведи обзор изменений:\n\n"
    for fn, patch in files:
        prompt += f"=== {fn} ===\n```diff\n{patch}\n```\n\n"

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
    except openai.error.RateLimitError:
        pr.create_issue_comment(
            "⚠️ Не удалось выполнить ревью: исчерпан лимит запросов к OpenAI API. "
            "Пожалуйста, проверьте баланс и тариф: https://platform.openai.com/account/billing."
        )
        return
    except Exception as e:
        # На всякий случай залогируем и сообщим об общей ошибке
        error_msg = f"❗️ Ошибка при анализе через OpenAI API: {e}"
        pr.create_issue_comment(error_msg)
        return

    # Если всё успешно
    comment = resp.choices[0].message.content
    pr.create_issue_comment(comment)

if __name__ == "__main__":
    main()
