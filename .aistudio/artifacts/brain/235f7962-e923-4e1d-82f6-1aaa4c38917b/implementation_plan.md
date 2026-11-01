# Unified ChemPYQ & Nemo Chemistry Studio - Implementation Plan

Fully integrate and harmonize **Nemo Chemistry Tutor** into **ChemPYQ Studio**, eradicating the standalone iframe architecture. The application becomes a singular, synchronized chemistry intelligence environment with native React panels for conversational AI chat, reaction sketching canvas, and study analytics. Furthermore, this plan ports Nemo's signature sensory feedback system (device haptic vibrations, CSS shake on incorrect choices, neon-green ripple on correct choices) and introduces an interactive floating Nemo mascot that dynamically reacts to user actions.

---

## User Review Required

> [!IMPORTANT]
> The standalone iframe under "Nemo Classic" will be completely removed. In its place, Nemo's core modules (Conversational Tutor with Gemini, Reaction Canvas with drawing tools, and Study Analytics with progress mastery) will become native, first-class React components in the unified studio.

- **Mascot Position & Behavior**: A floating interactive Nemo mascot will dock in the bottom-right viewport with minimize/expand controls and speech bubble reaction cues when answering questions.
- **Sensory Feedback**: On mobile/supported desktop browsers, `navigator.vibrate` will trigger physical haptics alongside high-performance CSS transforms (`@keyframes shake` and `@keyframes correct`).

---

## Proposed Changes

### 1. Sensory Feedback & CSS Animation System
#### `lib/haptics.ts` (New)
- Create a lightweight, fail-safe utility for device vibrations and sensory effects:
  - `triggerWrongFeedback(el?: HTMLElement)`: invokes `navigator.vibrate([40, 50, 40])`, adds `.nemo-shake` animation class.
  - `triggerCorrectFeedback(el?: HTMLElement)`: invokes `navigator.vibrate(50)`, adds `.nemo-correct` neon-green pulse class.
  - Dispatches custom events (`nemo:answer-correct`, `nemo:answer-wrong`) to synchronize the mascot's emotional expressions.

#### `app/globals.css`
- Port Nemo's exact CSS design tokens and hardware-accelerated keyframe animations:
  - `--cyan: #54e7ff`, `--blue: #367cff`, `--purple: #a66bff`, `--green: #4df0b0`, `--red: #ff6b86`, `--amber: #ffc65c`.
  - `@keyframes shake`: horizontal cubic-bezier oscillation on incorrect answers.
  - `@keyframes correct`: expanding radial glow box-shadow and scale pulse on correct answers.
  - `@keyframes float`: smooth vertical bobbing for floating elements and mascot face.
  - Mascot CSS styles: orbital electron rings, blinking eyes, glowing neon cheeks.

---

### 2. Interactive Floating Nemo Companion
#### `components/FloatingNemoCompanion.tsx` (New)
- Build a persistent, floating interactive mascot docked at the bottom-right viewport:
  - Features Nemo's SVG/CSS mascot face: dual orbiting rings, glowing cyan eyes, warm smile, and floating formula tags (`CH₃`, `H₂O`, `⌬`).
  - **Emotional States**:
    - `idle`: gentle floating and occasional blinking.
    - `happy`: bounces and radiates green particles when user gets a question right.
    - `thinking`: tilts and shows encouraging message when user gets an answer wrong or explores an exception.
    - `talking`: displays contextual speech bubbles with JEE tips or links to formulas.
  - Floating controls: minimize to a compact floating orb, toggle sound/speech, quick button to open AI Tutor.

---

### 3. Native React Ports of Nemo's Standalone Panels
#### `components/NemoChatPanel.tsx` (New)
- Replaces the iframe chat with a full-featured, native React chat interface:
  - Real-time conversation with server-side Gemini via `/api/chat`.
  - Level Selector (`Auto`, `CBSE 11/12`, `JEE Main`, `JEE Advanced`).
  - Voice input using `webkitSpeechRecognition` / `SpeechRecognition`.
  - Text-to-speech audio using `window.speechSynthesis`.
  - Quick topic prompt pills ("Mechanism of Aldol Condensation", "Why is N > O ionisation energy?", "Lassaigne's test equations").

