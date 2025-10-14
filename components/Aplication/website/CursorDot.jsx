"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CursorDot = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const hoverElements = document.querySelectorAll("button, a, .hover-cursor");

    const handleMouseEnter = () => setIsHover(true);
    const handleMouseLeave = () => setIsHover(false);

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed hidden md:block pointer-events-none z-50 rounded-full"
        animate={{
          x: position.x - (isHover ? 24 : 8),
          y: position.y - (isHover ? 24 : 8),
          width: isHover ? 48 : 16,
          height: isHover ? 48 : 16,
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
