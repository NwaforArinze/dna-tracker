import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderByTrackingId } from "../services/testService";
import StatusTimeline from "../components/StatusTimeline";
import { clientTypeMap, statusToStep } from "../utils/trackingMapper";

export default function StatusPage() {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { trackingId } = useParams();

  const session = JSON.parse(
    sessionStorage.getItem("dna_last_verified") || "null",
  );

  useEffect(() => {
    async function fetchTracking() {
      try {
        const res = await getOrderByTrackingId(trackingId);

        if (res.status !== "success") {
          setError("Tracking ID not found");
          return;
        }

        const apiData = res.data;

        setTest({
          trackingId: apiData.tracking_id,

          scenario: clientTypeMap[apiData.client_type] || "walkin",

          currentStep: statusToStep(apiData.status),
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load tracking information");
      } finally {
        setLoading(false);
      }
    }

    fetchTracking();
  }, [trackingId]);

  if (
    !session ||
    session.trackingId?.toLowerCase() !== trackingId.toLowerCase()
  ) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Verification required</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please go to the tracking page and verify your Tracking ID.
        </p>
        <Link
          to="/track"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
        >
          Go to Tracking
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-6">
        Loading tracking information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Unable to show status</h1>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>

        <Link
          to="/track"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-white"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const t = test;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Status</h1>

        <div className="mt-4 grid gap-2 text-sm">
          <div>
            <span className="text-slate-500">Tracking ID:</span>{" "}
            <span className="font-semibold">{t.trackingId}</span>
          </div>
        </div>
      </div>

      <StatusTimeline test={t} />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Need help?</h2>
        <p className="mt-2 text-sm text-slate-600">
          If you have questions, please contact support at
          <br />
        </p>
        <div className="mt-4 flex  gap-4 pb-2">
          <a href="tel:+2348128681270" className="hover:underline text-sm">
            +234 812 868 1270
          </a>

          <a href="tel:+2348128681270" className="hover:underline text-sm">
            +234 912 981 3912
          </a>
        </div>

        <a
          href="mailto:care@smartdna.com.ng"
          className="hover:underline text-sm"
        >
          care@smartdna.com.ng
        </a>
      </div>
    </div>
  );
}
