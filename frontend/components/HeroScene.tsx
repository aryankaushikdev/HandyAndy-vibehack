"use client";

import { HeroSteps } from "@/components/HeroSteps";

/**
 * Landing hero illustration: a patient whose hand is in a cast using HandyAndy
 * on their phone — and the phone runs the *real* app with the live 3D hand model
 * inside it.
 */
export function HeroScene() {
  return (
    <div className="hero-scene" role="img" aria-label="A patient with a hand in a cast using the HandyAndy rehab app on their phone">
      {/* Flat-illustrated patient with a bandaged/cast hand */}
      <svg className="hero-scene__person" viewBox="0 0 220 300" aria-hidden="true">
        {/* chair / seat hint */}
        <ellipse cx="110" cy="288" rx="92" ry="12" fill="rgba(0,0,0,0.25)" />
        {/* torso / jumper */}
        <path
          d="M40 300 C40 215 70 188 110 188 C150 188 180 215 180 300 Z"
          fill="#005eb8"
        />
        {/* neck */}
        <rect x="98" y="150" width="24" height="40" rx="12" fill="#e8b48f" />
        {/* head */}
        <circle cx="110" cy="120" r="40" fill="#f0c39c" />
        {/* hair */}
        <path d="M70 116 C70 80 150 80 150 116 C150 96 132 84 110 84 C88 84 70 96 70 116 Z" fill="#3a2a20" />
        {/* face */}
        <circle cx="96" cy="120" r="4.5" fill="#2b2b2b" />
        <circle cx="124" cy="120" r="4.5" fill="#2b2b2b" />
        <path d="M98 136 C104 144 116 144 122 136" stroke="#9c5a3c" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* LEFT (good) arm, raised, holding the phone */}
        <path
          d="M150 210 C188 200 206 168 196 150"
          stroke="#005eb8"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="196" cy="150" r="15" fill="#f0c39c" />

        {/* RIGHT arm in a CAST + bandaged hand, resting across the lap */}
        <path
          d="M70 214 C50 236 56 262 92 270"
          stroke="#005eb8"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
        />
        {/* cast forearm */}
        <path
          d="M58 232 C44 252 56 276 96 276 C120 276 126 262 120 250 C112 234 80 222 58 232 Z"
          fill="#f5f6f7"
          stroke="#c7ccd1"
          strokeWidth="3"
        />
        {/* bandage wraps */}
        <path d="M70 238 L62 252" stroke="#c7ccd1" strokeWidth="3" strokeLinecap="round" />
        <path d="M86 238 L76 258" stroke="#c7ccd1" strokeWidth="3" strokeLinecap="round" />
        <path d="M102 244 L94 262" stroke="#c7ccd1" strokeWidth="3" strokeLinecap="round" />
        {/* sling strap */}
        <path d="M150 196 L92 270" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.85" strokeLinecap="round" />
      </svg>

      {/* Real phone running HandyAndy, held up by the patient's good hand */}
      <div className="hero-phone">
        <div className="hero-phone__notch" />
        <HeroSteps />
      </div>
    </div>
  );
}
