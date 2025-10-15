"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CursorDot = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const hoverTargets = document.querySelectorAll("button, a, .hover-cursor");

    const handleHoverEnter = () => setIsHover(true);
    const handleHoverLeave = () => setIsHover(false);

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverEnter);
      el.addEventListener("mouseleave", handleHoverLeave);
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverEnter);
        el.removeEventListener("mouseleave", handleHoverLeave);
      });
    };
  }, []);

  const size = isHover ? 48 : 8;
  const offset = size / 2;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed hidden md:block pointer-events-none z-50 rounded-full"
        animate={{
          x: position.x - offset,
          y: position.y - offset,
          width: size,
          height: size,
          backgroundColor: "rgba(0,0,0,1)",
          opacity: isHover ? 0.3 : 1,
          scale: isHover ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
      />
    </AnimatePresence>
  );
};

export default CursorDot;
