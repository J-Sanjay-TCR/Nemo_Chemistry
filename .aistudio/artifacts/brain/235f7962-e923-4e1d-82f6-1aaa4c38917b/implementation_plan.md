# Clarify Tutorial Option Labeling & First-Time Visitor Prompt

Resolve ambiguity around the tutorial button so users immediately recognize its purpose across desktop, mobile island, sidebar navigation, and the companion popover, supplemented by a polite one-time welcome prompt for first-time visitors.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Mobile & Compact Presentation**: Icon with visible "Tutorial" text and clear tooltip title, ensuring mobile users immediately know what the button does.
> - **First-Time Visitor Experience**: A friendly, non-intrusive one-time welcome prompt offering new visitors a guided tour of the chemistry workspace.
> - **Unified Naming**: Standardizing on **"App Tutorial"** across desktop topbar, mobile island header, sidebar drawer, and Nemo's quick navigation menu.

---

### 1. Overview & Core Concept

- **What It Does**: Replaces ambiguous standalone icons (such as the unlabelled `💡` icon in the mobile top island header) with explicit, high-contrast "App Tutorial" button labels and tooltips. Adds a polite one-time welcome card for first-time visitors that invites them to take the 1-minute interactive spotlight walkthrough.
- **Target Audience**: Students preparing for CBSE Class 12, JEE Main, and JEE Advanced who need to quickly understand the 3D molecular viewer, formula bank, PYQ archive, and AI tutor features without guesswork.
- **Key Value**: Eradicates navigation confusion, improves feature discoverability, and provides clear orientation for first-time users.

---

### 2. User Experience & Visual Design

#### A. Key Touchpoints & Visual Changes
1. **Mobile Floating Dynamic Island Header (`#mobileTourBtn`)**:
   - Replace bare `💡` icon button with a cohesive button containing both the icon and an explicit text label: `[💡 Tutorial]`.
   - Add explicit accessible attributes: `title="App Tutorial: Interactive Spotlight Feature Guide"`, `aria-label="Start interactive app tutorial"`.
   - Apply clean styling that gracefully fits the mobile island header (`max-height: 36px`, touch target $\ge 44\text{px}$, subtle hover glow).

2. **Desktop Topbar (`#startTourBtn`)**:
   - Update label from `"Feature Tour"` to `"App Tutorial"` with tooltip `"Interactive Step-by-Step App Tutorial"`.
   - Maintain the gold/cyan accent theme matching the high-performance chemistry tutor aesthetic.

3. **Sidebar Drawer (`#sidebarTourBtn`)**:
   - Update label to `"App Tutorial"` accompanied by the `"Guide"` badge for complete terminology consistency.

4. **Floating Nemo Quick Access Popover (`#widgetPopover`)**:
   - Add an `"🎓 App Tutorial"` quick action in the companion popover so users can launch the interactive walkthrough directly while chatting with Nemo.

5. **First-Time Visitor Welcome Card (`#tourWelcomePrompt`)**:
   - Non-intrusive floating toast/banner anchored at the bottom-center or top-center of the screen.
   - Appears after a gentle 3-second dwell delay only on first visit (tracked via `localStorage.getItem("nemo_tutorial_seen")`).
   - Copy: *"Welcome to Nemo Chemistry Tutor! Would you like a quick 1-minute interactive tutorial of all features and controls?"*
   - Actions:
     - Primary button: `"Start Tutorial"` (launches spotlight tour immediately)
     - Dismiss button: `"Explore on My Own"` (closes and remembers choice)
   - Never re-triggers once dismissed or completed.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Mobile Island Header:   [☰] [Nemo Logo]  ★ Sanjay  [💡 Tutorial] [✦] │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼ (Opens)
┌────────────────────────────────────────────────────────────────────────┐
│  Interactive Step-by-Step Spotlight Tutorial                           │
│  ┌──────────────────────────────────────────────┐                      │
│  │ Feature Spotlight Frame (Neon Cyan Outline)  │                      │
│  └──────────────────────────────────────────────┘                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Step 1 of 8: Nemo AI Chemistry Tutor                             │  │
│  │ Contextual controls, keys (1-4, Enter), and feature tips        │  │
│  │ [Skip Tutorial]                           [← Back] [Next Step →] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Text + Icon on Mobile Island vs Icon Only**
  - *Chosen Approach*: Display both the icon and the compact text label `"Tutorial"` on mobile screens.
  - *Why*: Solves the primary user complaint where users had no way of knowing what the bare `💡` icon was for.
  - *Alternative Considered*: Tooltip-only on hover. Rejected because mobile touch devices lack continuous hover states.

- **Decision 2: Non-Modal Welcome Prompt vs Blocking Modal**
  - *Chosen Approach*: A lightweight, dismissible toast card with a 3-second dwell timer.
  - *Why*: Respects user agency and avoids annoying aggressive modal popups upon page load while ensuring first-time visitors are aware of the tutorial.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                       Client Storage                           │
│     localStorage: "nemo_tutorial_seen" = "true" | "false"      │
└────────────────────────────────┬───────────────────────────────┘
                                 │ checks status on load
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                   Tutorial Controller (app.js)                 │
│  ├─ initTutorialPrompts()  ──> Evaluates first-visit status   │
│  ├─ showWelcomePrompt()    ──> Displays polite 3s toast        │
│  ├─ startTour(stepIndex)   ──> Launches spotlight sequence     │
│  └─ closeTour()            ──> Marks completed & restores view │
└─────────────────┬──────────────────────────────┬───────────────┘
                  │                              │
                  ▼                              ▼
┌──────────────────────────────────┐ ┌───────────────────────────┐
│        Desktop & Mobile UI       │ │   Nemo 3D Companion       │
│  ├─ #mobileTourBtn (💡 Tutorial) │ │   #widgetPopover          │
│  ├─ #startTourBtn (App Tutorial) │ │   ├─ "🎓 App Tutorial"    │
│  └─ #sidebarTourBtn (App Tour)   │ └───────────────────────────┘
└──────────────────────────────────┘
```

- **DOM Elements**:
  - Update `#mobileTourBtn`, `#startTourBtn`, and `#sidebarTourBtn` markup in `index.html`.
  - Add `#tourWelcomePrompt` container in `index.html`.
  - Add tutorial trigger in `#widgetPopover` in `index.html`.
- **CSS Styling (`style.css`)**:
  - Add `.tour-mobile-label` styling with proper flex alignment and responsive truncation if screen width is $< 360\text{px}$.
  - Style `#tourWelcomePrompt` with glassmorphic backdrop, crisp typography, and high-contrast buttons matching the app's aesthetic.
- **Script Logic (`app.js`)**:
  - Implement `initTutorialWelcomePrompt()` with `localStorage` persistence.
  - Bind click events for all tutorial trigger buttons and dismiss actions.
- **Verification**:
  - Co-execute `compile_applet` and `lint_applet` twice with zero errors.
  - Rebuild distribution bundles via `npm run build`.
  - Confirm live endpoint availability.
