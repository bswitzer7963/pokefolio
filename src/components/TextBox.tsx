import { useEffect, useRef, useState } from 'react';

export interface Message {
  id: number;
  text: string;
  // 'click' waits for input, a number auto-advances after that many ms, 'hold' waits for code
  mode: 'click' | 'hold' | number;
}

const CHAR_MS = 22;

// Typewriter text box. Give it key={message.id} so each message types out from the start.
export function TextBox({ message, onAdvance }: { message: Message | null; onAdvance: () => void }) {
  const [shown, setShown] = useState(0);
  const msgRef = useRef(message);
  useEffect(() => { msgRef.current = message; });
  const text = message?.text ?? '';
  const done = shown >= text.length;

  useEffect(() => {
    if (!message || done) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), CHAR_MS);
    return () => window.clearTimeout(t);
  }, [message, shown, done]);

  useEffect(() => {
    if (!message || !done || typeof message.mode !== 'number') return;
    const t = window.setTimeout(onAdvance, message.mode);
    return () => window.clearTimeout(t);
  }, [done, message, onAdvance]);

  const press = () => {
    const m = msgRef.current;
    if (!m || m.mode === 'hold') return;
    if (!done) setShown(text.length);
    else onAdvance();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!msgRef.current || msgRef.current.mode === 'hold') return;
      if (['Enter', ' ', 'z', 'Z'].includes(e.key)) { e.preventDefault(); press(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!message) return null;
  return (
    <div className="textbox" onClick={press} role="status" aria-live="polite">
      <p aria-hidden>{text.slice(0, shown)}</p>
      <span className="sr-only">{text}</span>
      {done && message.mode === 'click' && <span className="textbox-arrow" aria-hidden>▼</span>}
    </div>
  );
}
