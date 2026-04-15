"use client";
import { useState, useEffect } from "react";

// TypeScript'e navigator içinde bluetooth olduğunu tanımlıyoruz
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

  // Terminale mesaj yazdırma fonksiyonu
  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 5));
  };

  // Bluetooth Bağlantısı (Hata Yönetimi Eklenmiş Versiyon)
  const connectBT = async () => {
    addLog("Cihaz aranıyor...");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [0xFFE0] }], // HC-06 servisi
        optionalServices: [0xFFE1]
      });
      
      setStatus("Bağlanıyor...");
      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(0xFFE0);
      const char = await service?.getCharacteristic(0xFFE1);
      
      setCharacteristic(char);
      setStatus("Bağlantı Başarılı! 🦅");
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

  // Komut Gönder
  const sendCommand = async (cmd: string) => {
    if (characteristic) {
      try {
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(cmd));
        addLog(`Komut: ${cmd}`);
      } catch (err) {
        addLog("Gönderim hatası!");
      }
    }
  };

  // Klavye Kontrolleri
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowUp") sendCommand("F");
      if (e.key === "ArrowDown") sendCommand("B");
      if (e.key === "ArrowLeft") sendCommand("L");
      if (e.key === "ArrowRight") sendCommand("R");
    };
    const handleKeyUp = () => sendCommand("S");

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [characteristic]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-mono">
      <h1 className="text-3xl font-bold mb-2 text-blue-500">EGE ROBOTICS CONTROL</h1>
      <p className="mb-6 text-sm">Durum: <span className={status.includes("Başarılı") ? "text-green-400" : "text-red-400"}>{status}</span></p>

      <button 
        onClick={connectBT}
        className="bg-blue-600 hover:bg-blue-700 active:scale-95 px-8 py-3 rounded-xl font-bold mb-10 transition-all shadow-lg shadow-blue-900"
      >
        BLUETOOTH BAĞLAN
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Hareket ve Sulama Alanı */}
        <div className="flex flex-col items-center p-8 bg-gray-900 rounded-3xl border border-blue-900 shadow-2xl">
          <h2 className="mb-6 font-bold text-blue-400 text-xl tracking-widest text-center">KONTROL PANELİ</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-10">
            <div />
            <button onMouseDown={() => sendCommand("F")} onMouseUp={() => sendCommand("S")} className="bg-gray-800 h-16 w-16 rounded-xl text-2xl active:bg-blue-600 flex items-center justify-center">⬆️</button>
            <div />
            <button onMouseDown={() => sendCommand("L")} onMouseUp={() => sendCommand("S")} className="bg-gray-800 h-16 w-16 rounded-xl text-2xl active:bg-blue-600 flex items-center justify-center">⬅️</button>
            <button onClick={() => sendCommand("S")} className="bg-red-600 h-16 w-16 rounded-xl font-bold text-xs flex items-center justify-center">DUR</button>
            <button onMouseDown={() => sendCommand("R")} onMouseUp={() => sendCommand("S")} className="bg-gray-800 h-16 w-16 rounded-xl text-2xl active:bg-blue-600 flex items-center justify-center">➡️</button>
            <div />
            <button onMouseDown={() => sendCommand("B")} onMouseUp={() => sendCommand("S")} className="bg-gray-800 h-16 w-16 rounded-xl text-2xl active:bg-blue-600 flex items-center justify-center">⬇️</button>
            <div />
          </div>

          <button 
            onMouseDown={() => sendCommand("W")} 
            onMouseUp={() => sendCommand("w")}
            className="w-full bg-blue-500 hover:bg-blue-400 active:bg-blue-800 py-6 rounded-2xl font-black text-2xl transition-all shadow-inner"
          >
            💦 SU SIK 💦
          </button>
        </div>

        {/* Terminal Log Alanı */}
        <div className="p-8 bg-gray-900 rounded-3xl border border-green-900">
          <h2 className="mb-4 font-bold text-green-500">SİSTEM TERMİNALİ</h2>
          <div className="bg-black p-4 rounded-xl h-40 overflow-hidden border border-gray-800 flex flex-col gap-1">
            {logs.map((log, index) => (
              <p key={index} className="text-green-500 text-xs font-mono">
                <span className="opacity-50">{">"}</span> {log}
              </p>
            ))}
            <div className="w-2 h-4 bg-green-500 animate-pulse"></div>
          </div>
          <p className="mt-6 text-[10px] text-gray-500 italic text-center uppercase tracking-widest">İlter Robot Takımı // Ege Şentürk</p>
        </div>
      </div>
    </div>
  );
}