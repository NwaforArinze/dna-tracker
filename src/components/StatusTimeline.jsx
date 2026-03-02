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
  const isWalkin = test.clientType === "walkin";

  // same progress rules as before
  const registeredDone = true;
  const sampleDone =
    test.sampleStatus === "collected" || test.sampleStatus === "received";
  const processingDone =
    test.labStatus === "processing" || test.labStatus === "completed";
  const completedDone = test.labStatus === "completed";
  const resultReadyDone =
    test.resultStatus === "ready" || test.resultStatus === "released";

  // Determine current step:
  // - first step that is NOT done becomes "current"
  const doneFlags = [
    registeredDone,
    sampleDone,
    processingDone,
    completedDone,
    resultReadyDone,
  ];
  const currentIndex = Math.max(
    0,
    doneFlags.findIndex((x) => x === false),
  ); // -1 means all done

  const steps = [
    {
      title: "Registered",
      description: "Your test has been created in our system.",
      done: registeredDone,
    },
    {
      title: isWalkin ? "Sample Collected" : "Sample Received",
      description: isWalkin
        ? "Your sample has been collected at the center."
        : "We have received your sample at the center.",
      done: sampleDone,
    },
    {
      title: "Processing",
      description: "Your sample is currently being processed in the lab.",
      done: processingDone,
    },
    {
      title: "Processing Completed",
      description: "Lab processing is completed.",
      done: completedDone,
    },
    {
      title: "Result Ready",
      description: resultReadyDone
        ? `Your result is ready. Delivery method: ${test.deliveryMethod}.`
        : "Not ready yet.",
      done: resultReadyDone,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Progress</h2>
          <p className="text-sm text-slate-600">
            Track the current stage of your test.
          </p>
        </div>

        {/* Overall badge */}
        <div>
          {resultReadyDone ? (
            <Badge kind="done">Result Ready</Badge>
          ) : processingDone ? (
            <Badge kind="current">Processing</Badge>
          ) : (
            <Badge kind="todo">In review</Badge>
          )}
        </div>
      </div>

      <div className="mt-6">
        {steps.map((s, i) => {
          let state = "todo";
          if (s.done) state = "done";
          else if (currentIndex === -1 ? false : i === currentIndex)
            state = "current";

          // if all done, none should be "current"
          if (currentIndex === -1) state = s.done ? "done" : "todo";

          return (
            <StepItem
              key={s.title}
              title={s.title}
              description={s.description}
              state={state}
              index={i + 1}
              isLast={i === steps.length - 1}
            />
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
