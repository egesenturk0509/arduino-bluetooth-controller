"use client";
import RgbControl from "./RgbControl";
import BluetoothTerminal from "./BluetoothTerminal";
import JoystickControl from "./JoystickControl";
import KeypadControl from "./KeypadControl";
import VoiceControl from "./VoiceControl";
import SimpleLed from "./SimpleLed";

interface BluetoothViewProps {
  activeTab: string | null;
  setActiveTab: (id: string | null) => void;
  setConnectionMode: (mode: "bluetooth" | "usb" | null) => void;
  sendCommand: (cmd: string) => void;
  logs: string[];
  addLog: (msg: string) => void;
}

export default function BluetoothView({
  activeTab,
  setActiveTab,
  setConnectionMode,
  sendCommand,
  logs,
  addLog
}: BluetoothViewProps) {
  if (activeTab === null) {
    return (
      <div className="w-full flex flex-col items-center">
        <button 
          onClick={() => setConnectionMode(null)}
          className="sticky top-0 z-30 self-start mb-8 flex items-center gap-2 px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-500 font-black text-xs uppercase tracking-widest hover:text-black rounded-full shadow-xl border border-gray-100 transition-all active:scale-95"
        >
          ← ANA MENÜYE DÖN
        </button>
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl w-full animate-in fade-in zoom-in duration-300">
          {[
            { id: "rgb", label: "RGB LED", icon: "🎨" },
            { id: "terminal", label: "BT Terminal", icon: "💻" },
            { id: "joystick", label: "Joystick", icon: "🕹️" },
            { id: "buttons", label: "Butonlar", icon: "🔘" },
            { id: "keypad", label: "4x4 Tuş Takımı", icon: "⌨️" },
            { id: "voice", label: "Ses Terminali", icon: "🎤" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full aspect-square rounded-[2.5rem] bg-white flex flex-col items-center justify-center gap-4 font-bold transition-all shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:scale-105 hover:shadow-xl active:scale-95 group"
            >
              <span className="text-6xl group-hover:drop-shadow-md transition-all">{tab.icon}</span>
              <span className="text-xs uppercase tracking-[0.1em] text-gray-500 group-hover:text-blue-600">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-50 animate-in slide-in-from-bottom-10 duration-500">
      <button 
        onClick={() => setActiveTab(null)}
        className="sticky top-0 z-30 mb-8 flex items-center gap-2 px-8 py-3 bg-white/90 backdrop-blur-sm text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 rounded-full shadow-xl border border-blue-50 transition-all active:scale-95"
      >
        ← GERİ DÖN
      </button>
      
      <div className="min-h-[400px]">
        {activeTab === "rgb" && <RgbControl sendCommand={sendCommand} />}
        {activeTab === "terminal" && <BluetoothTerminal logs={logs} addLog={addLog} sendCommand={sendCommand} />}
        {activeTab === "joystick" && <JoystickControl sendCommand={sendCommand} />}
        {activeTab === "buttons" && <SimpleLed sendCommand={sendCommand} />}
        {activeTab === "keypad" && <KeypadControl sendCommand={sendCommand} />}
        {activeTab === "voice" && <VoiceControl addLog={addLog} sendCommand={sendCommand} />}
      </div>
    </div>
  );
}