// pages/about-us.js

import Head from "next/head";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us - Oment</title>
        <meta name="description" content="Learn about Oment — our story, mission, and values." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">About Us</h1>

          {/* Company Background */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">Company Background</h2>
            <p className="text-gray-700 leading-relaxed">
              Oment began as a simple idea: great style should be easy to find. What started as a
              small online shop has grown into{" "}
              <a
                href="https://www.oment.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.oment.store
              </a>{" "}
              — a professional clothing and fashion platform dedicated to delivering thoughtfully
              chosen apparel and footwear. From everyday essentials to standout pieces, our
              collections are curated with care so every item feels useful, reliable, and true to
              your personal style.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">Mission Statement</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to make confident dressing simple. We believe clothing and footwear are
              tools for expression and comfort, and we work to offer products that blend quality,
              practicality, and style. Every choice we make — from sourcing to service — is guided
              by a single aim: help customers look and feel their best with pieces they can trust.
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">Core Values</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Quality first:</strong> We prioritize well-made items that stand up to
                everyday life.
              </li>
              <li>
                <strong>Honest curation:</strong> No fluff — only pieces we genuinely recommend and
                would wear ourselves.
              </li>
              <li>
                <strong>Customer focus:</strong> Reliable service and clear communication are central
                to how we operate.
              </li>
              <li>
                <strong>Accessibility:</strong> Style should be approachable. We offer thoughtful
                options for different budgets and tastes.
              </li>
              <li>
                <strong>Continuous improvement:</strong> We listen, learn, and refine our selections
                and shopping experience regularly.
              </li>
            </ul>
          </div>

          {/* Team Highlights */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">Team Highlights</h2>
            <p className="text-gray-700 leading-relaxed">
              Our team blends fashion know-how with practical sense. Buyers, stylists, and customer
              care specialists work together to source reliable footwear and clothing that suit real
              lives. Behind the scenes, small teams test fits, review materials, and keep a close
              eye on trends so you receive items that are both current and dependable. We’re driven
              by a shared passion for clothing and a commitment to honest service.
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Explore Our Collection</h2>
            <p className="text-gray-700 mb-6">
              Discover our latest arrivals and find pieces that fit your life. Sign up for updates
              to get styling tips and first access to new drops.
            </p>
            <a
              href="https://www.oment.store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Visit www.oment.store
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
