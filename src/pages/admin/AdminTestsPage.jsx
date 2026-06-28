import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createOrderTracking,
  getAllOrderTrackings,
} from "../../services/testService";
// import { scenarios } from "../../config/scenarios";

const CLIENT_TYPE_LABELS = {
  walk_in_client: "Walk-In Client",
  walk_in_client_kit_pickup: "Walk-In Client – Kit Pickup",
  home_service_client: "Home Service Client",
  kit_delivery_client: "Kit Delivery Client",
  sample_collection_center: "Sample Collection Center",
};

function formatStatus(status) {
  if (!status) return "No Status";

  const [, name] = status.split("-");

  return name
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getResultBadge(status) {
  switch (status) {
    case "released":
      return "bg-blue-100 text-blue-700";

    case "ready":
      return "bg-green-100 text-green-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function AdminTestsPage() {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  // Create form
  const [contact, setContact] = useState("");
  const [scenario, setScenario] = useState("walkin");

  // Create success state
  const [created, setCreated] = useState(null); // { id, trackingId }

  const [refreshKey, setRefreshKey] = useState(0);

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadTests = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await getAllOrderTrackings();

      if (res.status !== "success") {
        setLoadError(res.message || "Failed to load tests.");
        return;
      }

      const sorted = [...(res.data || [])].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );

      setTests(sorted);
    } catch (err) {
      console.error(err);
      setLoadError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, [refreshKey]);

  const filteredTests = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return tests;

    return tests.filter(
      (t) =>
        t.tracking_id?.toLowerCase().includes(term) ||
        (t.client_contact || "").toLowerCase().includes(term) ||
        CLIENT_TYPE_LABELS[t.client_type]?.toLowerCase().includes(term),
    );
  }, [tests, search]);

  const stats = useMemo(() => {
    return {
      total: tests.length,

      processing: tests.filter((t) => t.lab_status === "processing").length,

      completed: tests.filter((t) => t.lab_status === "completed").length,

      ready: tests.filter((t) => t.result_status === "ready").length,

      released: tests.filter((t) => t.result_status === "released").length,
    };
  }, [tests]);

  function openNew() {
    setShowNew(true);
    setCreated(null);
  }

  function closeNew() {
    setShowNew(false);
    setCreated(null);
    setCreateError("");
    setContact("");
    setScenario("walkin");
  }

  async function handleCreate(e) {
    setCreateError("");
    e.preventDefault();

    if (!contact.trim()) {
      setCreateError("Phone number or email is required.");
      return;
    }

    setCreating(true);

    try {
      const res = await createOrderTracking({
        contact,
        scenario,
      });

      if (res.status !== "success") {
        setCreateError(res.message || "Unable to create tracking.");
        return;
      }

      setCreated({
        id: res.data.id,
        trackingId: res.data.tracking_id,
      });

      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadTests();
    setRefreshing(false);
  }

  async function copy(text) {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>

          <p className="mt-4 text-slate-500">Loading tests...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Header */}
      {loadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tests</h1>
            <p className="mt-1 text-sm text-slate-600">
              Create and manage tracking records.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {refreshing ? "⟳ Refreshing..." : "↻ Refresh"}
            </button>

            <button
              onClick={openNew}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              type="button"
            >
              + New Test
            </button>
          </div>
        </div>

        <div className="mt-4">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Tracking ID, contact or client type..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tests</p>
          <h2 className="mt-2 text-3xl font-bold">{stats.total}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Lab Processing</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-600">
            {stats.processing}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Lab Completed</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {stats.completed}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Results Ready</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {stats.ready}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Results Released</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {stats.released}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="overflow-auto">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {filteredTests.length} of {tests.length} tests
            </p>
          </div>
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b">
                <th className="py-3 pr-3">Tracking ID</th>
                <th className="py-3 pr-3">Client Type</th>
                <th className="py-3 pr-3">Step</th>
                <th className="py-3 pr-3">Last Updated</th>
                <th className="py-3 pr-3">Result</th>

                <th className="py-3 pr-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTests.map((t) => {
                const currentStep = t.status
                  ? parseInt(t.status.split("-")[0], 10)
                  : "-";
                return (
                  <tr key={t.id} className="border-t">
                    <td className="py-3 font-medium">{t.tracking_id}</td>

                    <td>
                      {CLIENT_TYPE_LABELS[t.client_type] || t.client_type}
                    </td>

                    <td>
                      Step {currentStep}
                      <div className="text-xs text-slate-500">
                        {formatStatus(t.status)}
                      </div>
                    </td>

                    <td className="py-3 pr-3">{formatDate(t.updated_at)}</td>

                    <td>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getResultBadge(
                          t.result_status,
                        )}`}
                      >
                        {(t.result_status || "not_ready").replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/admin/tests/${t.id}`}
                        className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loadError && filteredTests.length === 0 && (
            <div className="py-10 text-center">
              <h3 className="font-semibold">No matching tests</h3>

              <p className="mt-1 text-sm text-slate-500">
                Try another tracking ID, client type or contact.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Test Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {created ? "Test Created" : "Create New Test"}
              </h2>

              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {createError}
                </div>
              )}

              <button
                onClick={closeNew}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
                type="button"
              >
                Close
              </button>
            </div>

            {/* SUCCESS VIEW */}
            {created ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Tracking ID</p>
                  <p className="mt-1 text-2xl font-black">
                    {created.trackingId}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => copy(created.trackingId)}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                      type="button"
                    >
                      {copied ? "Copied!" : "Copy ID"}
                    </button>

                    <Link
                      to={`/admin/tests/${created.id}`}
                      className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                      onClick={closeNew}
                    >
                      Edit Test
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCreated(null);
                    setCreateError("");
                    setContact("");
                    setScenario("walkin");
                  }}
                  className="w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
                  type="button"
                >
                  Create another test
                </button>

                <p className="text-xs text-slate-500">
                  Send this Tracking ID to the client. They will use it + their
                  phone/email to check status.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Client Phone or Email
                  </label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3"
                    placeholder="e.g. 0803... or name@email.com"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Client must enter this exact value when tracking.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Scenario</label>

                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
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

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={closeNew}
                    disabled={creating}
                    className="flex-1 rounded-xl border px-4 py-3 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Tracking ID will be generated automatically.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
