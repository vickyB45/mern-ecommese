import Link from "next/link";
import React from "react";

const ProductCard = ({product,tag}) => {
  return (
    <div className="bg-white cursor-pointer  border border-gray-200 overflow-hidden transition-all duration-300 max-w-xs mx-auto">
      {/* Image Section */}
     <Link href={''}>
       <div className="relative">
       <div className="sm:h-[200px] lg:h-[350px]  overflow-hidden">
         <img
          src={product.media[0]?.secure_url}
          className="w-full hover:scale-105 transition-all object-cover duration-300 "
          alt={product.alt}
        />
       </div>
        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[12px] font-semibold px-3 py-1 ">
          {tag}
        </span>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="sm:text-[15px] text-[13px] font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          
        </h3>

        <div className="flex items-center space-x-2 mb-1">
          <span className="text-gray-900 font-semibold sm:text-[15px] text-[13px">
            ₹{product.sellingPrice}.00
            
          </span>
          <span className="text-gray-400 line-through sm:text-[13px] text-[11px">
            
            ₹{product.mrp}.00
          </span>
        </div>
          <span className="text-gray-400 uppercase  sm:text-[15px] text-[13px">
            
            {product?.category?.name}
          </span>
      </div>
     </Link>
    </div>
  );
};

export default ProductCard;
