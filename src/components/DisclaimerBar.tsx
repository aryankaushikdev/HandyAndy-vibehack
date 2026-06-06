export function DisclaimerBar() {
  return (
    <div className="border-b border-border bg-surface px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-3 text-sm text-foreground">
        <span className="inline-flex items-center bg-nhs-blue text-white text-[11px] font-bold tracking-wide uppercase px-2 py-0.5">
          Beta
        </span>
        <span>
          This is a new service – your{" "}
          <a href="#" className="text-nhs-blue underline underline-offset-2 hover:no-underline">
            feedback
          </a>{" "}
          will help us to improve it.
        </span>
      </div>
    </div>
  );
}
