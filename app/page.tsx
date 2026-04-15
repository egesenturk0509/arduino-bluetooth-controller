"use client";
import { useState } from "react";
import BluetoothView from "./BluetoothView";
import UsbView from "./UsbView";

declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options?: unknown): Promise<any>;
    };
    serial: {
      requestPort(): Promise<any>;
    };
  }
}

export default function EgeRobotKontrol() {
  const [characteristic, setCharacteristic] = useState<any>(null);
  const [status, setStatus] = useState("Bağlı Değil");
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<"bluetooth" | "usb" | null>(null);
  const [baudRate, setBaudRate] = useState("9600");
  const [usbPort, setUsbPort] = useState<any>(null);
  const [usbWriter, setUsbWriter] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const baudRates = ["1200", "2400", "4800", "9600", "19200", "38400", "57600", "115200", "230400", "460800", "921600", "1382400"];

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  };

  const connectUSB = async () => {
    if (typeof navigator === "undefined" || !navigator.serial) {
      addLog("Hata: Web Serial API bu tarayıcıda desteklenmiyor (Chrome/Edge önerilir).");
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: parseInt(baudRate) });
      const writer = port.writable.getWriter();
      setUsbPort(port);
      setUsbWriter(writer);
      setStatus("USB Bağlı");
      addLog("USB Seri bağlantı başarılı!");
    } catch (err: any) {
      setStatus("USB Bağlantı Hatası");
      addLog("USB Hatası: " + err.message);
    }
  };

  const disconnectUSB = async () => {
    try {
      if (usbWriter) {
        usbWriter.releaseLock();
        setUsbWriter(null);
      }
      if (usbPort) {
        await usbPort.close();
        setUsbPort(null);
      }
      setStatus("Bağlı Değil");
      addLog("USB bağlantısı kesildi.");
    } catch (err: any) {
      addLog("USB Kapatma Hatası: " + err.message);
    }
  };

  const connectBT = async () => {
    addLog("Cihaz aranıyor...");

    if (typeof navigator === "undefined" || !navigator.bluetooth) {
      addLog("Hata: Web Bluetooth desteklenmiyor. HTTPS bağlantısı ve Chrome/Edge tarayıcı gereklidir.");
      setStatus("Desteklenmiyor");
      return;
    }

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

  const disconnectBT = () => {
    if (characteristic?.service?.device?.gatt?.connected) {
      characteristic.service.device.gatt.disconnect();
    }
    setCharacteristic(null);
    setStatus("Bağlı Değil");
    addLog("Bluetooth bağlantısı kesildi.");
  };

  const sendCommand = async (cmd: string) => {
    if (characteristic) {
      try {
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(cmd + "\n"));
      } catch (err) {
        addLog("Bluetooth veri gönderme hatası!");
      }
    }
    if (usbWriter) {
      try {
        const encoder = new TextEncoder();
        await usbWriter.write(encoder.encode(cmd + "\n"));
      } catch (err) {
        addLog("USB veri gönderme hatası!");
      }
    }
  };

  const handleLogin = () => {
    if (username === "ege.senturk" && password === "ege0514") {
      setIsLoggedIn(true);
    } else {
      alert("Yanlış kullanıcı adı veya şifre!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-800">Giriş Yap</h2>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Kullanıcı adınızı girin"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Şifrenizi girin"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-600"
            >
              {showPassword ? (
                <span className="relative">
                  👁️
                  <span className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gray-600 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></span>
                </span>
              ) : (
                <span>👁️</span>
              )}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Üst Header */}
      <header className="w-full p-6 border-b flex flex-col items-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter text-center">Arduino Bluetooth ve USB Kontrol Paneli</h1>
        <div className="flex items-center gap-6">
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full border ${status.includes("Bağlı") || status.includes("Başarılı") ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            DURUM: {status.toUpperCase()}
          </span>
          <div className="flex gap-2">
            {characteristic ? (
              <button onClick={disconnectBT} className="bg-[#FF0000] hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs">
                BT BAĞLANTIYI KES
              </button>
            ) : (
              <button onClick={connectBT} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs">
                BT BAĞLAN
              </button>
            )}
            {usbWriter ? (
              <button onClick={disconnectUSB} className="bg-[#FF0000] hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs">
                USB BAĞLANTIYI KES
              </button>
            ) : (
              <button onClick={connectUSB} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs">
                USB BAĞLAN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full relative">
        {connectionMode === null ? (
          /* İlk Seçim: Bluetooth vs USB */
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setConnectionMode("bluetooth")}
              className="w-full aspect-video rounded-[3rem] bg-white flex flex-col items-center justify-center gap-6 font-bold transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hover:scale-105 hover:shadow-2xl active:scale-95 group"
            >
              <span className="text-8xl group-hover:drop-shadow-lg transition-all">📱</span>
              <span className="text-xl uppercase tracking-[0.2em] text-gray-500 group-hover:text-blue-600">Bluetooth Kontrol</span>
            </button>
            <button
              onClick={() => setConnectionMode("usb")}
              className="w-full aspect-video rounded-[3rem] bg-white flex flex-col items-center justify-center gap-6 font-bold transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hover:scale-105 hover:shadow-2xl active:scale-95 group"
            >
              <span className="text-8xl group-hover:drop-shadow-lg transition-all">🔌</span>
              <span className="text-xl uppercase tracking-[0.2em] text-gray-500 group-hover:text-emerald-600">USB Kontrol</span>
            </button>
          </nav>
        ) : connectionMode === "bluetooth" ? (
          <BluetoothView 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setConnectionMode={setConnectionMode}
            sendCommand={sendCommand}
            logs={logs}
            addLog={addLog}
          />
        ) : (
          <UsbView 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setConnectionMode={setConnectionMode}
            usbPort={usbPort}
            sendCommand={sendCommand}
          />
        )}
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