"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <section className="py-20 md:py-28 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Effective as of January 02, 2026
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-10 leading-relaxed text-gray-700"
        >
          <section>
            <p>
              Protecting your private information is our priority. This
              Statement of Privacy applies to GetSweet.AI, and SWEEET AI LLC and
              governs data collection and usage. For the purposes of this
              Privacy Policy, unless otherwise noted, all references to SWEEET
              AI LLC include 3400 Cottage Way and Sweeet AI. The Sweeet AI
              application is an AI-powered platform for social media automation
              and advertising management. By using the Sweeet AI application,
              you consent to the data practices described in this statement.
            </p>
          </section>

          {/* 🛡️ SECCIÓN CRÍTICA PARA GOOGLE - NO BORRAR NI MODIFICAR */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Google User Data & Limited Use Policy
            </h2>
            <p className="mb-4 font-medium text-gray-800">
              GetSweet.AI&apos;s use and transfer to any other app of
              information received from Google APIs will adhere to{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  1. Data We Access
                </h3>
                <p>
                  We strictly access your Google Ads account hierarchy, campaign
                  metadata (names, IDs, status), and performance metrics
                  (impressions, clicks, cost) solely to generate the audits and
                  reports requested by you.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  2. How We Use Your Data
                </h3>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    <strong>Analytics:</strong> To visualize your marketing
                    performance within our dashboard.
                  </li>
                  <li>
                    <strong>AI Processing:</strong> Your campaign data is
                    processed by our internal AI models to generate specific
                    optimization suggestions for <em>your</em> account.{" "}
                    <strong>
                      We do not use your data to train generalized AI models for
                      other users.
                    </strong>
                  </li>
                  <li>
                    <strong>Management:</strong> To execute &quot;Pause&quot;
                    commands on campaigns only when explicitly triggered by you.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  3. Data Retention & Security
                </h3>
                <p>
                  Your Google Ads refresh tokens are stored using
                  industry-standard <strong>AES-256 encryption</strong> at rest.
                  We do not store historical performance data permanently; it is
                  fetched on-demand. Upon disconnection via the settings menu,
                  all access tokens are permanently deleted from our servers.
                </p>
              </div>
            </div>
          </section>
          {/* 🛡️ FIN SECCIÓN GOOGLE */}

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Collection of Your Personal Information
            </h2>
            <p className="mb-3">
              In order to better provide you with products and services offered,
              Sweeet AI may collect personally identifiable information, such as
              your:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>First and Last Name</li>
              <li>Mailing Address</li>
              <li>E-mail Address</li>
              <li>Phone Number</li>
              <li>Employer</li>
              <li>Job Title</li>
            </ul>
            <p className="mt-3">
              If you purchase Sweeet AI&apos;s products and services, we collect
              billing and credit card information. This information is used to
              complete the purchase transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Use of Your Personal Information
            </h2>
            <p>
              Sweeet AI collects and uses your personal information to operate
              and deliver the services you have requested. We may also use your
              information to inform you of other products or services available
              from Sweeet AI and its affiliates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Sharing Information with Third Parties
            </h2>
            <p>
              Sweeet AI does not sell, rent, or lease its customer lists to
              third parties. We may share data with trusted partners to help
              perform statistical analysis, send you communications, provide
              customer support, or arrange for deliveries. These partners are
              required to maintain the confidentiality of your information and
              use it only to provide services to Sweeet AI.
            </p>
            <p className="mt-3 font-semibold text-red-600">
              *Note: Google User Data accessed via OAuth scopes is NEVER sold to
              data brokers or shared with third-party advertising platforms.*
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Right to Deletion
            </h2>
            <p className="mb-3">
              Subject to certain exceptions, on receipt of a verifiable request
              from you, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delete your personal information from our records.</li>
              <li>
                Direct any service providers to delete your personal information
                from their records.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Children Under Thirteen
            </h2>
            <p>
              Sweeet AI does not knowingly collect personally identifiable
              information from children under the age of thirteen. If you are
              under thirteen, you must ask your parent or guardian for
              permission to use this application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Changes to This Statement
            </h2>
            <p>
              Sweeet AI reserves the right to change this Privacy Policy from
              time to time. We will notify you about significant changes by
              posting an updated notice or contacting you via email. Continued
              use of the service constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Contact Information
            </h2>
            <p>
              Sweeet AI welcomes your questions or comments regarding this
              Privacy Policy:
            </p>
            <div className="mt-4 space-y-1">
              <p className="font-medium">SWEEET AI LLC</p>
              <p>Ste G2 #805</p>
              <p>Sacramento, California 95825</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:nathan@getsweet.ai"
                  className="text-purple-600 hover:underline"
                >
                  nathan@getsweet.ai
                </a>
              </p>
              <p>Phone: 415-819-7530</p>
            </div>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