#### `components/ReactionCanvasPanel.tsx` (New)
- Native HTML5 Canvas reaction drawing board:
  - Freehand drawing with smooth curves, brush size slider, color picker (Neon Cyan, Amber, White, Emerald, Rose).
  - Chemical quick-stamp buttons (Benzene ring `⌬`, Double bond `=`, Triple bond `≡`, Plus `+`, Reaction arrow `→`).
  - Undo, clear, and download snapshot functionality.
  - Instant button: "Send Sketch to AI Solver" to analyze drawn mechanisms.

#### `components/StudyAnalyticsPanel.tsx` (New)
- Dedicated study analytics panel:
  - Tracks attempted PYQs and Practice Quiz questions from localStorage.
  - Mastery progress bars across Physical, Inorganic, and Organic Chemistry.
  - Accuracy percentage, question streak counter, and personalized revision recommendations based on missed questions.

---

### 4. Interactive Feedback Integration in PYQ Cards & Quiz
#### `components/QuestionCard.tsx`
- Upgrade option selection to trigger `triggerWrongFeedback` and `triggerCorrectFeedback`.
- Wrong option clicks immediately shake with red border and device vibration.
- Correct option clicks immediately trigger the green neon wave effect and notify the mascot.

#### `components/PracticeQuizView.tsx`
- Integrate `triggerWrongFeedback` and `triggerCorrectFeedback` into option buttons.
- Display instant option feedback with Nemo's shake and glow animations.

---

### 5. Unified Navigation & Page Layout
#### `components/Navbar.tsx`
- Remove the standalone `nemo` iframe tab.
- Add direct navigation tabs for the newly integrated native features:
  - `PYQ Workbench`
  - `Rules & Library (248)`
  - `3D Molecules (124)`
  - `Formula Bank (25)`
  - `Practice Quiz (18)`
  - `Reaction Canvas`
  - `Study Analytics`
  - `Nemo AI Tutor`
  - `Lab Engines (5)`

#### `app/page.tsx`
- Mount the `FloatingNemoCompanion` at the root layout so it accompanies the user across all views.
- Render the new native views (`chat`, `canvas`, `analytics`) seamlessly inside the existing layout shell.
- Clean up any iframe references.

---

## Visual Design & Aesthetics

- **Color Palette**:
  - Background: `#050b19` (Deep Cosmic Navy)
  - Surface Panel: `#0b1630` (Quantum Glass) with hairline border `#1d3765`
  - Primary Accent: `#54e7ff` (Electric Cyan)
  - Correct Feedback: `#4df0b0` (Neon Emerald)
  - Incorrect Feedback: `#ff6b86` (Neon Coral Red)
  - Formula/Warning Accent: `#ffc65c` (Amber Gold)
- **Typography**:
  - Clean title hierarchy with Plus Jakarta Sans / Inter font stack.
  - Tabular numerals (`font-mono`) for numerical values, timers, and scores.
  - Unboxed metadata with quiet typographic separators (`·`).
- **Motion & Micro-interactions**:
  - Haptic feedback pattern: `[40ms, 50ms, 40ms]` for error; `[50ms]` for success.
  - Shake easing: `cubic-bezier(.36, .07, .19, .97)` for 450ms.
  - Correct wave: radial box-shadow expansion up to 14px with fade-out.

---

## Verification Plan

### Automated Tests & Quality Checks
- Run codebase lint check: `npm run lint`
- Run Next.js production build: `npm run build`

### Manual Verification
1. **Wrong Answer Feedback**: Click an incorrect option in both `PYQ Workbench` and `Practice Quiz`. Verify that the button physically shakes with red feedback and triggers device vibration on mobile/supported devices.
2. **Correct Answer Feedback**: Click a correct option. Verify that it expands with a neon green wave pulse and increments accuracy.
3. **Floating Mascot**: Verify the floating Nemo companion sits at bottom-right, animates eyes and orbits, reacts with emotion to question results, and can be collapsed/expanded.
4. **Native Chat Panel**: Send a question to the native Nemo chat, verify level toggles (CBSE/Mains/Adv), and check speech synthesis.
5. **Reaction Canvas**: Draw chemical structures, use chemical stamps (`⌬`, `→`), test eraser and clear actions.
6. **Study Analytics**: Answer several questions and check that mastery percentages update in real time.
7. **No Standalone Iframe**: Verify the entire application runs as a unified Single Page Application without any iframe embeds.
