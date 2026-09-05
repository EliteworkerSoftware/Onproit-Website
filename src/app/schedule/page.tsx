import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Schedule a Call | ONPRO IT",
  description:
    "Book a free consultation with ONPRO IT. Pick a time that works for you and we'll talk through managed IT, cabling, or cybersecurity for your business.",
  alternates: {
    canonical: `${SITE_URL}/schedule`,
  },
};

const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

export default function SchedulePage() {
  return (
    <>
      <section className="bg-dark py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Schedule a Call</h1>
          <p className="mt-6 text-lg text-gray-300">
            Pick a time that works for you. We&apos;ll talk through your IT, cabling, or
            cybersecurity needs — no pressure, no obligation.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            {calLink ? (
              <iframe
                src={`https://cal.com/${calLink}?embed=true&theme=light`}
                width="100%"
                height={700}
                style={{ border: "none" }}
                title="Schedule a call with ONPRO IT"
              />
            ) : (
              <div className="p-10 text-center text-sm text-gray-500">
                Booking calendar not connected yet. Set{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand-dark">
                  NEXT_PUBLIC_CAL_LINK
                </code>{" "}
                in your environment variables to your Cal.com link.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
