"use client";

import { useEffect, useState } from "react";

const COLORS = ["#0b4f6c", "#0f7a8c", "#c81e2e", "#157347", "#92400e"];
const EMOJI = ["🎉", "✨", "🏆", "⭐", "🎊"];

type Piece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  isEmoji: boolean;
  content: string;
};

export default function Confetti({ fire }: { fire: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!fire) return;
    const generated: Piece[] = Array.from({ length: 42 }, (_, i) => {
      const isEmoji = i % 5 === 0;
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        rotate: Math.random() * 360,
        isEmoji,
        content: isEmoji
          ? EMOJI[Math.floor(Math.random() * EMOJI.length)]
          : COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });
    setPieces(generated);
    const t = window.setTimeout(() => setPieces([]), 3200);
    return () => window.clearTimeout(t);
  }, [fire]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-[-5%]"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.isEmoji ? (
            <span style={{ fontSize: 20 }}>{p.content}</span>
          ) : (
            <span
              style={{
                display: "block",
                width: 9,
                height: 14,
                background: p.content,
                borderRadius: 2,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
