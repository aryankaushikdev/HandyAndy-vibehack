import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { clampExerciseId, localExtract } from "./extract";
import type { Analysis, AiSource } from "@/types";

const InputSchema = z.object({ notes: z.string().min(1).max(4000) });

export type AnalyzeResult = {
  analysis: Analysis;
  source: AiSource;
  error?: string;
};

export const analyzeNotes = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { analysis: localExtract(data.notes), source: "fallback", error: "LOVABLE_API_KEY missing" };
    }

    const systemPrompt = `You are MoveMend's clinical-input extractor. You ONLY extract structured fields from a clinician's note about a HAND/FINGER rehab session. You NEVER diagnose, NEVER invent exercises, and NEVER override the clinician's plan. If a field is ambiguous, prefer the safest, most conservative value. Output ONLY via the structured tool call.`;

    const body = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.notes },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_analysis",
            description: "Extract structured rehab analysis from the clinician note.",
            parameters: {
              type: "object",
              properties: {
                affected_side: { type: "string", enum: ["left", "right"] },
                affected_part: { type: "string", enum: ["index", "middle", "ring", "little"] },
                affected_joint: { type: "string", enum: ["MCP", "PIP", "DIP"] },
                pain_level: { type: "number" },
                movement_problem: { type: "string" },
                recommended_exercise_id: {
                  type: "string",
                  enum: [
                    "little_finger_dip_flexion_extension",
                    "little_finger_pip_flexion_extension",
                    "open_close_hand",
                    "hook_fist",
                    "full_fist",
                  ],
                },
                needs_clinician_confirmation: { type: "boolean" },
                explanation: { type: "string" },
              },
              required: [
                "affected_side",
                "affected_part",
                "affected_joint",
                "pain_level",
                "movement_problem",
                "recommended_exercise_id",
                "needs_clinician_confirmation",
                "explanation",
              ],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "extract_analysis" } },
    };

    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return {
          analysis: localExtract(data.notes),
          source: "fallback",
          error: `AI gateway ${resp.status}: ${text.slice(0, 200)}`,
        };
      }

      const json = await resp.json();
      const toolCall = json?.choices?.[0]?.message?.tool_calls?.[0];
      const argsStr = toolCall?.function?.arguments;
      if (!argsStr) {
        return { analysis: localExtract(data.notes), source: "fallback", error: "No tool call returned" };
      }
      const parsed = JSON.parse(argsStr);
      const analysis: Analysis = {
        affected_side: parsed.affected_side === "left" ? "left" : "right",
        affected_part: ["index", "middle", "ring", "little"].includes(parsed.affected_part)
          ? parsed.affected_part
          : "index",
        affected_joint: ["MCP", "PIP", "DIP"].includes(parsed.affected_joint) ? parsed.affected_joint : "PIP",
        pain_level: Math.max(0, Math.min(10, Number(parsed.pain_level) || 0)),
        movement_problem: String(parsed.movement_problem ?? ""),
        recommended_exercise_id: clampExerciseId(parsed.recommended_exercise_id),
        needs_clinician_confirmation: Boolean(parsed.needs_clinician_confirmation ?? true),
        explanation: String(parsed.explanation ?? ""),
      };
      return { analysis, source: "ai" };
    } catch (err) {
      return {
        analysis: localExtract(data.notes),
        source: "fallback",
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  });
