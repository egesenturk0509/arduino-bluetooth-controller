"use client";
import UsbSerialMonitor from "./UsbSerialMonitor";
import UsbSerialPlotter from "./UsbSerialPlotter";

interface UsbViewProps {
  activeTab: string | null;
  setActiveTab: (id: string | null) => void;
  setConnectionMode: (mode: "bluetooth" | "usb" | null) => void;
  usbPort: any;
  sendCommand: (cmd: string) => void;
}

export default function UsbView({
  activeTab,
  setActiveTab,
  setConnectionMode,
  usbPort,
  sendCommand
}: UsbViewProps) {
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
            { id: "usb_monitor", label: "USB Monitör", icon: "📟" },
            { id: "usb_plotter", label: "USB Çizici", icon: "📈" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full aspect-square rounded-[2.5rem] bg-white flex flex-col items-center justify-center gap-4 font-bold transition-all shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:scale-105 hover:shadow-xl active:scale-95 group"
            >
              <span className="text-6xl group-hover:drop-shadow-md transition-all">{tab.icon}</span>
              <span className="text-xs uppercase tracking-[0.1em] text-gray-500 group-hover:text-emerald-600">{tab.label}</span>
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
        className="sticky top-0 z-30 mb-8 flex items-center gap-2 px-8 py-3 bg-white/90 backdrop-blur-sm text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-800 rounded-full shadow-xl border border-emerald-50 transition-all active:scale-95"
      >
        ← GERİ DÖN
      </button>
      
      <div className="min-h-[400px]">
        {activeTab === "usb_monitor" && <UsbSerialMonitor port={usbPort} sendCommand={sendCommand} />}
        {activeTab === "usb_plotter" && <UsbSerialPlotter port={usbPort} />}
      </div>
    </div>
  );
}