"use client";

export default function JoystickControl({ sendCommand }: { sendCommand: (c: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div />
        <button 
          onMouseDown={() => sendCommand("F")} onMouseUp={() => sendCommand("S")}
          className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-2xl active:bg-blue-500 active:text-white transition-colors shadow-sm"
        >
          ▲
        </button>
        <div />
        <button 
          onMouseDown={() => sendCommand("L")} onMouseUp={() => sendCommand("S")}
          className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-2xl active:bg-blue-500 active:text-white transition-colors shadow-sm"
        >
          ◀
        </button>
        <button onClick={() => sendCommand("S")} className="w-20 h-20 bg-red-100 text-red-600 rounded-xl font-bold shadow-sm">DUR</button>
        <button 
          onMouseDown={() => sendCommand("R")} onMouseUp={() => sendCommand("S")}
          className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-2xl active:bg-blue-500 active:text-white transition-colors shadow-sm"
        >
          ▶
        </button>
        <div />
        <button 
          onMouseDown={() => sendCommand("B")} onMouseUp={() => sendCommand("S")}
          className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-2xl active:bg-blue-500 active:text-white transition-colors shadow-sm"
        >
          ▼
        </button>
        <div />
      </div>
      <p className="text-xs text-gray-400 font-medium italic">Basılı tutunca gider, bırakınca durur (F, B, L, R, S)</p>
    </div>
  );
}