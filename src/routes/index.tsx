import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Sidebar, type SidebarKey } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { ClinicalInput } from "@/components/ClinicalInput";
import { AnalysisCard } from "@/components/AnalysisCard";
import { SafetyAlert } from "@/components/SafetyAlert";
import { HandViewer } from "@/components/HandViewer";
import { PainLogger } from "@/components/PainLogger";
import { ProgressSummary } from "@/components/ProgressSummary";
import { Toaster } from "@/components/ui/sonner";
import { ChevronLeft } from "lucide-react";

import { safetyScan } from "@/lib/safety";
import { analyzeNotes } from "@/lib/analyze.functions";
import type { AiSource, Analysis, PainEntry } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoveMend — Move better. Mend faster." },
      {
        name: "description",
        content:
          "MoveMend turns a clinician's treatment plan into a personalised 3D hand recovery guide with safety-first analysis.",
      },
      { property: "og:title", content: "MoveMend — Move better. Mend faster." },
      {
        property: "og:description",
        content:
          "Safety-first 3D rehab companion for hand and finger recovery. Indicative analysis only — never a replacement for clinical advice.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<SidebarKey>("recovery");
  const [notes, setNotes] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [source, setSource] = useState<AiSource | null>(null);
  const [safety, setSafety] = useState<{ blocked: boolean; terms: string[] }>({
    blocked: false,
    terms: [],
  });
  const [painLog, setPainLog] = useState<PainEntry[]>([]);

  const analyzeFn = useServerFn(analyzeNotes);
  const mutation = useMutation({
    mutationFn: (n: string) => analyzeFn({ data: { notes: n } }),
    onSuccess: (res) => {
      setAnalysis(res.analysis);
      setSource(res.source);
      if (res.source === "fallback") {
        toast.warning("Using local fallback", {
          description: res.error?.includes("429")
            ? "AI rate limit reached — switched to offline extraction."
            : res.error?.includes("402")
              ? "AI credits exhausted — switched to offline extraction."
              : "Live AI unavailable — used the deterministic extractor.",
        });
      }
    },
    onError: (err) => {
      toast.error("Analysis failed", { description: String(err) });
    },
  });

  function handleAnalyze(n: string) {
    setNotes(n);
    const scan = safetyScan(n);
    setSafety(scan);
    if (scan.blocked) {
      setAnalysis(null);
      setSource(null);
      return;
    }
    mutation.mutate(n);
  }

  const jointKey = useMemo(
    () => (analysis ? `${analysis.affected_part}_${analysis.affected_joint.toLowerCase()}` : null),
    [analysis],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopHeader active={tab} onSelect={setTab} />
      <DisclaimerBar />

      <div className="flex-1 flex min-h-0">
        <div className="max-w-6xl mx-auto w-full flex gap-6 px-6 py-8">
          <Sidebar active={tab} onSelect={setTab} />

          <main className="flex-1 min-w-0">
            {tab === "analysis" ? (
              <ExerciseGame />
            ) : (
            <>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-[15px] text-nhs-blue underline underline-offset-2 hover:no-underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to dashboard
            </a>

            <header className="mt-3 mb-6 flex items-start justify-between gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Recovery Progress Overview
              </h1>
              <span className="shrink-0 inline-flex items-center gap-1.5 bg-success/10 text-success border border-success/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                On Track
              </span>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClinicalInput
                busy={mutation.isPending}
                initialNotes={notes}
                onAnalyze={handleAnalyze}
              />

              {safety.blocked ? (
                <SafetyAlert terms={safety.terms} />
              ) : analysis ? (
                <AnalysisCard analysis={analysis} source={source ?? "fallback"} />
              ) : (
                <EmptyAnalysis />
              )}
            </div>

            {!safety.blocked && (
              <div className="mt-6">
                <HandViewer
                  jointKey={jointKey}
                  exerciseId={analysis?.recommended_exercise_id ?? null}
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PainLogger
                entries={painLog}
                onLog={(before) =>
                  setPainLog((prev) => [
                    ...prev,
                    {
                      sessionId: prev.length + 1,
                      before,
                      after: null,
                      at: Date.now(),
                    },
                  ])
                }
                onCompleteSession={(after) =>
                  setPainLog((prev) =>
                    prev.map((e, i) =>
                      i === prev.length - 1 && e.after === null ? { ...e, after } : e,
                    ),
                  )
                }
              />
              <ProgressSummary entries={painLog} />
            </div>

            <footer className="mt-10 mb-6 text-xs text-muted-foreground">
              MoveMend · Indicative analysis only · Not a substitute for professional medical advice.
            </footer>
            </>
            )}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

function ExerciseGame() {
  return (
    <div>
      <header className="mt-3 mb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Guided exercises</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Camera-based thumb rehab with live, gamified form coaching. Allow camera access when prompted.
        </p>
      </header>
      <div
        className="rounded-2xl overflow-hidden border border-border bg-card"
        style={{ height: "78vh" }}
      >
        <iframe
          src="/game/index.html"
          title="Thumb Coach exercises"
          allow="camera; fullscreen"
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
      <p className="mt-3 text-sm">
        <a
          href="/game/index.html"
          target="_blank"
          rel="noreferrer"
          className="text-nhs-blue underline underline-offset-2"
        >
          Open full screen ↗
        </a>
      </p>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card/50 p-6 flex items-center justify-center text-center">
      <div className="max-w-sm">
        <p className="font-display text-lg font-semibold">Awaiting analysis</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter session notes on the left and tap <strong>Analyze Notes</strong> to highlight the
          affected joint and load the approved movement plan.
        </p>
      </div>
    </section>
  );
}
