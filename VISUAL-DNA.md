# 🧬 VISUAL DNA: THE "CINEMATIC UTILITY" SYSTEM
> **Status:** Production Design Spec
> **Aesthetic:** "Iron Man HUD" / "Cyber-Glass" / "Tactile Precision"
> **Core Principle:** Utility is beautiful. Data is the hero.

---

## 🎨 1. THE PALETTE (SIGNAL & VOID)

We do not use gray. We use **Void** and **Signal**.

### **Backgrounds (The Void)**
*   **Deep Void:** `#050505` (Main Background) - *Note: Not #000000 to prevent OLED smearing.*
*   **Surface:** `#0A0A0A` (Cards/Modals) - *Use for elevated surfaces.*
*   **Glass:** `rgba(20, 20, 20, 0.6)` - *Use with backdrop-blur-md.*

### **Borders & Dividers (The Grid)**
*   **Subtle:** `rgba(255, 255, 255, 0.05)` - *Standard borders.*
*   **Active:** `rgba(255, 255, 255, 0.15)` - *Hover states.*
*   **Glow:** `rgba(255, 255, 255, 0.08)` - *Inner glow for cards.*

### **Signals (The Meaning)**
These colors are **Functional**, not decorative. They indicate system status.
*   **🟢 SAFE (Signal Green):** `#00FF94`
    *   *Usage:* Attendance > 85%, Grades > 9.0, "Present" swipe.
    *   *Glow:* `box-shadow: 0 0 20px -5px rgba(0, 255, 148, 0.5)`
*   **🔴 CRITICAL (Signal Red):** `#FF2E2E`
    *   *Usage:* Attendance < 75%, Missed Deadlines, "Absent" swipe.
    *   *Glow:* `box-shadow: 0 0 20px -5px rgba(255, 46, 46, 0.5)`
*   **🟣 REWARD (Electric Purple):** `#7B61FF`
    *   *Usage:* XP Gain, Level Up, Gamification triggers.
*   **🔵 SYSTEM (Hologram Blue):** `#00D4FF`
    *   *Usage:* Information, Selection, Active Tab.

---

## 🔤 2. TYPOGRAPHY (THE "DATA" STACK)

### **Headers: Space Grotesk**
*   *Vibe:* Technical, quirky, "Aerospace."
*   *Weights:* Bold (700) for Headlines, Medium (500) for Subheads.
*   *Tracking:* `-0.02em` (Tighter for a solid feel).
*   *Usage:* Page Titles, Module Names ("OPERATING SYSTEMS").

### **Data & Numbers: JetBrains Mono**
*   *Vibe:* Engineering, Code, Precision.
*   *Weights:* Regular (400), Bold (700).
*   *Usage:* **ALL** numbers. Percentages (`85%`), GPA (`9.2`), Dates (`12 OCT`), Times (`09:00`).
*   *Effect:* Always use `tabular-nums` so digits don't jump when counting.

### **Body: Manrope**
*   *Vibe:* Clean, geometric, highly legible on mobile.
*   *Weights:* Regular (400), Medium (500).
*   *Usage:* Descriptions, Chat messages, Long text.

---

## 🧊 3. THE 3D HERO: "GLASS TORUS" (R3F SPEC)

The center of the dashboard is not a card. It is a **Living 3D Object**.

### **Geometry**
*   **Shape:** `TorusGeometry` (Radius: 2, Tube: 0.8, RadialSegments: 32, TubularSegments: 100).
*   **Material:** `MeshPhysicalMaterial`
    *   `transmission`: 1.0 (Glass).
    *   `roughness`: 0.0 (Perfect polish).
    *   `thickness`: 2.0 (Deep refraction).
    *   `clearcoat`: 1.0.

### **Behavior States**
1.  **State: IDLE (Safe)**
    *   *Color:* `#00FF94` (Green emission).
    *   *Motion:* Slow rotation on X and Y axes (`speed: 0.2`).
2.  **State: WARNING (<75%)**
    *   *Color:* `#FF2E2E` (Red emission).
    *   *Motion:* Fast rotation (`speed: 2.0`).
    *   *Effect:* `MeshDistortMaterial` kicks in (distort: 0.4, speed: 5.0) to make it "glitch."

---

## ⚡ 4. INTERACTION PHYSICS (FRAMER MOTION)

We don't use "Ease In/Out." We use **Spring Physics**.

### **The "Liquid" Swipe (Attendance Card)**
When dragging the card, it should feel heavy and viscous.
*   **Spring Config:** `stiffness: 300`, `damping: 30`, `mass: 1`.
*   **Drag Elasticity:** `0.7` (Resistance increases as you pull).
*   **Threshold:** `150px` drag to trigger action.

### **The "Magnetic" Pull (Buttons)**
Buttons should pull the cursor/thumb towards them.
*   **Range:** Detect mouse within `100px`.
*   **Strength:** `0.3` (Cursor moves 30% towards button center).
*   **Spring:** `stiffness: 150`, `damping: 15`.

### **Haptic Feedback Pattern**
*   **Tap:** `vibrate(10)` (Tiny click).
*   **Swipe Trigger:** `vibrate([10, 30])` (Double pulse when threshold reached).
*   **Success:** `vibrate(50)` (Heavy thud).
*   **Error:** `vibrate([30, 50, 30])` (Shudder).

---

## 🎛️ 5. COMPONENT BLUEPRINTS

### **A. The "Liquid" Navbar**
*   **Shape:** Pill-shaped floating island.
*   **Glass:** `backdrop-blur-lg` with `bg-black/50` and `border-white/10`.
*   **Morphing:** When the center "Mark" button is tapped, the navbar **morphs** (layout transition) into the **Attendance Card** modal. It expands from the bottom up.

### **B. The "Scramble" Text Reveal**
*   **Logic:** When a number loads (e.g., GPA), it doesn't fade in. It scrambles.
*   **Sequence:** `0.00` → `1.42` → `5.91` → `8.20` → `9.42`.
*   **Duration:** `800ms`.
*   **Font:** JetBrains Mono.

### **C. The "Holographic" ID Card**
*   **Tilt Effect:** Map `mousemove` (desktop) or `deviceorientation` (mobile) to `rotateX` and `rotateY`.
*   **Layering:**
    *   Layer 1: The Card Base (Black).
    *   Layer 2: The Data (Text) - Moves `20px` in Z-space.
    *   Layer 3: The Hologram Overlay (Linear Gradient) - Moves opposite to rotation to simulate light reflection.

---

## 🌆 6. TEXTURES & ATMOSPHERE

### **The "Mesh" Overlay**
*   Instead of film grain, use a **Hexagonal Mesh** pattern.
*   **Opacity:** `3%`.
*   **Blend Mode:** `Overlay`.
*   **Effect:** Gives the background a "Carbon Fiber" tactical feel.

### **The "Signal" Glows**
*   Do NOT use black shadows (`box-shadow: 0 10px black`).
*   Use **Colored Ambient Glows**.
    *   *Safe Card:* `shadow-[0_0_40px_-10px_rgba(0,255,148,0.2)]`.
    *   *Danger Card:* `shadow-[0_0_40px_-10px_rgba(255,46,46,0.2)]`.

---

> **Design Mantra:**
> If it moves, it has physics.
> If it's a number, it's Mono.
> If it's critical, it glows.
> **Utility is the aesthetic.**
