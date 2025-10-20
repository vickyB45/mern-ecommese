// pages/contact-us.js (or wherever you place it in your Next.js app)

import Head from 'next/head';

export default function ContactUs() {
  return (
    <>
      <Head>
        <title>Contact Us - VIMAL SINGH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-sm text-gray-600 italic mb-6">Last updated on Oct 20 2025</p>
          
          <p className="text-gray-700 mb-4">
            You may contact us using the information below:
          </p>
          
          <div className="text-gray-700 space-y-2">
            <p><strong>Merchant Legal entity name:</strong> VIMAL SINGH</p>
            <p><strong>Registered Address:</strong> uttrakhand almora Almora UTTARAKHAND 263645</p>
            <p><strong>Operational Address:</strong> uttrakhand almora Almora UTTARAKHAND 263645</p>
            <p><strong>Telephone No:</strong> 9389897294</p>
            <p><strong>E-Mail ID:</strong> v.bisht.unic@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
