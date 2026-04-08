import { scenarios } from "../config/scenarios";

function Badge({ kind, children }) {
  const styles =
    kind === "done"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : kind === "current"
        ? "bg-blue-50 text-blue-700 ring-blue-200"
        : "bg-slate-50 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles}`}
    >
      {children}
    </span>
  );
}

function IconCircle({ state, index }) {
  // state: "done" | "current" | "todo"
  const base = "flex h-9 w-9 items-center justify-center rounded-full ring-1";

  if (state === "done") {
    return (
      <div className={`${base} bg-emerald-600 text-white ring-emerald-200`}>
        ✓
      </div>
    );
  }

  if (state === "current") {
    return (
      <div className={`${base} bg-blue-600 text-white ring-blue-200`}>
        {index}
      </div>
    );
  }

  return (
    <div className={`${base} bg-white text-slate-500 ring-slate-200`}>
      {index}
    </div>
  );
}

function StepItem({ title, description, state, index, isLast }) {
  return (
    <div className="relative flex gap-4">
      {/* Left: icon + connector line */}
      <div className="relative flex flex-col items-center">
        <IconCircle state={state} index={index} />

        {!isLast && (
          <div
            className={`mt-2 w-px flex-1 ${
              state === "done" ? "bg-emerald-200" : "bg-slate-200"
            }`}
            style={{ minHeight: 28 }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="w-full pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

          {state === "done" && <Badge kind="done">Completed</Badge>}
          {state === "current" && <Badge kind="current">In progress</Badge>}
          {state === "todo" && <Badge kind="todo">Pending</Badge>}
        </div>

        <p className="mt-1 text-sm text-slate-600">{description}</p>

        {state === "current" && (
          <div className="mt-3 rounded-xl bg-blue-50 p-3 text-xs text-blue-700 ring-1 ring-blue-200">
            We’ll update this step once there’s progress.
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatusTimeline({ test }) {
  const scenarioKey = test.scenario || test.clientType || "walkin";
  const scenario = scenarios[scenarioKey];
  if (!scenario) {
    return (
      <div className="p-6 bg-red-100 rounded-lg">Unknown tracking scenario</div>
    );
  }

  const steps = scenario.steps;

  const currentStep = Number(test.currentStep ?? 0);

  const timestamps = [...(test.stepTimestamps || [])];

  // Auto-fill missing timestamps for completed steps
  for (let i = 0; i < currentStep; i++) {
    if (!timestamps[i]) {
      timestamps[i] = (test.createdAt || Date.now()) + i * 1000 * 60 * 60; // +1hr per step
    }
  }

  const progress = Math.min(
    100,
    Math.round((currentStep / (steps.length - 1)) * 100),
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      {currentStep === steps.length - 1 && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-green-700 ring-1 ring-green-200">
          Test process completed
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {steps.map((step, index) => {
          let state = "pending";

          const isFinalStep = currentStep >= steps.length - 1;

          if (isFinalStep) {
            // Everything is completed when last step reached
            state = "completed";
          } else {
            if (index < currentStep) {
              state = "completed";
            } else if (index === currentStep) {
              state = "current";
            }
          }

          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex gap-4 relative pb-8">
              {/* LEFT SIDE (ICON + CONNECTOR) */}
              <div className="flex flex-col items-center">
                {/* ICON */}
                <div
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-bold
            ${state === "completed" ? "bg-green-600 text-white" : ""}
            ${state === "current" ? "bg-blue-600 text-white animate-pulse" : ""}
            ${state === "pending" ? "bg-gray-200 text-gray-600" : ""}
            `}
                >
                  {state === "completed" ? "✓" : index + 1}
                </div>

                {/* CONNECTOR LINE */}
                {!isLast && (
                  <div
                    className={`w-px flex-1 mt-2 ${
                      state === "completed" ? "bg-green-300" : "bg-gray-200"
                    }`}
                    style={{ minHeight: 30 }}
                  />
                )}
              </div>

              {/* RIGHT SIDE CONTENT */}
              <div className="flex-1">
                <p className="font-medium">{step}</p>

                {timestamps[index] && (
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(timestamps[index]).toLocaleString()}
                  </p>
                )}

                {state === "completed" && (
                  <p className="text-sm text-green-600">Completed</p>
                )}

                {state === "current" && (
                  <p className="text-sm text-blue-600">In progress</p>
                )}

                {state === "pending" && (
                  <p className="text-sm text-gray-400">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
        This portal shows status only. For privacy, it does not display the
        actual DNA result.
      </div>
    </div>
  );
}
