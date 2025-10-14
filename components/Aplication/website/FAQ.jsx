"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

// Sample FAQ data
const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy. Products must be unused and in original packaging. Refunds are processed within 5 business days after receiving the return.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping fees and delivery times vary based on the destination. You can check the exact cost at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, we provide a tracking number via email and SMS. You can use it to track your shipment in real-time.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Yes, you can modify your order within 2 hours of placing it. After that, we cannot guarantee changes due to processing.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Payments are secured with SSL encryption.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card
            key={idx}
            className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => toggleFAQ(idx)}
          >
            <CardContent className="flex flex-col">
              {/* Question */}
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">{faq.question}</h4>
                <div className="text-2xl text-gray-500">
                  {openIndex === idx ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
              </div>

              {/* Answer with animation */}
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.p
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-700 mt-3"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
