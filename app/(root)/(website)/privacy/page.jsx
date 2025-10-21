// pages/privacy-policy.js

import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - OM ENTERPRISES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 italic mb-8">Last updated on Oct 21, 2025</p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            This privacy policy sets out how <strong>OM ENTERPRISES</strong> uses and protects any information that you provide when you visit our website and/or agree to purchase from us.
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            OM ENTERPRISES is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, it will only be used in accordance with this privacy statement.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            OM ENTERPRISES may change this policy from time to time by updating this page. You should check this page periodically to ensure that you adhere to these changes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">We may collect the following information:</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Name</li>
            <li>Contact information including email address</li>
            <li>Demographic information such as postcode, preferences and interests, if required</li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">What we do with the information we gather</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Internal record keeping.</li>
            <li>Improving our products and services.</li>
            <li>Sending promotional emails about new products, special offers, or other information using the email address you provide.</li>
            <li>Contacting you for market research purposes via email, phone, or mail, and customizing the website according to your interests.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Controlling your personal information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Look for the opt-out checkbox when filling forms for direct marketing purposes.</li>
            <li>You may change your mind about direct marketing at any time by contacting us at <a href="mailto:OMENT555@REDIFFMAIL.COM" className="text-blue-600 hover:underline">OMENT555@REDIFFMAIL.COM</a>.</li>
          </ul>

          <p className="text-gray-700 mb-4">
            We will not sell, distribute, or lease your personal information to third parties unless required by law or with your consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">How we use cookies</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            A cookie is a small file placed on your device to help analyze web traffic or identify when you visit our site. Cookies allow us to respond to you as an individual and customize our website based on your preferences.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We use cookies to monitor which pages are being used, for statistical analysis, and to improve our website. All collected data is removed after analysis.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            You can accept or decline cookies. Modifying your browser settings may prevent you from taking full advantage of the website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Information</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Company:</strong> OM ENTERPRISES</p>
            <p><strong>Email:</strong> <a href="mailto:OMENT555@REDIFFMAIL.COM" className="text-blue-600 hover:underline">OMENT555@REDIFFMAIL.COM</a></p>
            <p><strong>Phone:</strong> <a href="tel:7004193553" className="text-blue-600 hover:underline">7004193553</a></p>
            <p><strong>Address:</strong> BFF-02, Signature Global, Sector 37D, Gurgaon, Haryana – 122001</p>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">
            If you believe any information we hold about you is incorrect or incomplete, please contact us. We will promptly correct any information found to be incorrect.
          </p>
        </div>
      </div>
    </>
  );
}
