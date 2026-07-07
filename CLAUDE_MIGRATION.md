# 🌲 PlateWiki — Claude Fable 5 Migration Guide

Welcome, Claude! This codebase contains **PlateWiki**, a game-designed health and nutrition dashboard centered around a retro Tamagotchi-style biometric athlete that mirrors the user's real-life habits (inspired by the ForestApp concept).

This guide documents the completed features, assets, and next steps for tightening up the implementation.

---

## 🚀 1. Completed Features

### 🎮 ForestApp-style Biometric Clearing & Decay
* **Score-based Forest Growth**: The avatar's health score (average of Nourishment & Fitness) dynamically populates the forest viewport with plants.
  * **Score ≥ 85%**: Grows 4 lush, wind-swaying trees/flowers (`🌲`, `🌳`, `🌿`, `🌸`).
  * **Neglect/Missing Logs**: Clears the plants and withers the clearing into dead branches, logs, and dying flowers (`🥀`, `🍂`, `🪵`).
* **Sluggish Famished State**: When Nourishment or Fitness falls below `35%`:
  * A pulsing red warning banner is displayed: `⚠️ AVATAR NEGLECTED / FAMISHED`.
  * The avatar gets a floating distress bubble above their head (`😰 Hungry`).
  * The walking speed is halved (from `1.4` step size down to `0.7`) and wanders less frequently to represent fatigue.

### 🎨 Pixel-Perfect Character Canvas & Recoloring
* **Offscreen Double-Buffering**: Built an offscreen buffer canvas inside [PixelFighterCanvas.tsx](file:///src/components/PixelFighterCanvas.tsx) that compiles all layers (character frame + custom coloring shifts + equipped hats + shields/weapons) in memory before rendering to the main canvas. This completely eliminates sprite flashing/flickering.
* **Precise Swatch Maps**: Dynamic recoloring shifts pixels relative to base image anchors (`baseSkin`, `baseHair`, `baseTop`, `baseGlove`, `baseShoe`) while preserving natural lighting shadows.
* **Overlap Protection**: Restricts the Skin filter to a Red-Green difference `(R - G) <= 55` to prevent overlap with highly saturated terracotta gloves, keeping the skin natural.
* **Cache Busting**: Added `?v=3` query strings to spritesheet loaders to force the browser to bypass local caching and load the newest compiled textures.

### ⚙️ Free Gear Store (0 Seed Coins for Testing)
* **Gear Category**: Implemented a dedicated **Gear & Equipment** tab in the Kitchen Shop ([GymShopPage.tsx](file:///src/components/GymShopPage.tsx)).
* **Free Testing**: Set all prices of Gear, Premium Colors, Transmog Styles, and Boosts to `0` 🌱. The user can buy and equip them instantly to preview animations.

### 🛠️ Automated Asset Creation Pipeline
* **Zero-Cost Asset Importer**: Built [import_gear_item.py](file:///scripts/import_gear_item.py). Give it a raw item image (e.g. from any free pixel art generator), and it automatically:
  1. Keys out green background using the HSV fringe filter.
  2. Snaps the item to a `32x32` grid and quantizes colors (reproducing ComfyUI's pixel-snapper).
  3. Automatically overlays and compiles all 18 sheets (Idle, Eating, Level Up across 3 stages and both genders).
  4. Outputs the TypeScript config code.

---

## 📦 2. Generated Game Assets
We generated and fully imported the following custom gear assets (available in `/public/fighters`):
1. **Apple Hat** (`headgear` slot) — A round red apple with a green leaf stem.
2. **Mushroom Cap** (`headgear` slot) — A classic red-and-white spotted organic cap.
3. **Broccoli Shield** (`gloves` slot) — A fibrous shield sliced from a giant broccoli head.
4. **Banana Sword** (`gloves` slot) — A potassium-packed yellow blade with a green peel hilt.
5. **Carrot Sword** (`gloves` slot) — A long pointed carrot blade with leafy hilt wraps.
6. **Watermelon Shield** (`gloves` slot) — A thick sliced watermelon wedge defense item.

---

## 🔧 3. Tightening Up & Next Steps (Your TODO List)

1. **State Synchronization on Transitions**:
   * Currently, the Virtual Gym's Nourishment and Fitness levels decay in React state and save to local storage. 
   * Make sure that logging a meal in the Food Tracker instantly triggers the eating animation in the Virtual Gym viewport even if the user is on a different tab, by standardizing on a global state/event model.
2. **Manual Sleep Override**:
   * The sleep cycle is bound to system clock time (`10 PM to 6 AM`). When sleeping, the background goes dark, Zzz particles float, and energy restores.
   * For testing, implement a "Send to Sleep" manual toggle or button in the customizing panel so developers can verify nighttime filters instantly.
3. **8-Bit Retro Sound Effects**:
   * Add web-audio sound effects for game feedback loops (e.g., a high-pitched chew sound during `chewing`, a level-up fan-fare chime when leveling up, and UI purchase chings).
4. **Expanding Shop Progression**:
   * Once visual testing is complete, restore the coin balance pricing hooks so that consistent food logging actually unlocks items sequentially.
