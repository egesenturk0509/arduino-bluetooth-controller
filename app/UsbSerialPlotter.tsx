"use client";
import { useState, useEffect, useRef } from "react";

export default function UsbSerialPlotter({ port }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    if (!port) return;
    let reader: any;

    const readData = async () => {
      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      reader = textDecoder.readable.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const num = parseFloat(value.trim());
          if (!isNaN(num)) {
            setPoints(prev => [...prev, num].slice(-100));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        reader.releaseLock();
      }
    };

    readData();
    return () => reader?.cancel();
  }, [port]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    
    const step = canvas.width / 100;
    const max = Math.max(...points, 1024); // Varsayılan ADC 1024

    points.forEach((p, i) => {
      const x = i * step;
      const y = canvas.height - (p / max) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [points]);

  return (
    <div className="space-y-4 flex flex-col items-center">
      <h2 className="font-bold text-gray-700 uppercase">USB Seri Çizici (0 - 1024)</h2>
      <canvas ref={canvasRef} width={800} height={400} className="bg-gray-50 rounded-3xl border-2 shadow-inner w-full max-w-3xl" />
      <p className="text-xs text-gray-400">Arduino'dan Serial.println() ile gönderilen sayıları çizer.</p>
    </div>
  );
}