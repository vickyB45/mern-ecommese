"use client";

import React from "react";
import Slider from "react-slick";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample testimonials with avatar and rating
const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Men's Fashion Enthusiast",
    review: "The shoes I bought are super comfortable and stylish. Delivery was quick too!",
    avatar: "https://i.pinimg.com/736x/5a/ea/b1/5aeab1efcaf0effacf950d682827c30d.jpg",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "Fashion Lover",
    review: "I love the variety of women's accessories here. The quality is top-notch!",
    avatar: "https://i.pinimg.com/736x/9f/a4/17/9fa417ab06420e06977a29aa4282136e.jpg",
    rating: 4,
},
{
    name: "Amit Patel",
    role: "Footwear Addict",
    review: "Best online store for men’s footwear. Perfect fit and amazing design.",
    avatar: "https://i.pinimg.com/1200x/83/52/5e/83525e55acc6c9b29dc3c9660717caf4.jpg",
    rating: 4,
  },
  {
    name: "Sneha Kapoor",
    role: "Accessory Collector",
    review: "The handbags and belts are gorgeous! Definitely coming back for more.",
    avatar: "https://i.pinimg.com/736x/07/58/e9/0758e9e73b8d9a802d189a621861485f.jpg",
    rating: 4,
  },
  {
    name: "Vikram Singh",
    role: "Style Conscious",
    review: "Great collection of casual and formal shoes. Highly recommend this store!",
    avatar: "https://i.pinimg.com/736x/06/dc/2e/06dc2eb3c465c25595c13297276c8a33.jpg",
    rating: 5,
  },
  {
    name: "Anjali Mehta",
    role: "Fashion Blogger",
    review: "Beautiful jewelry and accessories. Customer service is excellent.",
    avatar: "https://i.pinimg.com/736x/9f/26/f9/9f26f97d6f99816d4eac1865579caa7d.jpg",
    rating: 5,
  },
];

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
      <Slider {...settings}>
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="px-2"
          >
            <Card className="h-full border cursor-grab active:cursor-grabbing border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="flex flex-col justify-between h-full">
                {/* Avatar and Name */}
                <div className="flex items-center mb-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <span className="text-sm text-gray-500">{t.role}</span>
                  </div>
                </div>

                {/* Review */}
                <p className="text-gray-700 mb-3">
  "{t.review.length > 65 ? t.review.slice(0, 65) + "..." : t.review}"
</p>


                {/* Star Rating */}
                <div className="flex">
                  {[...Array(5)].map((_, i) =>
                    i < t.rating ? (
                      <AiFillStar key={i} className="text-yellow-400" />
                    ) : (
                      <AiOutlineStar key={i} className="text-gray-300" />
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
