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
            Effective as of August 01, 2023
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
              application is a social media automation through AI application.
              By using the Sweeet AI application, you consent to the data
              practices described in this statement.
            </p>
          </section>

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
            <p className="mt-3">
              We do not collect any personal information about you unless you
              voluntarily provide it to us. However, you may be required to
              provide certain personal information to us when you elect to use
              certain products or services. These may include: registering for
              an account, entering a contest, signing up for special offers,
              sending us an email, or submitting payment information. We use
              this information to communicate with you and provide the services
              requested.
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
            <p className="mt-3">
              Sweeet AI may disclose your personal information without notice if
              required to do so by law or in good faith belief that such action
              is necessary to comply with legal processes, protect and defend
              Sweeet AI&apos;s rights or property, or ensure the safety of users and
              the public.
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
            <p className="mt-3">
              Please note that we may not be able to comply with deletion
              requests if it is necessary to complete transactions, detect fraud
              or security incidents, debug issues, comply with legal obligations,
              or other exceptions permitted by law.
            </p>
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
<h2 className="text-2xl font-semibold mt-10 mb-4">Privacy</h2>
            <p>
              You may connect your Sweeet AI account to third-party accounts.
              By connecting, you consent to sharing your information per the
              third party&apos;s privacy settings. You may disconnect your account at
              any time in the settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              E-mail Communications
            </h2>
            <p>
              From time to time, Sweeet AI may contact you via email for
              announcements, offers, alerts, confirmations, or surveys. To stop
              receiving promotional communications, you may opt out by clicking
              the unsubscribe button in our emails.
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
