# Direct Exam & Gold PYQ Navigation in Practice Section

Accelerate student exam readiness by integrating direct launch pathways to premier **JEE Main** and **JEE Advanced** Chemistry PYQ examination portals directly from the Practice header, while automatically safeguarding the student's ongoing quiz state and performance statistics.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters were confirmed through the interactive clarification:
> - **Destination Portals**: Direct choices for both **JEE Main Chemistry** and **JEE Advanced Chemistry** examination portals (featuring ExamGOAL and official examination archives).
> - **Header Integration**: Seamlessly placed in the **top header of the Practice panel** right alongside the branch selector (`#practiceBranch`), providing immediate visibility without cluttering the quiz questions.
> - **Session Persistence**: Redirection launches in a secure **new tab (`target="_blank" rel="noopener noreferrer"`)**, ensuring the student's active practice questions, selected options, and timer never reset.

- **Confirmed Decision 1**: Dual-option portal launcher supporting both **JEE Main Chemistry PYQs** (ExamGOAL / NTA) and **JEE Advanced Chemistry PYQs** (ExamGOAL / IIT JEE Advanced Archive).
- **Confirmed Decision 2**: Top header placement styled as an interactive, glowing **Gold Exam Portal Button & Dropdown Menu** matching Nemo's dark scientific aesthetic.
- **Confirmed Decision 3**: Automatic state preservation in browser `localStorage` before launch so students can switch back and forth effortlessly.

---

## 1. Overview & Core Concept

- **What It Does**: Provides direct access to dedicated online exam practice portals across multiple prominent access points:
  1. **Practice Header Dropdown**: Top header action button with auto-upward positioning and panel elevation (`isolation: auto !important`, `z-index: 2500+`) to eliminate any clipping by lower panels.
  2. **10-Year PYQ Bank Header Dropdown**: Directly embedded in `#pyqPanel` alongside the 10-year question archive.
  3. **Standalone Gold PYQ Showcase Hub (`#pyqGoldHub`)**: Dedicated full-width glassmorphism showcase card with direct cards for JEE Main, JEE Advanced, IIT Archive, and NTA Downloads.
  4. **Standalone App Navigation**: Dedicated sidebar navigation item (`#navGoldPortals`) and workspace tab (`★ Gold Exam Portals`) with smooth scrolling and radiant spotlight highlight.
- **Direct Portal Destinations**:
  1. **JEE Main Chemistry PYQs (ExamSIDE)**: `https://questions.examside.com/past-years/jee/jee-main/chemistry`
  2. **JEE Advanced Chemistry PYQs (ExamSIDE)**: `https://questions.examside.com/past-years/jee/jee-advanced/chemistry`
  3. **Official IIT JEE Advanced Archive**: `https://jeeadv.ac.in/archive.html`
  4. **NTA Official Question Paper Bank**: `https://nta.ac.in/Downloads`

---

## 1.1 Unified Living Nemo Tutor & Dynamic Scroll Transitions

- **Removed Static Disfigured Face**: Replaced the static crude blue faceplate in the Hero banner with a clean, quantum orbital docking anchor (`#heroMascotAnchor`) surrounded by rotating atomic paths and floating chemical symbols (`CH₃`, `H₂O`, `⌬`, `NH₃`).
- **Living Mascot in Hero (Home View)**: When at the top of the home page, the 3D Nemo companion expands into the Hero position (~156px diameter), displaying live expressive facial expressions:
  - Cute periodic anime double-blinks (`cuteBlink`) with dual sparkling glints and eyelids.
  - Interactive cursor gaze tracking: pupils follow user cursor movements with realistic subtle eye parallax.
  - Rosy blushing cheeks with glowing ambient warmth.
  - Expressive smiling mouth with tongue and animated speaking waves during voice tips (`mouthTalk`).
  - Swaying antenna with a twinkling golden star (`★`).
- **Dynamic Scroll Transitions**:
  - **Scrolling Down**: Nemo smoothly glides and shrinks from the Hero anchor (~156px) into the bottom-right compact floating companion (74px).
  - **Returning to Home Page**: Nemo smoothly expands and glides back into the Hero docking position without layout shifts, visual artifacts, or pipeline errors.
  - Interactive clicking in Hero mode plays a cheerful Web Audio chime, triggers a happy reaction, and opens the companion navigation popover.

---

## 2. User Experience & Visual Design

### A. Layout Placement & Interaction

