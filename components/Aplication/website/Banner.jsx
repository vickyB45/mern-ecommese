"use client";
import { motion } from "framer-motion";

const cards = [
  {
    img: "https://res.cloudinary.com/dwpp4trl9/image/upload/v1760597331/uploads/mejotcdsiok708rhckw0.png",
    heading: "Up To 70%",
    btnText: "Shop Now",
    btnLink: "#shop",
    delay: 0,
  },
  {
      img: "https://res.cloudinary.com/dwpp4trl9/image/upload/v1760597331/uploads/kgomgwakclptcgd0fxgn.png",
    heading: "New Arrival",
    btnText: "Explore More",
    btnLink: "#explore",
    delay: 0.2,
  },
];

const Banner = () => {
  return (
    <section className="md:py-12 py-4 bg-white">
      <div className="container mx-auto  md:px-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: card.delay, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            
            <img
              src={card.img}
              alt={card.heading}
              className="w-full xl:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-700"></div>

            <div className="absolute  left-6 bottom-6 text-white space-y-3">
              <motion.h3
                className="md:text-5xl text-3xl font-extrabold"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay + 0.2 }}
                viewport={{ once: true }}
              >
                {card.heading}
              </motion.h3>
              <motion.a
                href={card.btnLink}
                className="bg-white text-black px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition inline-block"
                whileHover={{ scale: 1.05 }}
              >
                {card.btnText}
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Banner;
