# 🚀 STUDENT COMPANION APP - THE PIVOT MASTER PLAN
> **Status:** Code Red / High-Value Audit Pivot
> **Target Audience:** Indian Gen Z (Engineering Students)
> **Aesthetic:** "Iron Man HUD" / "Cyber-Glass" / "Cinematic Utility"
> **Core Architecture:** Supabase (SQL) + Next.js 14 + Framer Motion + R3F

---

## 🛑 THE CRITICAL PIVOT (WHY WE CHANGED)
We shifted from a "Prototype" mindset to an **"Elite Product"** mindset. The original plan had "Architectural Schizophrenia" (Firebase vs. Supabase docs) and "Ghost UI" (missing features). This plan fixes that.

### 1. The Architecture Swap
*   **Old:** Firebase (NoSQL). Bad for relational data (Grades ↔ Subjects).
*   **New:** **Supabase (PostgreSQL).**
    *   **Why:** Allows complex SQL queries (`JOIN`, `AVG` for GPA), Type Safety, and Row Level Security.
    *   **Action:** Uninstall Firebase. Install `@supabase/supabase-js`.

### 2. The Design Philosophy: "Cinematic Utility"
*   **Old:** "Sci-Fi Space Odyssey" (Too busy, distracting).
*   **New:** **"Holographic Command Center (HUD)."**
    *   **Vibe:** Precision, Dark Mode, Tactical, Data-Forward.
    *   **Colors:** Deep Void (`#050505`), Signal Green (`#00FF94`), Danger Red (`#FF2E2E`).
    *   **Texture:** Carbon Fiber / Mesh Grid overlay (No vintage film grain).

---

## 🎨 THE DESIGN SYSTEM: "NEO-ACADEMIC"

### A. Color Palette (The "Signal" System)
*   **Background:** `#050505` (Deep Void). *Prevents OLED smearing on budget phones.*
*   **Surface:** `#0A0A0A` with `border-white/5` (Subtle separation).
*   **Glass:** `bg-zinc-900/40` with `backdrop-blur-md` (Use sparingly for performance).
*   **Signals (The Only Bright Colors):**
    *   🟢 **Safe:** `#00FF94` (Neon Green) - Attendance > 85%.
    *   🔴 **Danger:** `#FF2E2E` (Signal Red) - Attendance < 75%.
    *   🟣 **XP/Reward:** `#7B61FF` (Electric Purple).

### B. Typography (The "Data" Pairing)
*   **Headers:** **Space Grotesk** (Technical, quirkiness).
*   **Body:** **Manrope** or **Geist Sans** (High legibility on mobile).
*   **Data/Numbers:** **JetBrains Mono** (The "Engineering" aesthetic).
    *   *Usage:* All percentages, GPAs, and dates must be Mono.

### C. The 3D Hero: "The Safe Zone Ring"
Instead of a static card, the dashboard center is a **Living 3D Object**.
*   **Geometry:** A glass Torus (Donut).
*   **Behavior:**
    *   **Safe:** Rotates slowly, glows Green.
    *   **Danger:** Vibrates/Glitches, glows Red, rotates fast.
*   **Interaction:** User swipes/rotates the ring to cycle through subjects.

---

## 🔄 THE NEW USER FLOWS (UX)

### 1. The "Jarvis" Onboarding (Gamified Setup)
*Goal: Make data entry feel like a system boot sequence.*
1.  **Visual:** Black screen. Blinking cursor.
    *   `> INITIALIZING ACADEMIC PROTOCOLS...`
2.  **Input:**
    *   `> IDENTIFY PILOT` (Name).
    *   `> CONFIGURE MODULES` (Select Subjects from a grid).
3.  **Finale:** "Power On" sound. The 3D Ring spins up. **"SYSTEM ONLINE."**

### 2. The Dashboard (The Cockpit)
*Goal: No scrolling for critical info.*
*   **Top (Ticker):** AI "Nudge" (`> PROBABILITY OF QUIZ: HIGH`).
*   **Center (Hero):** The **3D Bunk Meter**.
    *   Text: **"3 BUNKS LEFT"** (Huge, Glowing).
*   **Bottom (Liquid Bar):**
    *   Floating island navbar.
    *   **Central Button:** Pulsing "Mark" button. Tapping it morphs the bar into the Swipe Card.

### 3. The Core Loop: "Liquid Swipe" Attendance
*   **Trigger:** Tap the central pulse button.
*   **UI:** A glass card slides up.
*   **Interaction:**
    *   **Right (Present):** Card stretches (liquid physics). Snap sound. `+10 XP` floats up.
    *   **Left (Absent):** Glitch effect. Red glow. 3D Ring turns red.
    *   **Haptics:** Heavy vibration on snap.

---

## 🛠️ COMPONENT & TECH SPECIFICATIONS

### A. Critical Components to Build
1.  **`GlassTorus.tsx` (R3F):** The 3D hero object.
2.  **`LiquidSwipe.tsx` (Framer Motion):** The attendance card with `useSpring` physics (stiffness: 300, damping: 30).
3.  **`HolographicID.tsx`:** The profile card. Uses `PerspectiveCard` logic to tilt with gyroscope. Exportable as an image for Instagram.
4.  **`TextScramble.tsx`:** Animates numbers (`0.00` -> `9.8`) on load for a "calculating" effect.

### B. Performance "Eagle Eye" Requirements
1.  **Dynamic Imports:** Lazy load `Three.js` and `Framer Motion` components.
2.  **Fake Glass:** Use `bg-neutral-900/90` instead of heavy `backdrop-filter: blur()` on Android.
3.  **Haptics:** Use `navigator.vibrate(50)` for tactile feedback.

---

## 📅 EXECUTION ROADMAP ($10k FINISH)

### Day 1: The Engine Swap
*   [ ] Uninstall Firebase.
*   [ ] Install Supabase Client.
*   [ ] Define SQL Schema (Students, Subjects, Attendance, Grades).

### Day 2: The Visual Foundation
*   [ ] Implement `#050505` Theme & Typography (Space Grotesk + JetBrains Mono).
*   [ ] Build the "System Boot" Onboarding Screen.

### Day 3: The 3D Hero
*   [ ] Build `GlassTorus.tsx` with R3F.
*   [ ] Connect Torus color to a dummy "Safety Score" state.

### Day 4: The Core Loop
*   [ ] Build `LiquidSwipe.tsx`.
*   [ ] Connect Swipe -> Supabase -> Torus Update.
*   [ ] Add Sound Effects & Haptics.

### Day 5: The "Elite" Polish
*   [ ] Add `TextScramble` to all numbers.
*   [ ] Build the Holographic ID Card.
*   [ ] **SHIP IT.**

---

> **Mantra:** We are not building a website. We are building a **Tactical HUD for Students.** Precision, Speed, Signal.
