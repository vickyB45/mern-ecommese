// pages/shipping-delivery-policy.js

import Head from "next/head";

export default function ShippingDeliveryPolicy() {
  return (
    <>
      <Head>
        <title>Shipping & Delivery Policy - OM ENTERPRISES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-10 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-gray-500 italic mb-8">
            Last updated on Oct 21, 2025
          </p>

          <section className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              At <strong>OM ENTERPRISES</strong>, we aim to deliver your orders
              quickly, safely, and efficiently. We work with trusted courier
              partners to ensure your items reach you on time and in perfect
              condition.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Domestic Shipping
            </h2>
            <p>
              All orders within India are shipped via reputed courier services
              and/or speed post. Orders are usually processed within{" "}
              <strong>5–10 business days</strong> of confirmation. Shipping time
              may vary depending on your location, product availability, and
              courier service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              International Shipping
            </h2>
            <p>
              For international buyers, we deliver orders through registered
              international courier companies or international speed post only.
              Delivery timelines may vary depending on customs and destination
              country regulations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Delivery Timelines
            </h2>
            <p>
              We strive to deliver your products within{" "}
              <strong>8–14 business days</strong> or as per the delivery date
              agreed upon at the time of order confirmation. Please note that
              delays due to courier operations or unforeseen circumstances are
              beyond our control.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Responsibility
            </h2>
            <p>
              Once your order has been dispatched,{" "}
              <strong>OM ENTERPRISES</strong> is not liable for delays caused by
              the courier or postal authorities. We guarantee timely handover of
              your consignment to the courier company within the promised
              dispatch time.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Delivery Address
            </h2>
            <p>
              Orders will be delivered to the address provided during checkout.
              Please ensure your contact details and address are accurate to
              avoid any delays or missed deliveries.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Need Assistance?
            </h2>
            <p>
              For any shipping or delivery-related queries, please contact our
              support team:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mt-4">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:OMENT555@REDIFFMAIL.COM"
                  className="text-blue-600 hover:underline"
                >
                  OMENT555@REDIFFMAIL.COM
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:7004193553"
                  className="text-blue-600 hover:underline"
                >
                  7004193553
                </a>
              </p>
              <p>
                <strong>Address:</strong> BFF-02 SIGNATURE GLOBAL SECT 37D
                GURGAON, HARYANA 122001
              </p>
            </div>

            <p className="text-gray-600 mt-6">
              Thank you for choosing <strong>OM ENTERPRISES</strong>. We
              appreciate your trust and strive to provide a smooth, reliable,
              and transparent shopping experience.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
