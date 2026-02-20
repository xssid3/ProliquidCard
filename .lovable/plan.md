
## Liquid Glass Cards — Photo Card Generator

A zero-backend, single-page React app that lets users create stunning glassmorphism-style cards and download them as images.

---

### 🎨 Visual Design System
- **Canvas Background:** Animated or static vibrant multi-color gradient (blue-purple-pink swirls, similar to the reference images). Users can swap between 20+ preset gradients or upload their own background image via Ctrl+V or file upload.
- **Glass Card:** `backdrop-filter: blur(20px)`, semi-transparent white/dark background (`bg-white/10`), subtle white border (`border border-white/20`), soft drop shadows — exactly replicating the aesthetic in the reference images.
- **Sidebar Panel:** Also glassmorphic — a frosted, slightly translucent sidebar that feels like part of the design.
- **Typography:** Inter font (imported via Google Fonts) — clean, high-contrast white text on glass.

---

### 📐 Card Templates (3 layouts)
1. **Quote Card** — Large centered quote text with decorative quotation marks, author name at the bottom with a thin separator line.
2. **Q&A Card** — "Q:" block in a slightly lighter glass sub-panel, "A:" block below it — great for social content.
3. **Image + Text Card** — Inner rounded image container (placeholder or uploaded image) on one side, title + description text on the other.

---

### 🖼️ Background & Image Input
- **Global Ctrl+V / Cmd+V paste** listener: pasting an image from clipboard instantly sets the canvas background (or inner card image in Image+Text mode).
- **File upload button** for background images and inner card images.
- **Gradient presets:** A scrollable picker with 20+ curated gradients (ocean blues, sunset oranges, neon darks, pastels, aurora greens, etc.).

---

### ✏️ Dual-Mode Editing
- **Click-to-edit on canvas:** All text fields use `contentEditable` — click any text on the card to edit it inline, just like Notion or Figma.
- **Sidebar controls:**
  - Template selector (3 cards with visual thumbnails)
  - Gradient/background picker grid
  - Aspect ratio toggles: Square (1:1), Wide (16:9), Story (9:16), Portrait (4:5)
  - Light / Dark glass mode toggle
  - Icon picker: a small grid of Lucide icons that can be dropped onto the card

---

### 📱 Responsive Layout
- **Desktop:** Sidebar on the left (~280px), canvas centered in the remaining space.
- **Mobile:** Sidebar collapses into a bottom sheet / drawer, canvas fills the screen.

---

### 💾 Export
- **Download button** (prominent, glowing) in the sidebar.
- Format choice: **PNG** or **JPG**.
- Uses `html-to-image` to capture the card canvas element with all CSS effects (blur, gradients, rounded corners) accurately rendered.

---

### 🧩 Component Breakdown
- `App.tsx` — Global state, paste listener, layout shell
- `CardCanvas.tsx` — The card rendering area with the gradient background
- `GlassCard.tsx` — The glass card component with template switching
- `Sidebar.tsx` — All controls in a glass panel
- `GradientPicker.tsx` — Grid of gradient swatches
- `TemplatePicker.tsx` — Visual template thumbnails
- `IconPicker.tsx` — Lucide icon grid
- `ExportButton.tsx` — Download logic with format selection

---

### 📦 New Dependencies to Add
- `html-to-image` — for PNG/JPG export
- `framer-motion` — for smooth panel transitions and hover states

