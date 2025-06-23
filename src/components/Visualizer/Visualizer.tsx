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

    // подгоняем размер холста под DOM
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const step = 8; // отрисовываем каждую 8-ю полосу

    const draw = () => {
      analyserNode.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = Math.floor(bufferLength / step);
      const barWidth = canvas.width / barCount;
      let x = 0;

      for (let i = 0; i < bufferLength; i += step) {
        const v = dataArray[i];
        const h = (v / 255) * canvas.height;
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - h, barWidth - 1, h);
        x += barWidth;
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
