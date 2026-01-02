"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Effective as of January 02, 2026
          </p>
        </motion.div>

        {/* content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8 leading-relaxed text-gray-700"
        >
          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Agreement between User and <strong>GetSweet.AI</strong>
            </h2>
            <p>
              Welcome to getsweet.ai. The getsweet.ai website (the
              &quot;Site&quot;) is comprised of various web pages operated by
              SWEEET AI LLC (&quot;Sweeet AI&quot;). getsweet.ai is offered to
              you conditioned on your acceptance without modification of the
              terms, conditions, and notices contained herein (the
              &quot;Terms&quot;). Your use of getsweet.ai constitutes your
              agreement to all such Terms. Please read these terms carefully,
              and keep a copy of them for your reference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Description of Service
            </h2>
            <p className="mb-4">
              GetSweet.ai is a SaaS (Software as a Service) platform designed to
              provide AI-driven social media automation and advertising campaign
              management tools for businesses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Privacy
            </h2>
            <p className="mb-4">
              Your use of getsweet.ai is subject to Sweeet AI&apos;s Privacy
              Policy. Please review our Privacy Policy, which also governs the
              Site and informs users of our data collection practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Electronic Communications
            </h2>
            <p className="mb-4">
              Visiting getsweet.ai or sending emails to Sweeet AI constitutes
              electronic communications. You consent to receive electronic
              communications and you agree that all agreements, notices,
              disclosures and other communications that we provide to you
              electronically, via email and on the Site, satisfy any legal
              requirement that such communications be in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Your Account
            </h2>
            <p className="mb-4">
              If you use this site, you are responsible for maintaining the
              confidentiality of your account and password and for restricting
              access to your computer, and you agree to accept responsibility
              for all activities that occur under your account or password. You
              may not assign or otherwise transfer your account to any other
              person or entity. You acknowledge that Sweeet AI is not
              responsible for third party access to your account that results
              from theft or misappropriation of your account. Sweeet AI and its
              associates reserve the right to refuse or cancel service,
              terminate accounts, or remove or edit content in our sole
              discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Children Under Thirteen
            </h2>
            <p className="mb-4">
              Sweeet AI does not knowingly collect, either online or offline,
              personal information from persons under the age of thirteen. If
              you are under 18, you may use getsweet.ai only with permission of
              a parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Cancellation/Refund Policy
            </h2>
            <p className="mb-4">
              You may cancel your subscription at any time via the user settings
              dashboard. Access to the service will continue until the end of
              your current billing period. Refunds are handled on a case-by-case
              basis and are not guaranteed for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Links to Third Party Sites/Third Party Services
            </h2>
            <p className="mb-4">
              Getsweet.ai may contain links to other websites (&quot;Linked
              Sites&quot;). The Linked Sites are not under the control of Sweeet
              AI and Sweeet AI is not responsible for the contents of any Linked
              Site, including without limitation any link contained in a Linked
              Site, or any changes or updates to a Linked Site. Sweeet AI is
              providing these links to you only as a convenience, and the
              inclusion of any link does not imply endorsement by Sweeet AI of
              the site or any association with its operators.
            </p>
            <p className="mb-4">
              Certain services made available via getsweet.ai are delivered by
              third party sites and organizations (e.g., Google Ads, Facebook).
              By using any product, service or functionality originating from
              the getsweet.ai domain, you hereby acknowledge and consent that
              Sweeet AI may share such information and data with any third party
              with whom Sweeet AI has a contractual relationship to provide the
              requested product, service or functionality on behalf of
              getsweet.ai users and customers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              No Unlawful or Prohibited Use/Intellectual Property
            </h2>
            <p className="mb-4">
              You are granted a non-exclusive, non-transferable, revocable
              license to access and use getsweet.ai strictly in accordance with
              these terms of use. As a condition of your use of the Site, you
              warrant to Sweeet AI that you will not use the Site for any
              purpose that is unlawful or prohibited by these Terms. You may not
              use the Site in any manner which could damage, disable,
              overburden, or impair the Site or interfere with any other
              party&apos;s use and enjoyment of the Site. You may not obtain or
              attempt to obtain any materials or information through any means
              not intentionally made available or provided for through the Site.
            </p>
            <p className="mb-4">
              All content included as part of the Service, such as text,
              graphics, logos, images, as well as the compilation thereof, and
              any software used on the Site, is the property of Sweeet AI or its
              suppliers and protected by copyright and other laws that protect
              intellectual property and proprietary rights. You agree to observe
              and abide by all copyright and other proprietary notices, legends
              or other restrictions contained in any such content and will not
              make any changes thereto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Third Party Accounts & API Usage
            </h2>
            <p className="mb-4">
              You will be able to connect your Sweeet AI account to third party
              accounts (including but not limited to Google Ads). By connecting
              your Sweeet AI account to your third party account, you
              acknowledge and agree that you are consenting to the continuous
              release of information about you to others (in accordance with
              your privacy settings on those third party sites). If you do not
              want information about you to be shared in this manner, do not use
              this feature. You agree to comply with the Terms of Service of any
              connected third-party platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              International Users
            </h2>
            <p className="mb-4">
              The Service is controlled, operated and administered by Sweeet AI
              from our offices within the USA. If you access the Service from a
              location outside the USA, you are responsible for compliance with
              all local laws. You agree that you will not use the Sweeet AI
              Content accessed through getsweet.ai in any country or in any
              manner prohibited by any applicable laws, restrictions or
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Indemnification
            </h2>
            <p className="mb-4">
              You agree to indemnify, defend and hold harmless Sweeet AI, its
              officers, directors, employees, agents and third parties, for any
              losses, costs, liabilities and expenses (including reasonable
              attorney&apos;s fees) relating to or arising out of your use of or
              inability to use the Site or services, any user postings made by
              you, your violation of any terms of this Agreement or your
              violation of any rights of a third party, or your violation of any
              applicable laws, rules or regulations. Sweeet AI reserves the
              right, at its own cost, to assume the exclusive defense and
              control of any matter otherwise subject to indemnification by you,
              in which event you will fully cooperate with Sweeet AI in
              asserting any available defenses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Arbitration
            </h2>
            <p className="mb-4">
              In the event the parties are not able to resolve any dispute
              between them arising out of or concerning these Terms and
              Conditions, or any provisions hereof, whether in contract, tort,
              or otherwise at law or in equity for damages or any other relief,
              then such dispute shall be resolved only by final and binding
              arbitration pursuant to the Federal Arbitration Act, conducted by
              a single neutral arbitrator and administered by the American
              Arbitration Association, or a similar arbitration service selected
              by the parties, in a location mutually agreed upon by the parties.
              The arbitrator&apos;s award shall be final, and judgment may be
              entered upon it in any court having jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Class Action Waiver
            </h2>
            <p className="mb-4">
              Any arbitration under these Terms and Conditions will take place
              on an individual basis; class arbitrations and
              class/representative/collective actions are not permitted. THE
              PARTIES AGREE THAT A PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY
              IN EACH&apos;S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR
              CLASS MEMBER IN ANY PUTATIVE CLASS, COLLECTIVE AND/ OR
              REPRESENTATIVE PROCEEDING, SUCH AS IN THE FORM OF A PRIVATE
              ATTORNEY GENERAL ACTION AGAINST THE OTHER.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Liability Disclaimer
            </h2>
            <p className="mb-4 font-medium">
              THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR
              AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR
              TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE
              INFORMATION HEREIN. SWEEET AI LLC AND/OR ITS SUPPLIERS MAY MAKE
              IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.
            </p>
            <p className="mb-4 font-medium">
              SWEEET AI LLC AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT
              THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND
              ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND
              RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE
              MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION,
              SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED
              &quot;AS IS&quot; WITHOUT WARRANTY OR CONDITION OF ANY KIND.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Termination/Access Restriction
            </h2>
            <p className="mb-4">
              Sweeet AI reserves the right, in its sole discretion, to terminate
              your access to the Site and the related services or any portion
              thereof at any time, without notice. To the maximum extent
              permitted by law, this agreement is governed by the laws of the
              State of California and you hereby consent to the exclusive
              jurisdiction and venue of courts in California in all disputes
              arising out of or relating to the use of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900">
              Changes to Terms
            </h2>
            <p className="mb-4">
              Sweeet AI reserves the right, in its sole discretion, to change
              the Terms under which getsweet.ai is offered. The most current
              version of the Terms will supersede all previous versions. Sweeet
              AI encourages you to periodically review the Terms to stay
              informed of our updates.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Contact Us
            </h2>
            <p className="mb-4">
              Sweeet AI welcomes your questions or comments regarding the Terms:
            </p>
            <address className="not-italic space-y-1 text-gray-600">
              <p className="font-medium text-gray-900">SWEEET AI LLC</p>
              <p>3400 Cottage Way Ste G2 #805</p>
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
            </address>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
