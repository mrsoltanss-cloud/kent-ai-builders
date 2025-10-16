import { useRef, useState } from "react";
export function useVoice() {
  const recRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  function start(setter: (v: string) => void) {
    // @ts-ignore
    const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = "en-GB"; rec.interimResults = true;
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript;
      setter(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start(); recRef.current = rec; setListening(true);
  }
  function stop() { recRef.current?.stop?.(); setListening(false); }
  return { listening, start, stop };
}
