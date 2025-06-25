import { useRef, useCallback, useEffect } from "react";

export function useAudioAnalyser() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAnalyser = useCallback((media: HTMLMediaElement) => {
    if (audioContextRef.current) return; // уже инициализировано

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();

    // Winamp-style настройки
    analyser.fftSize = 256; // 128 бинов → широкие столбцы
    analyser.smoothingTimeConstant = 0.8; // плавность движения
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    // нужен resume, чтобы AudioContext запустился
    ctx.resume().catch(() => {
      /* ignore */
    });

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
  }, []);

  // при размонтировании закрываем контекст
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return {
    initAnalyser,
    analyserNode: analyserRef.current,
  };
}
