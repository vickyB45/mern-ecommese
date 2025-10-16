import React from "react";
import ReactMarkdown from "react-markdown";

const ProductDescription = ({ description }) => {
  return (
    <div className="prose prose-sm sm:prose-base">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
};

export default ProductDescription