"use client";

import { useEffect, useState } from "react";
import { Calendar, Mail, Phone } from "lucide-react";

interface Booking {
  id: string;
  booking_uid: string;
  attendee_name: string | null;
  attendee_email: string | null;
  attendee_phone: string | null;
  event_type: string | null;
  starts_at: string | null;
  meeting_url: string | null;
  pipeline_status: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-amber-100 text-amber-700",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Consultations booked through the Schedule a Call page. Availability itself is managed in
        your Cal.com dashboard.
      </p>

      <div className="mt-6 space-y-3">
        {!bookings ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <Calendar className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">No bookings found</p>
            <p className="mt-1 text-sm text-gray-500">
              New bookings will appear here as soon as someone schedules a call.
            </p>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <div>
                <p className="font-semibold text-gray-900">{b.attendee_name || "Unknown"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  {b.attendee_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {b.attendee_email}
                    </span>
                  )}
                  {b.attendee_phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {b.attendee_phone}
                    </span>
                  )}
                </div>
                {b.event_type && <p className="mt-1 text-xs text-gray-400">{b.event_type}</p>}
              </div>
              <div className="text-right">
                {b.starts_at && (
                  <p className="text-sm text-gray-700">
                    {new Date(b.starts_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    STATUS_STYLES[b.pipeline_status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.pipeline_status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
