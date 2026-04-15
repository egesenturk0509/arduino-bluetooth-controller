"use client";

export default function KeypadControl({ sendCommand }: { sendCommand: (c: string) => void }) {
  const keys = ["1", "2", "3", "A", "4", "5", "6", "B", "7", "8", "9", "C", "*", "0", "#", "D"];

  return (
    <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
      {keys.map(key => (
        <button 
          key={key} onClick={() => sendCommand(key)}
          className="h-16 w-16 bg-white border-2 border-gray-200 rounded-xl font-bold text-xl hover:bg-gray-100 active:bg-blue-50 transition-colors shadow-sm"
        >
          {key}
        </button>
      ))}
    </div>
  );
}