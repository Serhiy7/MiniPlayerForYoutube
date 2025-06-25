import React, { useEffect, useRef, memo } from "react";
import "./Visualizer.scss";

interface Props {
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
}

const Visualizer: React.FC<Props> = ({ isPlaying, analyserNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyserNode) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // адаптивный размер холста
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // подготовка данных
    const bufferLength = analyserNode.frequencyBinCount; // 128
    const dataArray = new Uint8Array(bufferLength);

    // параметры Winamp-стиля
    const barCount = 32;
    const step = Math.floor(bufferLength / barCount);
    const DROP_SPEED = 2;
    const PEAK_HEIGHT = 4;

    // массив для хранения пиков
    const peaks = new Array(barCount).fill(0);

    const draw = () => {
      analyserNode.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / barCount) * 0.8;
      const gap = (canvas.width / barCount) * 0.2;
      let x = gap / 2;

      for (let i = 0; i < barCount; i++) {
        const idx = i * step;
        const value = dataArray[idx];
        const barHeight = (value / 255) * canvas.height;

        // рисуем столбец
        ctx.fillStyle = `rgb(${value}, ${255 - value}, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // обновляем и рисуем пик
        if (barHeight > peaks[i]) {
          peaks[i] = barHeight;
        } else {
          peaks[i] = Math.max(0, peaks[i] - DROP_SPEED);
        }
        ctx.fillStyle = "#fff";
        ctx.fillRect(
          x,
          canvas.height - peaks[i] - PEAK_HEIGHT,
          barWidth,
          PEAK_HEIGHT
        );

        x += barWidth + gap;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, analyserNode]);

  return <canvas ref={canvasRef} className="visualizer-canvas" />;
};

export default memo(Visualizer);
