import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"]')
        );
        const is3DElement = Boolean(target.closest('[title*="3D"], [title*="вращения"], canvas'));

        setIsHovered(isClickable || is3DElement);

        if (is3DElement) {
          setCursorText('3D');
        } else {
          setCursorText('');
        }
      }
    };

    const onMouseDown = () => setIsPointerDown(true);
    const onMouseUp = () => setIsPointerDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing spring/lerp effect
  useEffect(() => {
    let frameId: number;
    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22,
      }));
      frameId = requestAnimationFrame(updateTrailing);
    };
    frameId = requestAnimationFrame(updateTrailing);
    return () => cancelAnimationFrame(frameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer trailing ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,background-color,border-color] duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-12 h-12 border-[#78BDB6] bg-[#78BDB6]/15 backdrop-blur-[2px]'
            : 'w-8 h-8 border-[#C68A52]/60 bg-transparent'
        } ${isPointerDown ? 'scale-75' : 'scale-100'}`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-black tracking-widest text-[#78BDB6]">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center sharp turquoise dot */}
      <div
        className="fixed w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#78BDB6] shadow-[0_0_8px_#78BDB6]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </div>
  );
};
