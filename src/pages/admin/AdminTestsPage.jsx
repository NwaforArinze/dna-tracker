import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createTest, listTests, resetTests } from "../../services/testService";

export default function AdminTestsPage() {
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);

  // Create form
  const [contact, setContact] = useState("");
  const [clientType, setClientType] = useState("walkin");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");

  // Create success state
  const [created, setCreated] = useState(null); // { trackingId }

  const [refreshKey, setRefreshKey] = useState(0);

  const tests = useMemo(() => {
    void refreshKey;
    return listTests();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tests;
    return tests.filter((t) => t.trackingId.toLowerCase().includes(s));
  }, [q, tests]);

  function handleReset() {
    resetTests();
    setRefreshKey((k) => k + 1);
  }

  function openNew() {
    setShowNew(true);
    setCreated(null);
  }

  function closeNew() {
    setShowNew(false);
    setCreated(null);
    setContact("");
    setClientType("walkin");
    setDeliveryMethod("pickup");
  }

  function handleCreate(e) {
    e.preventDefault();

    if (!contact.trim()) return;

    const res = createTest({ contact, clientType, deliveryMethod });

    if (res.ok) {
      setCreated({ trackingId: res.test.trackingId });
      setRefreshKey((k) => k + 1);
    }
  }

  async function copy(text) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
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
              onClick={openNew}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              type="button"
            >
              + New Test
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
              type="button"
              title="Reset demo data"
            >
              Reset demo
            </button>
          </div>
        </div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by Tracking ID..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b">
                <th className="py-3 pr-3">Tracking ID</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Sample</th>
                <th className="py-3 pr-3">Lab</th>
                <th className="py-3 pr-3">Result</th>
                <th className="py-3 pr-3">Delivery</th>
                <th className="py-3 pr-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.trackingId} className="border-b last:border-b-0">
                  <td className="py-3 pr-3 font-semibold">{t.trackingId}</td>
                  <td className="py-3 pr-3">{t.clientType}</td>
                  <td className="py-3 pr-3">{t.sampleStatus}</td>
                  <td className="py-3 pr-3">{t.labStatus}</td>
                  <td className="py-3 pr-3">{t.resultStatus}</td>
                  <td className="py-3 pr-3">{t.deliveryMethod}</td>
                  <td className="py-3 pr-3">
                    <Link
                      to={`/admin/tests/${encodeURIComponent(t.trackingId)}`}
                      className="rounded-lg border px-3 py-1.5 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={7}>
                    No tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                      Copy ID
                    </button>

                    <Link
                      to={`/admin/tests/${encodeURIComponent(created.trackingId)}`}
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
                    setContact("");
                    setClientType("walkin");
                    setDeliveryMethod("pickup");
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
              /* CREATE FORM VIEW */
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Client Type</label>
                    <select
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3"
                    >
                      <option value="walkin">walkin</option>
                      <option value="kit">kit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Delivery Method
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3"
                    >
                      <option value="pickup">pickup</option>
                      <option value="shipped">shipped</option>
                      <option value="email">email</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={closeNew}
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
