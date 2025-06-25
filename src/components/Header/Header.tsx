// src/components/Header/Header.tsx
import React, { useState, ChangeEvent, FormEvent, memo } from "react";
import "./Header.scss";

interface Props {
  title: string;
  /** вместо videoTitle */
  onSearch: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  extraControls?: React.ReactNode;
}

const ThemeToggle: React.FC<{ isDarkMode: boolean; onToggle: () => void }> = ({
  isDarkMode,
  onToggle,
}) => (
  <button onClick={onToggle} className="theme-toggle">
    {isDarkMode ? "Light Mode" : "Dark Mode"}
  </button>
);

const Header: React.FC<Props> = ({
  title,
  onSearch,
  isDark,
  onToggleTheme,
  extraControls,
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <header className="header" aria-label="YouTube Audio Player">
      <h1 className="header__title">{title}</h1>

      <form className="header__search" onSubmit={handleSubmit}>
        <input
          type="text"
          className="header__search-input"
          placeholder="Search YouTube…"
          value={query}
          onChange={handleChange}
        />
        <button type="submit" className="header__search-btn">
          🔍
        </button>
      </form>

      <div className="header__extra-controls">
        {extraControls}
        <ThemeToggle isDarkMode={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};

export default memo(Header);
