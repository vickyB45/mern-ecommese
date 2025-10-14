import React from "react";
import { ShieldCheck, RefreshCcw, Headphones, Truck } from "lucide-react";

const FeatureStrip = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      title: "Secure Payment",
      desc: "100% secure",
    },
    {
      icon: <RefreshCcw className="w-6 h-6 text-blue-500" />,
      title: "30 Days Return",
      desc: "Easy & fast",
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-500" />,
      title: "24/7 Support",
      desc: "Always available",
    },
    {
      icon: <Truck className="w-6 h-6 text-orange-500" />,
      title: "Free Delivery",
      desc: "Above ₹2500",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r  py-6">
      {/* rotated background strip */}

      {/* content */}
      <div className="relative max-w-6xl mx-auto flex flex-wrap justify-around items-center gap-6 px-4 text-center">
        {features.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-shrink-0">{item.icon}</div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureStrip;
