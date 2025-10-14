"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const images = [
  "/assets/images/slider-1.png",
  "/assets/images/slider-2.png",
  "/assets/images/slider-3.png",
  "/assets/images/slider-4.png",
];

// ✅ Fixed custom arrows
const ArrowNext = ({ className, style, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} w-18 bg-white h-18 flex justify-center items-center rounded-full z-10 top-1/2 -translate-y-1/2`}
      style={{ ...style, display: "flex", right: "1rem" }}
      onClick={onClick}
    >
      <FaAngleRight size={30} className="text-gray-800" />
    </button>
  );
};

const ArrowPrev = ({ className, style, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} w-12 h-12 flex justify-center items-center rounded-full z-10 top-1/2 -translate-y-1/2`}
      style={{ ...style, display: "flex", left: "1rem" }}
      onClick={onClick}
    >
      <FaAngleLeft size={20} className="text-gray-500" />
    </button>
  );
};

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,
  };

  return (
    <div className="w-full overflow-hidden  relative">
      <Slider {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="cursor-grab active:cursor-grabbing">
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-56 lg:h-[450px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainSlider;
