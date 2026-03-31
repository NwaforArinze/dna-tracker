import { useState } from "react";
import StatusTimeline from "../components/StatusTimeline";
import { testData } from "../data/testData";

export default function TestResult() {
  const [trackingId, setTrackingId] = useState("");
  const [test, setTest] = useState(null);

  const handleSearch = () => {
    const result = testData.find((item) => item.trackingId === trackingId);

    if (result) {
      setTest(result);
    } else {
      alert("Tracking ID not found");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Track Your DNA Test</h1>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          className="border p-3 rounded-lg flex-1"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 rounded-lg"
        >
          Track
        </button>
      </div>

      {/* Result */}
      {test && <StatusTimeline test={test} />}
    </div>
  );
}
