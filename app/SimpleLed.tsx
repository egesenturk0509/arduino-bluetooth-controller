"use client";

export default function SimpleLed({ sendCommand }: { sendCommand: (c: string) => void }) {
  const buttons = [
    { label: "LED 1 AÇ", cmd: "LED1_ON", color: "bg-green-100 text-green-700 border-green-200" },
    { label: "LED 1 KAPAT", cmd: "LED1_OFF", color: "bg-red-100 text-red-700 border-red-200" },
    { label: "LED 2 AÇ", cmd: "LED2_ON", color: "bg-green-100 text-green-700 border-green-200" },
    { label: "LED 2 KAPAT", cmd: "LED2_OFF", color: "bg-red-100 text-red-700 border-red-200" },
    { label: "RÖLE AÇ", cmd: "RELAY_ON", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "RÖLE KAPAT", cmd: "RELAY_OFF", color: "bg-gray-100 text-gray-700 border-gray-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={() => sendCommand(btn.cmd)}
          className={`p-4 rounded-xl border-2 font-bold text-sm transition-transform active:scale-95 ${btn.color}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}