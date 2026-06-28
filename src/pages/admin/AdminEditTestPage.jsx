import { useEffect, useState } from "react";
import { scenarios } from "../../config/scenarios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateOrderTracking } from "../../services/testService";
import { buildStatus, API_TO_SCENARIO_MAP } from "../../config/apiScenarios";

export default function AdminEditTestPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await getOrderById(trackingId);

        if (res.status !== "success") {
          setError(res.message || "Unable to load order.");
          return;
        }

        const order = res.data;
        setExisting(order);

        setForm({
          scenario: API_TO_SCENARIO_MAP[order.client_type] || "walkin",

          currentStep: order.status
            ? Number(order.status.split("-")[0]) - 1
            : 0,

          sampleStatus: order.sample_status || "pending",
          labStatus: order.lab_status || "processing",
          resultStatus: order.result_status || "not_ready",
        });
      } catch (err) {
        console.error(err);

        if (err?.message === "Failed to fetch") {
          setError("Unable to connect to the server.");
        } else {
          setError("Failed to load tracking information.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [trackingId]);

  const scenarioKey = form?.scenario || "walkin";
  const scenario = scenarios[scenarioKey];
  const steps = scenario?.steps || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        Loading tracking information...
      </div>
    );
  }

  if (error && !existing) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Unable to load test</h1>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>

        <Link
          to="/admin/tests"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-white"
        >
          Back
        </Link>
      </div>
    );
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCopy() {
    navigator.clipboard.writeText(existing.tracking_id);
    setMsg("Tracking ID copied!");
    setTimeout(() => setMsg(""), 1200);
  }

  async function handleSave(e) {
    e.preventDefault();

    setMsg("");
    setError("");
    setSaving(true);

    try {
      const payload = {
        status: buildStatus(form.currentStep, form.scenario),
        sample_status: form.sampleStatus,
        lab_status: form.labStatus,
        result_status: form.resultStatus,
      };

      const res = await updateOrderTracking(existing.id, payload);

      if (res.status !== "success") {
        setError(res.message || "Failed to save.");
        return;
      }

      setMsg("Saved successfully!");
      setTimeout(() => navigate("/admin/tests"), 600);
    } catch (err) {
      console.error(err);

      setError("Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
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
            <span className="font-semibold">{existing.tracking_id}</span>
          </div>
          <div>
            <span className="text-slate-500">Last Updated:</span>{" "}
            <span className="font-semibold">
              {existing.updated_at
                ? new Date(existing.updated_at).toLocaleString()
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
          <div>
            <label className="text-sm font-medium">Client Type</label>

            <div className="mt-2 rounded-xl border bg-slate-50 px-4 py-3 text-slate-700">
              {scenario?.name}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Client type cannot be changed after a test has been created.
            </p>
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
            disabled={saving}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
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
