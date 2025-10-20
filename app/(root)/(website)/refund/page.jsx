// pages/cancellation-refund-policy.js (or wherever you place it in your Next.js app)

import Head from 'next/head';

export default function CancellationRefundPolicy() {
  return (
    <>
      <Head>
        <title>Cancellation & Refund Policy - VIMAL SINGH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cancellation & Refund Policy</h1>
          <p className="text-sm text-gray-600 italic mb-6">Last updated on Oct 20 2025</p>
          
          <p className="text-gray-700 mb-4">
            VIMAL SINGH believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
          </p>
          
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Cancellations will be considered only if the request is made within 7 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
            <li>VIMAL SINGH does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
            <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 days of receipt of the products.</li>
            <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
            <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
            <li>In case of any Refunds approved by the VIMAL SINGH, it'll take 9-15 days for the refund to be processed to the end customer.</li>
          </ul>
        </div>
      </div>
    </>
  );
}