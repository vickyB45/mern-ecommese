// pages/terms-conditions.js

import Head from "next/head";

export default function TermsConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - OM ENTERPRISES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 italic mb-8">
            Last updated on Oct 21, 2025
          </p>

          <p className="text-gray-700 mb-5 leading-relaxed">
            For the purpose of these Terms and Conditions, the term{" "}
            <strong>"we"</strong>, <strong>"us"</strong>, or{" "}
            <strong>"our"</strong> refers to{" "}
            <strong>OM ENTERPRISES</strong>, whose registered/operational office
            is <strong>BFF-02, Signature Global, Sector 37D, Gurgaon, Haryana – 122001</strong>.{" "}
            The term <strong>"you"</strong>, <strong>"your"</strong>, or{" "}
            <strong>"user"</strong> refers to any natural or legal person who
            visits our website and/or agrees to purchase from us.
          </p>

          <p className="text-gray-700 mb-5">
            Your use of our website and/or purchase from OM ENTERPRISES is
            governed by the following Terms and Conditions:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-8 space-y-3 leading-relaxed">
            <li>
              The content of the pages of this website is subject to change
              without notice.
            </li>
            <li>
              Neither we nor any third parties provide any warranty or guarantee
              as to the accuracy, timeliness, performance, completeness or
              suitability of the information and materials found or offered on
              this website for any particular purpose. You acknowledge that such
              information and materials may contain inaccuracies or errors, and
              we expressly exclude liability for any such inaccuracies or errors
              to the fullest extent permitted by law.
            </li>
            <li>
              Your use of any information or materials on our website or product
              pages is entirely at your own risk, for which we shall not be
              liable. It shall be your responsibility to ensure that any
              products, services, or information available through our website
              meet your specific requirements.
            </li>
            <li>
              This website contains material that is owned by or licensed to us.
              This material includes, but is not limited to, the design, layout,
              look, appearance, and graphics. Reproduction is prohibited other
              than in accordance with the copyright notice, which forms part of
              these Terms and Conditions.
            </li>
            <li>
              All trademarks reproduced on this website, which are not the
              property of or licensed to the operator, are acknowledged on the
              website.
            </li>
            <li>
              Unauthorized use of this website or its materials may give rise to
              a claim for damages and/or be a criminal offense.
            </li>
            <li>
              From time to time, our website may also include links to other
              websites. These links are provided for your convenience to provide
              further information. We have no responsibility for the content of
              the linked websites.
            </li>
            <li>
              You may not create a link to our website from another website or
              document without OM ENTERPRISES’s prior written consent.
            </li>
            <li>
              Any dispute arising out of the use of our website, purchase, or
              any engagement with us is subject to the laws of India, with
              jurisdiction in Haryana.
            </li>
            <li>
              We shall not be liable for any loss or damage arising directly or
              indirectly due to the decline of authorization for any transaction
              caused by the cardholder exceeding their preset limit with the
              bank.
            </li>
          </ul>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Contact Information
            </h2>
            <p>
              <strong>Company:</strong> OM ENTERPRISES
            </p>
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
              <strong>Address:</strong> BFF-02, Signature Global, Sector 37D,
              Gurgaon, Haryana – 122001
            </p>
          </div>

          <p className="text-gray-600 mt-8">
            By using our website, you acknowledge that you have read,
            understood, and agreed to these Terms & Conditions.
          </p>
        </div>
      </div>
    </>
  );
}
