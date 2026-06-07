"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { HandViewer } from "@/components/HandViewer";
import { analyzeNote, RED_FLAGS, type Analysis } from "@/lib/analyze";

export function DashboardClient() {
  const [notes, setNotes] = useState("");
  const [pain, setPain] = useState(4);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [previewOn, setPreviewOn] = useState(false);
  const [blocked, setBlocked] = useState<string[]>([]);

  const hasDescription = notes.trim().length > 0;

  const redFlags = useMemo(() => {
    const lower = notes.toLowerCase();
    return RED_FLAGS.filter((f) => lower.includes(f));
  }, [notes]);

  function handlePreview() {
    if (!hasDescription) return;
    if (redFlags.length > 0) {
      setBlocked(redFlags);
      setPreviewOn(false);
      setAnalysis(null);
      return;
    }
    setBlocked([]);
    setAnalysis(analyzeNote(notes, pain));
    setPreviewOn(true);
  }

  const caption = analysis
    ? `Active: ${cap(analysis.side)} ${cap(analysis.part)} · ${analysis.joint}`
    : "HandyAndy 3D model";

  return (
    <div className="dashboard-grid">
      <div>
        <section className="panel" aria-labelledby="clinical-notes-title">
          <h2 id="clinical-notes-title">Clinical Notes</h2>
          <label htmlFor="notes">
            Describe your symptoms or paste your clinician&rsquo;s plan, then preview your
            personalised 3D recovery model.
          </label>
          <textarea
            className="textarea"
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Right index finger PIP joint stiff after splint removal, pain 3/10, limited flexion..."
          />
          <button
            className="btn btn--green"
            type="button"
            style={{ marginTop: 14 }}
            disabled={!hasDescription}
            onClick={handlePreview}
          >
            Analyse &amp; Preview 3D Model
          </button>
          {!hasDescription && (
            <p className="hint">Add a description above to unlock your 3D preview.</p>
          )}
        </section>

        {blocked.length > 0 ? (
          <section className="safety-card" role="alert">
            <h2>
              <Icon name="warning" /> Seek clinical advice
            </h2>
            <p>
              Your note mentions: <strong>{blocked.join(", ")}</strong>. These can be signs that
              need a clinician. HandyAndy will not suggest exercises — contact your clinician or
              call 111.
            </p>
          </section>
        ) : (
          <section className="ai-card" aria-labelledby="ai-title">
            <div className="ai-card__header">
              <h2 id="ai-title">AI Mobility Analysis</h2>
              <span className="status">{analysis ? "Ready" : "Awaiting note"}</span>
            </div>
            {analysis ? (
              <>
                <p>{analysis.explanation}</p>
                <div className="metric">
                  <Icon name="analytics" />
                  <span>
                    <strong>Affected joint</strong>
                    <span>
                      {cap(analysis.side)} {cap(analysis.part)} finger — {analysis.joint}
                    </span>
                  </span>
                </div>
                <div className="metric">
                  <Icon name="velocity" />
                  <span>
                    <strong>Recommended exercise</strong>
                    <span>{analysis.exercise}</span>
                  </span>
                </div>
              </>
            ) : (
              <p>
                Our model reads your clinical note to identify the affected joint and a safe,
                clinician-approved movement to preview in 3D.
              </p>
            )}
          </section>
        )}

        <section className="pain" aria-labelledby="pain-title">
          <h2 id="pain-title">Pain Intensity Logger</h2>
          <p>Rate your average pain level over the last 24 hours (0 is no pain, 10 is worst possible).</p>
          <label htmlFor="pain" className="visually-hidden">
            Pain level from 0 to 10
          </label>
          <input
            id="pain"
            className="range"
            type="range"
            min={0}
            max={10}
            step={1}
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
          />
          <div className="range-labels" aria-hidden="true">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>
        </section>
      </div>

      <div>
        <section className="viewer" aria-labelledby="viewer-title">
          <h2 id="viewer-title">3D Recovery Viewer</h2>

          {previewOn ? (
            <HandViewer active caption={caption} />
          ) : (
            <div className="viewer__placeholder">
              <span className="viewer__placeholder-icon">🖐️</span>
              <p>
                {hasDescription
                  ? "Press “Analyse & Preview 3D Model” to load your hand model."
                  : "Add a description to generate your personalised 3D preview."}
              </p>
            </div>
          )}

          <div className="viewer__actions">
            <button
              className="btn btn--blue"
              type="button"
              disabled={!hasDescription}
              onClick={handlePreview}
            >
              {previewOn ? "Refresh 3D Preview" : "Preview 3D Model"}
            </button>
            <a className="btn btn--secondary" href="/coach/index.html" target="_blank" rel="noreferrer">
              ▶ Launch Live Exercise Coach
            </a>
          </div>
          <p className="hint">
            The Live Exercise Coach uses your phone camera and on-device hand tracking — the video
            never leaves your device.
          </p>
        </section>

        <section className="activity" aria-labelledby="activity-title">
          <h2 id="activity-title">Recent Activity</h2>
          <ul>
            <li>
              <span className="activity__icon">
                <Icon name="check" />
              </span>
              <span>
                <strong>Wrist Extension (Set A)</strong>
                <br />
                Completed 2 hours ago
              </span>
            </li>
            <li>
              <span className="activity__icon">
                <Icon name="check" />
              </span>
              <span>
                <strong>Finger Flexion</strong>
                <br />
                Completed 2 hours ago
              </span>
            </li>
          </ul>
          <a href="#history">View full activity history</a>
        </section>
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
