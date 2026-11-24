import { useContext, type CSSProperties, type ReactNode } from 'react';
import { HintContext } from './hintContext';

// Wraps a game term (Badges, POW, Lv...) and explains it on hover, focus or tap.
interface Props {
  text: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  focusable?: boolean; // false when the child is already a button or link
}

export function Hint({ text, children, className = '', style, focusable = true }: Props) {
  const show = useContext(HintContext);
  return (
    <span
      className={`hint ${className}`}
      style={style}
      tabIndex={focusable ? 0 : undefined}
      aria-label={focusable ? text : undefined}
      onPointerEnter={(e) => e.pointerType === 'mouse' && show(text, e.currentTarget)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && show(null)}
      onPointerDown={(e) => { if (e.pointerType !== 'mouse') { e.stopPropagation(); show(text, e.currentTarget); } }}
      onFocus={(e) => show(text, e.currentTarget)}
      onBlur={() => show(null)}
    >
      {children}
    </span>
  );
}
