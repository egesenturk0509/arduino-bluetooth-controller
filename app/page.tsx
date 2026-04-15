"use client";
import { useState, useEffect } from "react";
import RgbControl from "./RgbControl";
import BluetoothTerminal from "./BluetoothTerminal";
import JoystickControl from "./JoystickControl";
import KeypadControl from "./KeypadControl";
import VoiceControl from "./VoiceControl";
import SimpleLed from "./SimpleLed";

declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options?: any): Promise<any>;
    };
  }
}

export default function EgeRobotKontrol() {
  const [characteristic, setCharacteristic] = useState<any>(null);
  const [status, setStatus] = useState("Bağlı Değil");
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("terminal");
  const [baudRate, setBaudRate] = useState("9600");

  const baudRates = ["1200", "2400", "4800", "9600", "19200", "38400", "57600", "115200", "230400", "460800", "921600", "1382400"];

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  };

  const connectBT = async () => {
    addLog("Cihaz aranıyor...");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [0xFFE0] }], 
        optionalServices: [0xFFE1]
      });
      
      setStatus("Bağlanıyor...");
      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(0xFFE0);
      const char = await service?.getCharacteristic(0xFFE1);
      
      setCharacteristic(char);
      setStatus("Bağlantı Başarılı!");
      addLog("Bağlantı kuruldu!");
      
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        addLog("Seçim iptal edildi.");
        setStatus("Cihaz Seçilmedi");
      } else {
        console.error(err);
        setStatus("Bağlantı Hatası!");
        addLog("Hata: " + err.message);
      }
    }
  };

  const sendCommand = async (cmd: string) => {
    if (characteristic) {
      try {
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(cmd));
      } catch (err) {
        addLog("Veri gönderme hatası!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Üst Header */}
      <header className="w-full p-4 border-b flex justify-between items-center bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Arduino Bluetooth Kontrol Paneli</h1>
        <div className="flex items-center gap-4">
          <span className={`text-xs ${status.includes("Başarılı") ? "text-green-600" : "text-red-600"}`}>{status}</span>
          <button 
            onClick={connectBT}
            className="bg-[#00ff00] hover:bg-[#00cc00] text-white px-6 py-2 rounded-full font-bold transition-all shadow-md active:scale-95"
          >
            BAĞLAN
          </button>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 justify-items-center">
          {[
            { id: "rgb", label: "RGB LED", icon: "🎨" },
            { id: "terminal", label: "BT Terminal", icon: "💻" },
            { id: "joystick", label: "Joystick", icon: "🕹️" },
            { id: "buttons", label: "Butonlar", icon: "🔘" },
            { id: "keypad", label: "4x4 Tuş Takımı", icon: "⌨️" },
            { id: "voice", label: "Ses Terminali", icon: "🎤" },
            { id: "led", label: "LED ON/OFF", icon: "💡" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full aspect-square max-w-[140px] rounded-3xl flex flex-col items-center justify-center gap-3 font-bold transition-all shadow-sm border-2 ${activeTab === tab.id ? "bg-blue-600 text-white border-blue-700 scale-105 shadow-md" : "bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50"}`}
            >
              <span className="text-3xl">{tab.icon}</span>
              <span className="text-xs uppercase tracking-tight leading-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="bg-gray-50 rounded-2xl p-6 border shadow-sm min-h-[400px]">
          {activeTab === "rgb" && <RgbControl sendCommand={sendCommand} />}
          {activeTab === "terminal" && <BluetoothTerminal logs={logs} addLog={addLog} sendCommand={sendCommand} />}
          {activeTab === "joystick" && <JoystickControl sendCommand={sendCommand} />}
          {activeTab === "buttons" && <SimpleLed sendCommand={sendCommand} />}
          {activeTab === "keypad" && <KeypadControl sendCommand={sendCommand} />}
          {activeTab === "voice" && <VoiceControl addLog={addLog} sendCommand={sendCommand} />}
          {activeTab === "led" && <SimpleLed sendCommand={sendCommand} />}
        </div>
      </main>

      {/* Sağ Alt Baud Seçimi */}
      <div className="fixed bottom-4 right-4 bg-white border p-2 rounded-xl shadow-xl flex items-center gap-2">
        <label className="text-xs font-bold text-gray-500">BAUD:</label>
        <select 
          value={baudRate} 
          onChange={(e) => setBaudRate(e.target.value)}
          className="text-sm outline-none bg-transparent font-mono cursor-pointer"
        >
          {baudRates.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </div>
  );
}