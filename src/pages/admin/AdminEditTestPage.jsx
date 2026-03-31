import { useMemo, useState } from "react";
import { scenarios } from "../../config/scenarios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findTestByTrackingId, updateTest } from "../../services/testService";

export default function AdminEditTestPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  // Load the test from localStorage “DB”
  const existing = useMemo(
    () => findTestByTrackingId(trackingId),
    [trackingId],
  );

  const [form, setForm] = useState(() => {
    if (!existing) return null;

    return {
      serialNumber: existing.serialNumber || "",

      // NEW SYSTEM
      scenario: existing.scenario || existing.clientType || "walkin",
      currentStep: existing.currentStep ?? 0,

      // OLD SYSTEM (kept temporarily so nothing breaks)
      clientType: existing.clientType || "walkin",
      sampleStatus: existing.sampleStatus || "pending",
      labStatus: existing.labStatus || "processing",
      resultStatus: existing.resultStatus || "not_ready",
      deliveryMethod: existing.deliveryMethod || "pickup",
    };
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const scenarioKey = form?.scenario || "walkin";
  const scenario = scenarios[scenarioKey];
  const steps = scenario?.steps || [];

  if (!existing || !form) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Test not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This Tracking ID does not exist in the system.
        </p>
        <Link
          to="/admin/tests"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
        >
          Back to Tests
        </Link>
      </div>
    );
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCopy() {
    navigator.clipboard.writeText(existing.trackingId);
    setMsg("Tracking ID copied!");
    setTimeout(() => setMsg(""), 1200);
  }

  function handleSave(e) {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!form.serialNumber?.trim()) {
      setError("Serial Number is required.");
      return;
    }

    if (!form.serialNumber.startsWith("SMA")) {
      setError("Serial number must start with SMA");
      return;
    }

    const res = updateTest(existing.trackingId, {
      serialNumber: form.serialNumber,

      // NEW SYSTEM
      scenario: form.scenario,
      currentStep: form.currentStep,

      // OLD SYSTEM (temporary compatibility)
      clientType: form.clientType,
      sampleStatus: form.sampleStatus,
      labStatus: form.labStatus,
      resultStatus: form.resultStatus,
      deliveryMethod: form.deliveryMethod,
    });

    if (!res.ok) {
      setError(res.error || "Failed to save.");
      return;
    }

    setMsg("Saved successfully!");
    setTimeout(() => navigate("/admin/tests"), 600);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header / summary */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Test</h1>
            <p className="mt-1 text-sm text-slate-600">
              Update statuses and save changes.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Copy Tracking ID
            </button>

            <Link
              to="/admin/tests"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div>
            <span className="text-slate-500">Tracking ID:</span>{" "}
            <span className="font-semibold">{existing.trackingId}</span>
          </div>
          <div>
            <span className="text-slate-500">Last Updated:</span>{" "}
            <span className="font-semibold">
              {existing.updatedAt
                ? new Date(existing.updatedAt).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>

        {msg && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {msg}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold">Test Details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Serial Number</label>
            <input
              value={form.serialNumber}
              onChange={(e) => setField("serialNumber", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
              placeholder="SMAXXXX"
            />
            <p className="mt-1 text-xs text-slate-500 ">
              Client must enter this exact value when tracking.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Scenario</label>

            <select
              value={form.scenario}
              onChange={(e) =>
                setForm({
                  ...form,
                  scenario: e.target.value,
                  currentStep: 0,
                })
              }
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="walkin">Walk-In Client</option>
              <option value="walkin_kit_pickup">
                Walk-In Client – Kit Pickup
              </option>
              <option value="home_service">Home Service Client</option>
              <option value="kit_delivery">Kit Delivery Client</option>
              <option value="partner_collection">
                Sample Collection Center
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Current Status</label>

            <select
              value={form.currentStep}
              onChange={(e) =>
                setForm({ ...form, currentStep: Number(e.target.value) })
              }
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              {steps.map((step, index) => (
                <option key={index} value={index}>
                  {index + 1} — {step}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Client Type</label>
            <select
              value={form.clientType}
              onChange={(e) => setField("clientType", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="walkin">walkin</option>
              <option value="kit">kit</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Delivery Method</label>
            <select
              value={form.deliveryMethod}
              onChange={(e) => setField("deliveryMethod", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="pickup">pickup</option>
              <option value="shipped">shipped</option>
              <option value="email">email</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Sample Status</label>
            <select
              value={form.sampleStatus}
              onChange={(e) => setField("sampleStatus", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="pending">pending</option>
              <option value="collected">collected</option>
              <option value="received">received</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Lab Status</label>
            <select
              value={form.labStatus}
              onChange={(e) => setField("labStatus", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="processing">processing</option>
              <option value="completed">completed</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Result Status</label>
            <select
              value={form.resultStatus}
              onChange={(e) => setField("resultStatus", e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="not_ready">not_ready</option>
              <option value="ready">ready</option>
              <option value="released">released</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              “Ready” means result is available. “Released” means the result has
              been delivered/picked up.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
          >
            Save Changes
          </button>

          <Link
            to="/admin/tests"
            className="flex-1 rounded-xl border px-4 py-3 text-center font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
