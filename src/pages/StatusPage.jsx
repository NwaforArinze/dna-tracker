import { useParams, Link } from "react-router-dom";
import { scenarios } from "../config/scenarios";
import { trackLookup } from "../services/testService";
import StatusTimeline from "../components/StatusTimeline";

export default function StatusPage() {
  const { trackingId } = useParams();

  const session = JSON.parse(
    sessionStorage.getItem("dna_last_verified") || "null",
  );
  const serialNumber = session?.serialNumber || "";

  if (
    !session ||
    session.trackingId?.toLowerCase() !== trackingId.toLowerCase()
  ) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Verification required</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please go to the tracking page and verify your Tracking ID and Serial
          Number details.
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

  const res = trackLookup(trackingId, serialNumber);

  if (!res.ok) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Unable to show status</h1>
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {res.error}
        </div>
        <Link
          to="/track"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
        >
          Try again
        </Link>
      </div>
    );
  }

  const t = res.test;

  const scenarioKey = t.scenario || t.clientType || "walkin";
  const scenario = scenarios[scenarioKey];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Status</h1>

        <div className="mt-4 grid gap-2 text-sm">
          <div>
            <span className="text-slate-500">Tracking ID:</span>{" "}
            <span className="font-semibold">{t.trackingId}</span>
          </div>
          <div>
            <span className="text-slate-500">Client Type:</span>{" "}
            <span className="font-semibold">{scenario.name}</span>
          </div>
          {/* <div>
            <span className="text-slate-500">Delivery Method:</span>{" "}
            <span className="font-semibold">{t.deliveryMethod}</span>
          </div> */}
        </div>
      </div>

      <StatusTimeline test={t} />

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Need help?</h2>
        <p className="mt-2 text-sm text-slate-600">
          If you have questions, please contact support.
        </p>
      </div>
    </div>
  );
}
