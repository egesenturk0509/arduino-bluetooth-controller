"use client";
import { useState, useEffect, useRef } from "react";

export default function UsbSerialMonitor({ port, sendCommand }: any) {
  const [incoming, setIncoming] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
          if (value) {
            setIncoming(prev => [...prev, value].slice(-100));
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
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [incoming]);

  return (
    <div className="flex flex-col h-full space-y-4 max-w-3xl mx-auto">
      <h2 className="font-bold text-gray-700">USB SERİ MONİTÖR</h2>
      <div 
        ref={scrollRef}
        className="flex-1 bg-gray-900 text-green-400 p-4 rounded-3xl font-mono text-sm h-80 overflow-y-auto border-4 border-gray-800 shadow-2xl"
      >
        <div className="flex flex-col">
          {incoming.map((msg, i) => <span key={i} className="whitespace-pre-wrap">{msg}</span>)}
        </div>
        {!port && <div className="text-gray-500 italic">USB cihazı bağlı değil...</div>}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (sendCommand(input), setInput(""))}
          disabled={!port}
          placeholder={port ? "USB'den veri gönder..." : "Önce USB Bağlanın"}
          className="flex-1 border-2 rounded-2xl px-6 py-3 outline-none focus:border-green-500"
        />
        <button onClick={() => (sendCommand(input), setInput(""))} className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">GÖNDER</button>
      </div>
    </div>
  );
}