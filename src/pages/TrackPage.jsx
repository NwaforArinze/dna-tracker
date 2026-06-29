import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderByTrackingId } from "../services/testService";

export default function TrackPage() {
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const id = trackingId.trim();

    if (!id) {
      setError("Please enter your Tracking ID.");
      return;
    }

    if (!id.toUpperCase().startsWith("DNA")) {
      setError("Tracking ID should start with DNA.");
      return;
    }

    try {
      const res = await getOrderByTrackingId(id);

      if (res.status !== "success") {
        setError("Tracking ID not found");
        return;
      }

      sessionStorage.setItem(
        "dna_last_verified",
        JSON.stringify({
          trackingId: id,
        }),
      );

      navigate(`/status/${encodeURIComponent(id)}`);
    } catch (err) {
      console.error(err);

      setError("Unable to fetch tracking information");
    }
  }

  return (
    <div className="mx-auto max-w-xl min-h-[70vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm w-full max-w-xl">
        <h1 className="text-2xl font-bold">Track Your Test</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the <span className="font-medium">Tracking ID</span> sent to
          you.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Tracking ID</label>
            <input
              value={trackingId}
              onChange={(e) => {
                setTrackingId(e.target.value);
                setError("");
              }}
              placeholder="Enter Tracking ID"
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
          >
            Check Status
          </button>

          <p className="text-xs text-slate-500">
            Note: This portal shows progress updates only. No sensitive result
            details are displayed here.
          </p>
        </form>
      </div>
    </div>
  );
}
