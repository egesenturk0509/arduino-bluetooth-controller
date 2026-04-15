"use client";
import { useState } from "react";

export default function VoiceControl({ addLog, sendCommand }: { addLog: (m: string) => void, sendCommand: (c: string) => void }) {
  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    // Burada ileride Web Speech API entegrasyonu yapılabilir
    setIsListening(!isListening);
    if (!isListening) {
      addLog("Mikrofon dinleniyor...");
      // Örnek: sendCommand("VOICE_START");
    } else {
      addLog("Dinleme durduruldu.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 h-64">
      <div 
        onClick={toggleListen}
        className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg ${isListening ? "bg-red-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        <span className="text-white text-3xl">🎤</span>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-700">{isListening ? "Sizi dinliyorum..." : "Konuşmak için basın"}</p>
        <p className="text-sm text-gray-400">Ses verisine göre komut gönderilir</p>
      </div>
    </div>
  );
}