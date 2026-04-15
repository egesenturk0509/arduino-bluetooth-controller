"use client";
import { useState } from "react";

export default function RgbControl({ sendCommand }: { sendCommand: (c: string) => void }) {
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);
  const [isCommonAnode, setIsCommonAnode] = useState(false);
  const [hex, setHex] = useState("#808080");

  const updateFromRgb = (newR: number, newG: number, newB: number) => {
    const h = `#${newR.toString(16).padStart(2,'0')}${newG.toString(16).padStart(2,'0')}${newB.toString(16).padStart(2,'0')}`;
    setHex(h);
    
    // Ortak Anot'ta 255 tam parlaklık değil, 0 tam parlaklıktır (tersi).
    const finalR = isCommonAnode ? 255 - newR : newR;
    const finalG = isCommonAnode ? 255 - newG : newG;
    const finalB = isCommonAnode ? 255 - newB : newB;
    sendCommand(`RGB:${finalR},${finalG},${finalB}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="w-full h-32 rounded-xl border shadow-inner" style={{ backgroundColor: hex }} />
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
        <span className="font-bold text-sm text-gray-600">LED TİPİ</span>
        <div className="flex gap-2">
          <button 
            onClick={() => { setIsCommonAnode(false); updateFromRgb(r, g, b); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isCommonAnode ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-400"}`}
          >ORTAK KATOT</button>
          <button 
            onClick={() => { setIsCommonAnode(true); updateFromRgb(r, g, b); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isCommonAnode ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-400"}`}
          >ORTAK ANOT</button>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'R', val: r, set: setR, color: "text-red-500" },
          { label: 'G', val: g, set: setG, color: "text-green-500" },
          { label: 'B', val: b, set: setB, color: "text-blue-500" }
        ].map(({ label, val, set, color }) => (
          <div key={label} className="flex items-center gap-4">
            <span className={`font-bold w-4 ${color}`}>{label}</span>
            <input 
              type="range" min="0" max="255" value={val} 
              onChange={(e) => {
                const v = parseInt(e.target.value);
                set(v);
                if(label === 'R') updateFromRgb(v, g, b);
                if(label === 'G') updateFromRgb(r, v, b);
                if(label === 'B') updateFromRgb(r, g, v);
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input 
              type="number" value={val} className="w-16 border rounded p-1 text-center text-sm"
              onChange={(e) => {
                const v = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                set(v);
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400">HEX KODU</label>
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full border rounded-lg p-2 font-mono uppercase" />
      </div>
    </div>
  );
}