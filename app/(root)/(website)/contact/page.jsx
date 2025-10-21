// app/contact/page.jsx
"use client";

import React from "react";
import { useFormik } from "formik";
import { showToast } from "@/lib/showToast"; // make sure this path is correct

export default function ContactPage() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      comment: "",
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      showToast({ type: "success", message: "Message sent successfully!" });
      resetForm(); // Reset the form after submission
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">We are here to help!</h1>
          <p className="text-gray-700">
            Welcome to <span className="font-semibold">OMENT.STORE</span>, We’re always eager to hear from you. 
            Whether you want to share feedback, ask questions, or simply say hello, we’re here and ready to listen. 
            Your thoughts and suggestions help us grow, improve, and deliver a better experience.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">You can contact us for any of the following:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Website Feedback:</strong> Share your thoughts on our website's design or functionality.</li>
            <li><strong>Content Queries:</strong> Ask questions or request clarification on our content.</li>
            <li><strong>Corrections or Updates:</strong> Notify us of outdated or incorrect information.</li>
            <li><strong>Design Suggestions:</strong> Ideas to improve website appearance or usability.</li>
            <li><strong>Improvement Suggestions:</strong> Suggestions to enhance content, tools, or features.</li>
            <li><strong>Technical Issues:</strong> Report errors, bugs, or other issues you encounter.</li>
          </ul>

          <div className="mt-6 space-y-2 text-gray-700">
            <p>Email: <a href="mailto:OMENT555@REDIFFMAIL.COM" className="text-blue-600">OMENT555@REDIFFMAIL.COM</a></p>
            <p>Phone: <a href="tel:+917004193553" className="text-blue-600">7004193553</a></p>
            <p>Address: BFF-02 SIGNATURE GLOBAL SECT 37D, GURGAON, HARYANA 122001</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Comment</label>
              <textarea
                name="comment"
                rows="4"
                onChange={formik.handleChange}
                value={formik.values.comment}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
