import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | ONPRO IT",
  description:
    "Read the ONPRO IT privacy policy to learn how we collect, use, and protect your information.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: September 5, 2026</p>

        <div className="mt-8 space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
            <p className="mt-2">
              At ONPRO IT (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your
              privacy and are committed to protecting the personal data we hold about you. This
              policy explains how we collect, use, and share your personal data when you visit our
              website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
            <p className="mt-2">We may collect and process the following data about you:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Information you give us: information you provide by filling in forms on our
                website (such as our contact form) or by corresponding with us by phone, email, or
                otherwise.
              </li>
              <li>
                Technical information: including the Internet protocol (IP) address used to
                connect your computer to the Internet, browser type and version, time zone
                setting, browser plug-in types and versions, and operating system and platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
            <p className="mt-2">We use the information held about you in the following ways:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                To carry out our obligations arising from any contracts entered into between you
                and us and to provide you with the information, products, and services that you
                request from us.
              </li>
              <li>
                To provide you with information about other goods and services we offer that are
                similar to those that you have already purchased or enquired about.
              </li>
              <li>To notify you about changes to our services.</li>
              <li>
                To ensure that content from our site is presented in the most effective manner for
                you and for your computer.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Disclosure of Your Information</h2>
            <p className="mt-2">
              We do not sell your personal data to third parties. We may share your information
              with selected third parties including:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Business partners, suppliers, and sub-contractors for the performance of any
                contract we enter into with you.
              </li>
              <li>
                Analytics and search engine providers that assist us in the improvement and
                optimization of our site.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Security</h2>
            <p className="mt-2">
              We take appropriate security measures to protect against unauthorized access to or
              unauthorized alteration, disclosure, or destruction of data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
            <p className="mt-2">
              You have the right to ask us not to process your personal data for marketing
              purposes. You can exercise your right to prevent such processing by checking certain
              boxes on the forms we use to collect your data or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Contact</h2>
            <p className="mt-2">
              Questions, comments, and requests regarding this privacy policy are welcomed and
              should be addressed to our support team via the contact form on our website.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
