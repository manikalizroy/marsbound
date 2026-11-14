# MARSBOUND – Junior Astronaut Mission Trainer

---

**Tagline:** *Learn resource‑management and critical‑thinking by surviving a Martian habitat.*

## Overview
MARSBOUND is an interactive, browser‑based simulation built for the NASA Space Apps Challenge 2026.  Players take the role of a **junior astronaut commander** overseeing the ARES‑VI habitat at Jezero Crater, Mars.  The goal is to keep the crew alive for **10 Martian Sols** (days) by managing four essential life‑support resources.

## Problem Statement & Educational Purpose
Real Mars missions involve complex trade‑offs between limited supplies, energy budgets, and unpredictable environmental hazards.  MARSBOUND simplifies those challenges into a **playable learning experience** for middle‑ and high‑school students, helping them understand:
- How resources are inter‑dependent.
- The impact of daily consumption and operational decisions.
- The importance of planning for random events.

## Game Objective
Survive **10 Sols** while keeping each resource above the survival thresholds defined by the game.  The mission ends early if any resource reaches zero.

## Core Resources
| Resource | Role in the habitat |
|----------|----------------------|
| **Oxygen** | Provides breathable air for the crew.
| **Water**   | Supports drinking, hygiene, and plants.
| **Food**    | Supplies nutrition.
| **Energy**  | Powers life‑support systems, solar arrays, and shielding.

## Commander Decisions (choose **one** each Sol)
| Decision | Resource effect (action) | Net effect after daily consumption |
|----------|--------------------------|-------------------------------------|
| **Improve Radiation Shielding** | Energy ‑15, Oxygen +5 | Oxygen 0, Water ‑5, Food ‑5, Energy ‑15 |
| **Expand Greenhouse** | Water ‑15, Energy ‑10, Food +25 | Oxygen ‑5, Water ‑20, Food +20, Energy ‑10 |
| **Conserve Energy** | Energy +20, Food ‑5 (requires no prerequisites) | Oxygen ‑5, Water ‑5, Food ‑10, Energy +20 |
| **Activate Water Recycling** | Energy ‑15, Water +25 (requires Energy ≥ 15) | Oxygen ‑5, Water +20, Food ‑5, Energy ‑15 |
| **Activate Oxygen Generator** | Oxygen +25, Water ‑10, Energy ‑15 (requires Water ≥ 10 and Energy ≥ 15) | Oxygen +20, Water ‑15, Food ‑5, Energy ‑15 |

### Decision Trade‑offs
- **Shielding** protects the habitat but costs a lot of energy.
- **Greenhouse** improves food but consumes water and energy.
- **Conserve Energy** restores power at the expense of food.
- **Water Recycling** replenishes water but uses energy.
- **Oxygen Generator** boosts oxygen but drains water and energy.

## Daily Resource Consumption
At the end of every Sol the habitat automatically loses:
- **Oxygen –5**
- **Water –5**
- **Food –5**
- **Energy –0** (energy is not consumed daily).

## Random Environmental Events
After each decision the game rolls a 30 % chance to trigger one of three events:
- **Severe Dust Storm** – Energy ‑20
- **Water System Leak** – Water ‑15 (excluded when the decision directly increases water)
- **Solar Power Surge** – Energy +15
Events are applied **once per turn** and are displayed in an alert banner.

## Mission Survival Thresholds
To achieve **Mission Success** after completing Sol 10 the habitat must retain at least:
- Oxygen ≥ 35 %
- Water ≥ 35 %
- Food ≥ 30 %
- Energy ≥ 25 %
These values are **simplified educational rules**, not official NASA specifications.

## Success & Failure Conditions
- **Immediate Failure:** If any resource drops to **0** the mission ends instantly with a “Critical Life‑Support Depletion” screen.
- **Success:** After Sol 10, if all four thresholds are met, a success screen is shown.
- **Failure after Sol 10:** If any threshold is not met, a failure screen lists the unmet resources.

## Main Features
- Interactive **landing page** with mission briefing.
- **Dashboard** showing live resource cards with status badges.
- **Decision panel** with five mutually exclusive actions per Sol.
- **Random event banner** that updates each turn.
- **Mission Operations Log** tracking decisions and events.
- **Success / Failure screens** with final resource summary.
- **Restart Mission** button that resets all state.
- Responsive layout for desktop, tablet, and mobile devices.

## Technologies Used
- **React 18** – UI components and state management.
- **Vite** – fast development and build tooling.
- **JavaScript (ES modules)** – game logic and UI interactions.
- **CSS** – custom styling, responsive media queries, and animations.

## Installation & Setup
1. **Clone the repository** (or copy the project folder) to your local machine.
2. Ensure you have **Node.js (≥ 18)** installed.
3. In the project root, run:
   ```bash
   npm install
   ```
   This installs React, Vite and other dev dependencies.

## Running the Application Locally
```bash
npm run dev
```
- Vite will start a development server (by default at `http://localhost:5173`).
- Open the URL in a browser to start the game.

## Project Folder Structure
```
marsbound/
├─ public/                # Static assets (icons, favicon, etc.)
├─ src/                  
│   ├─ components/       # UI components
│   │   ├─ LandingPage.jsx      # Mission briefing screen
│   │   ├─ Dashboard.jsx        # Main game view
│   │   ├─ MissionStatus.jsx    # Sol tracker and outcome header
│   │   ├─ ResourceCard.jsx     # Individual resource display
│   │   ├─ DecisionControls.jsx# Decision button grid
│   ├─ gameLogic.js      # Core rules: resources, decisions, events, outcome
│   ├─ App.jsx           # Root component that switches between brief & dashboard
│   ├─ main.jsx          # React entry point
│   └─ App.css           # Global styling and responsive media queries
├─ index.html            # HTML template used by Vite
├─ package.json          # Scripts & dependencies
└─ vite.config.js        # Vite configuration (default)
```

## Future Improvements (Ideas)
- Add **tutorial/tutorial mode** for new players.
- Include **visual animations** for events (e.g., dust storm overlay).
- Provide **statistics** after each game (average resources, best strategies).
- Allow **customizable survival thresholds** to vary difficulty.
- Implement **sound effects** for decisions and events.
- Add accessibility enhancements (ARIA labels, high‑contrast mode).

---

*This project is a student‑led educational demo.  All gameplay mechanics are intentionally simplified and do **not** represent official NASA mission parameters.*
