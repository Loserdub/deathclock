# ☠ DeathClock

> **Radical clarity through mortality.** Calculate your estimated lifespan, visualize your life in weeks, align your daily actions with your life goals, and track your bucket list before time runs out.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Justin%20Ray-blue.svg)](https://trustnodelogic.com)
[![Web](https://img.shields.io/badge/Website-trustnodelogic.com-green.svg)](https://trustnodelogic.com)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20JS-orange.svg)](#technology-stack)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#privacy--data-security)

---

## 📖 Overview

**DeathClock** is an existential productivity and *memento mori* web application designed to bring honest perspective to your daily life. Rather than serving as morbid fatalism, DeathClock uses actuarial and lifestyle data to create an urgent, motivating visual reminder that time is our only non-renewable resource.

Built with a privacy-first, zero-dependency architecture, all calculations and personal data remain 100% local to your browser.

---

## ✨ Features

### 1. 🧬 Multi-Factor Lifespan Calculation Engine
A 5-step guided onboarding wizard analyzes biological, physiological, and psychological baselines:
* **Biological & Regional Baselines:** Country-specific life expectancy curves and sex-at-birth statistics.
* **Physical Health Factors:** Impact assessment for smoking, alcohol consumption, exercise frequency, dietary quality, sleep duration, and BMI.
* **Psychological & Social Factors:** Adjustments for chronic stress, mental health, social connectedness (combating loneliness), job satisfaction, and purpose (*Ikigai*).
* **Philosophical Orientation:** Custom quote engines and thematic styling tailored to your worldview (**Stoic**, **Buddhist**, **Existentialist**, **Faith-based**, **YOLO**, **Nihilist**, or **Humanist**).
* **Legacy & Regrets:** Reflection prompts capturing what you want to be remembered for and what you would most regret leaving undone.

### 2. ⏳ Real-Time Mortality Dashboard
* **Live Countdown:** High-precision countdown ticker displaying remaining **Years : Days : Hours : Minutes : Seconds**.
* **Key Vital Statistics:** Estimated death date, total estimated lifespan, percentage of life already lived, and the microscopic fraction of your remaining life represented by today.
* **Daily Urgency Indicator:** Progress bar tracking how much of the current 24-hour cycle has elapsed alongside personalized daily philosophical reflections.
* **Regret Radar:** Persistent surfacing of your primary stated life regrets to keep priorities front and center.

### 3. 🎯 Goal-Aligned Task Management
* **Smart Semantic Task Scoring:** As you add daily tasks, the engine scans your stated life goals and grades task alignment as **🔥 High**, **⚡ Mid**, or **❄ Low** relevance.
* **Actionable Focus:** Helps ensure daily effort directly feeds long-term life aspirations rather than trivial busywork.

### 4. 📅 Life Calendar ("Your Life in Weeks")
* Visual grid where each square represents **1 single week** of your total estimated lifespan.
* Color-coded visualization contrasting **Weeks Lived**, the **Current Active Week**, and **Remaining Weeks**.

### 5. 🪣 Categorized Bucket List & Progress Tracking
* Organize lifetime ambitions into 8 core categories:
  * 🏔 **Adventure**
  * ❤️ **Relationships**
  * 🚀 **Career**
  * 🎨 **Creative**
  * 💪 **Health**
  * 🌿 **Spiritual**
  * ✈️ **Travel**
  * 📚 **Learning**
* Interactive SVG circular progress ring tracking completion percentage and dynamic motivational quotes.

### 6. ⚗️ Interactive Habit Impact Simulator
* Toggle positive and negative lifestyle habits in real time to observe their direct mathematical impact on your clock:
  * 🚬 Smoking, 🍺 Alcohol, 📱 Screen time, 🍔 Poor diet, 😴 Sleep deprivation
  * 🏃 Cardio, 🏋️ Strength training, 🥗 Mediterranean diet, 🧘 Meditation, 👫 Social bonds, 🌞 Sunlight/Vit D, 🚰 Hydration, 🧠 Continuous learning
* Dynamically shifts your estimated death date, countdown timer, and life calendar grid.

---

## 🔒 Privacy & Data Security

* **100% Client-Side:** No accounts, no backend databases, no third-party tracking scripts, and zero telemetry.
* **Local Storage:** All user inputs, goals, tasks, bucket list items, and habit toggles are persisted strictly in your browser's `localStorage`.
* **Instant Reset:** Complete one-click data wipe available at any time via the navigation reset button.

---

## 🛠 Technology Stack

* **Structure:** Semantic HTML5
* **Styling:** Custom Vanilla CSS3 (Custom design system, CSS variables, glassmorphism, responsive grid & flexbox, dark mode palette)
* **Logic:** Vanilla JavaScript (ES6+, zero runtime dependencies, event-driven state machine)
* **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts

---

## 🚀 Getting Started

### Option 1: Direct Browser Launch
Simply clone or download the repository and open `index.html` (or `deathclock.html`) directly in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/Loserdub/deathclock.git

# Navigate into the project folder
cd deathclock

# Open in your default browser (macOS/Linux/Windows)
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

### Option 2: Local Development Server
You can run a local HTTP server using any of the following lightweight utilities:

```bash
# Using Node.js npx
npx serve .

# Using Python 3
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` (or the port specified) in your browser.

---

## 📂 Project Structure

```
deathclock/
├── index.html         # Main web application entry point
├── style.css          # Design system, dark theme styles & animations
├── app.js             # Core application state, lifespan engine & UI controllers
├── deathclock.html    # Standalone single-file distribution
├── LICENSE            # MIT License
└── README.md          # Project documentation & overview
```

---

## 👤 Author & Credits

* **Creator:** **Justin Ray**
* **Organization / Website:** [trustnodelogic.com](https://trustnodelogic.com)
* **GitHub:** [@Loserdub](https://github.com/Loserdub)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
