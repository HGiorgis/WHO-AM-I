import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 30 });
  const trailX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest("a,button,[data-cursor]")) setHovered(true);
      else setHovered(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      {/* Trail dot */}
      <motion.div
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-multiply"
      >
        <motion.div
          animate={{
            width: hovered ? 48 : 32,
            height: hovered ? 48 : 32,
            opacity: hovered ? 0.15 : 0.08,
          }}
          transition={{ duration: 0.3 }}
          className="rounded-full bg-ink"
        />
      </motion.div>
      {/* Main dot */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      >
        <motion.div
          animate={{ width: hovered ? 10 : 7, height: hovered ? 10 : 7 }}
          transition={{ duration: 0.2 }}
          className="rounded-full bg-ink"
        />
      </motion.div>
    </>
  );
}
