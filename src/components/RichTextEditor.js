import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value = '', onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML === value) return;
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    let start = null;
    if (range) {
      start = range.startOffset;
    }
    el.innerHTML = value;
    if (range && sel && el.firstChild) {
      const newRange = document.createRange();
      const node = el.firstChild;
      const len = node.textContent?.length || 0;
      newRange.setStart(node, Math.min(start, len));
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }, [value]);

  const handleInput = e => {
    if (onChange) onChange(e.currentTarget.innerHTML);
  };

  return (
    <div
      ref={ref}
      contentEditable
      onInput={handleInput}
      style={{ border: '1px solid #ccc', padding: 8, minHeight: 100 }}
    />
  );
}
