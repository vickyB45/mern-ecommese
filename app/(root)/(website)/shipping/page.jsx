// pages/shipping-delivery-policy.js (or wherever you place it in your Next.js app)

import Head from 'next/head';

export default function ShippingDeliveryPolicy() {
  return (
    <>
      <Head>
        <title>Shipping & Delivery Policy - VIMAL SINGH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping & Delivery Policy</h1>
          <p className="text-sm text-gray-600 italic mb-6">Last updated on Oct 20 2025</p>
          
          <p className="text-gray-700 mb-4">
            For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.
          </p>
          
          <p className="text-gray-700 mb-4">
            Orders are shipped within 8-14 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
          </p>
          
          <p className="text-gray-700 mb-4">
            VIMAL SINGH is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 8-14 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
          </p>
          
          <p className="text-gray-700 mb-4">
            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
          </p>
          
          <p className="text-gray-700">
            For any issues in utilizing our services you may contact our helpdesk on 9389897294 or v.bisht.unic@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
