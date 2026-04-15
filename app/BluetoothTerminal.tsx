"use client";
import { useState } from "react";

export default function BluetoothTerminal({ logs, addLog, sendCommand }: any) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    sendCommand(input);
    addLog(`Giden: ${input}`);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 bg-black text-green-500 p-4 rounded-xl font-mono text-sm h-64 overflow-y-auto border-2 border-gray-200">
        {logs.map((log: string, i: number) => (
          <div key={i} className="mb-1">{log}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Komut yazın..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">GÖNDER</button>
      </div>
    </div>
  );
}