The control is positioned in `.practice-panel .panel-head` right next to `#practiceBranch`:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Practice                                                               │
│ Original study questions • not official PYQs                           │
│                                                                        │
│                      [⌗ Gold Exam Portals ▾]  [All branches ▾]        │
└────────────────────────────────────────────────────────────────────────┘
```

When clicked, a sleek, glassmorphic dropdown card expands smoothly with two primary options:

1. **⚡ JEE Main Chemistry Portal**:
   - Launches ExamGOAL / NTA JEE Main Chemistry chapterwise question bank.
   - Shows sub-tag: `2019–2025 Multi-Shift CBT Tests · Single Choice & Numerical`.
2. **⚛ JEE Advanced Chemistry Portal**:
   - Launches ExamGOAL / IIT JEE Advanced Chemistry portal.
   - Shows sub-tag: `Multi-Correct, Matrix Match, Paragraph & Integer Types`.

### B. Visual Identity & Theme Tokens

- **Button Style**: Styled with a high-visibility gold-amber gradient (`#f59e0b` to `#d97706`) with an amber ring pulse (`rgba(245, 158, 11, 0.25)`), contrasting sharply against the deep slate canvas (`#08142a`).
- **Tactile Click Feedback**: Integrated with the app's kinetic button click animations (`btn-clicked`, blue/gold ripple effect on click).
- **Mobile Responsive**: Adapts into a streamlined icon button or flex-wrap header item on screens $<640\text{px}$, preventing any overflow.
- **Accessible & Screen-Reader Ready**: Uses `aria-haspopup="true"`, `aria-expanded="false"`, `role="menu"`, and keyboard navigation (`Escape`, `ArrowDown`, `Enter`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Dropdown vs Modal vs Immediate Redirect**
  - *Chosen Approach*: Lightweight floating dropdown popover directly in the Practice header.
  - *Why*: Gives the student an immediate one-click choice between JEE Main and JEE Advanced without opening a disruptive modal or losing context on the current question.
  - *Alternatives Considered*: Direct single-URL link was discarded because students preparing for JEE Main need different question styles than those preparing for JEE Advanced.

- **Decision 2: Tab Target & Session Safety**
  - *Chosen Approach*: New tab launch (`window.open(url, '_blank', 'noopener,noreferrer')`) with pre-launch quiz state backup.
  - *Why*: Ensures the student doesn't accidentally navigate away from an in-progress 10-question practice drill.

---

## 4. Technical Architecture & Data Strategy

### System Flow & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Practice Header Component                          │
│                                                                             │
│  ┌───────────────────────┐              ┌────────────────────────────────┐  │
│  │ #practiceBranch       │              │ #examPortalBtn                 │  │
│  │ (Branch Filter)       │              │ "⌗ Gold Exam Portals ▾"        │  │
│  └───────────┬───────────┘              └───────────────┬────────────────┘  │
└──────────────┼──────────────────────────────────────────┼───────────────────┘
               │                                          │ (click / keyboard)
               ▼                                          ▼
   ┌───────────────────────┐              ┌────────────────────────────────┐
   │ Filter Quiz Questions │              │ #examPortalDropdown            │
   │ (Physical/Org/Inorg)  │              │ (Glassmorphic Popover)         │
   └───────────────────────┘              └───────┬────────────────┬───────┘
                                                  │                │
                         ┌────────────────────────┘                └────────────────────────┐
                         ▼                                                                  ▼
        ┌─────────────────────────────────┐                                ┌─────────────────────────────────┐
        │ Option 1: JEE Main Portal       │                                │ Option 2: JEE Advanced Portal   │
        │ - ExamGOAL JEE Main Chemistry   │                                │ - ExamGOAL JEE Adv Chemistry    │
        │ - Save Quiz Session             │                                │ - Save Quiz Session             │
        │ - Open New Tab                  │                                │ - Open New Tab                  │
        └─────────────────────────────────┘                                └─────────────────────────────────┘
```

### Event Handling & Implementation Strategy

1. **DOM Markup (`index.html`)**:
   - Add `#examPortalContainer` inside `#practicePanel .panel-head`.
   - Include trigger `#examPortalBtn` and dropdown card `#examPortalMenu`.
2. **CSS Styling (`style.css`)**:
   - Add `.exam-portal-btn`, `.exam-portal-menu`, `.portal-item`, and gold hover animations.
   - Support mobile collapse and `no-effects` mode.
3. **Behavioral Controller (`app.js`)**:
   - Toggle dropdown open/close on click.
   - Close on outside click or `Escape` key.
   - Save current quiz state before triggering `window.open(targetUrl, '_blank')`.
   - Show quick celebratory toast: `"Opening JEE Chemistry Portal in new tab"`.
