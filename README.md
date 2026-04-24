<div align="center">

# 📚 Smart Study Planner

### *Stop Scrolling. Start Studying.*

A high-performance, intuitive mobile application designed to help students organize their academic life, track tasks, and optimize study sessions with a built-in focus timer — powered by our flagship **FocusGuard™** social media intervention engine.

Built with **React Native** · **Expo SDK 55** · **TypeScript** · **Kotlin**

<br />

[![Download APK](https://img.shields.io/badge/📲_Download_APK-Latest_Build-6C63FF?style=for-the-badge&logoColor=white)](https://expo.dev/artifacts/eas/iNqCN4f6yPmG4jqrZeFXxr.apk)
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://expo.dev/artifacts/eas/iNqCN4f6yPmG4jqrZeFXxr.apk)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-55-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📸 App Screenshots

<div align="center">
  <img src="assets/images/focusguard-settings.png" alt="FocusGuard Settings — Daily Limits & Quiet Hours" width="280" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/images/focusguard-apps.png" alt="FocusGuard — Monitored Apps & Weekly Reports" width="280" />
</div>

<p align="center"><em>Left: FocusGuard Settings — configure daily social media limits, quiet hours, and toggle monitoring.<br/>Right: Monitored Apps dashboard — real-time per-app usage tracking with weekly reality reports.</em></p>

---

## ❓ Problem Statement

Students frequently struggle with time management, often falling victim to digital distractions. They claim they have "no time to study," yet lose hours daily to social media platforms like Instagram, WhatsApp, and Facebook. Traditional productivity apps and planners tell students what they *should* do, but completely fail to intervene when they inevitably get distracted.

**The core issue:** Existing tools treat *planning* and *distraction management* as separate problems. No single app bridges the gap between *"here's what you need to study"* and *"you're currently doom-scrolling instead."*

---

## 💡 Proposed Solution

The **Smart Study Planner** acts as an all-in-one productivity hub combining task management, Pomodoro scheduling, and our flagship **FocusGuard™** engine. It passively monitors daily social media usage using Android's native APIs and contextually interrupts doom-scrolling by gently nudging the student back to their most urgent pending task.

### How It Works

```
Student opens Instagram → FocusGuard tracks usage in background
     ↓
Usage hits 80% of self-set limit → 🟡 Gentle reminder notification
     ↓
Usage hits 100% of limit → 🟠 Notification with most urgent task embedded
     ↓
Usage hits 2× limit → 🔴 Full-screen nudge — one tap starts Pomodoro
     ↓
Student taps "Start Studying" → Pomodoro launches with task pre-loaded ✅
```

---

## 🎯 Target Audience

| Segment | Description |
|---|---|
| 🎓 **High School & University Students** | Balancing multiple subjects, assignments, and exam deadlines |
| 💻 **Self-taught Developers & Bootcamp Attendees** | Requiring disciplined, structured study routines |
| 🧠 **Individuals with ADHD or Time-blindness** | Who struggle with digital distractions and need external nudges |
| 📱 **Any Student Who Doom-Scrolls** | Anyone who finds themselves spending more time on social media than studying |

---

## 🌟 What Makes This App UNIQUE?

While apps like Forest, Digital Wellbeing, and Todoist exist individually, **none** of them combine social media monitoring, pending task awareness, and a one-tap study launcher in a single free application.

### Competitive Comparison

| App | Monitors Social Media | Knows Your Tasks | One-Tap to Study | Free |
|---|:---:|:---:|:---:|:---:|
| Forest | ❌ | ❌ | ❌ | ❌ |
| Google Digital Wellbeing | ✅ | ❌ | ❌ | ✅ |
| Todoist | ❌ | ✅ | ❌ | ⚠️ |
| **Smart Study Planner (FocusGuard™)** | **✅** | **✅** | **✅** | **✅** |

### Unique Value Propositions

- **🛡️ FocusGuard™ Intervention:** We don't just track time. If a student exceeds their self-imposed social media limit, the app intercepts with a contextual nudge (e.g., *"You've used 1h 23m on Instagram. Your 'Chemistry' task is due tomorrow."*).

- **⚡ One-Tap to Study:** The intervention screen features a single button to instantly launch a 25-minute Pomodoro timer with the pending task pre-loaded. Zero friction.

- **🔒 Privacy-First Accountability:** No shaming. Your limits are self-set. **100% of the usage data stays locally on your device** — nothing is ever uploaded to a server.

- **📊 Weekly Reality Reports:** Automated weekly breakdowns comparing your social media screen time directly against your focused study time.

### Three-Tier Intervention System

| Level | Trigger | Action |
|:---:|---|---|
| 🟡 **Yellow** | 80% of daily limit used | Gentle reminder notification |
| 🟠 **Orange** | Limit hit (100%) | Notification with your most urgent task embedded |
| 🔴 **Red** | 2× limit exceeded | Full-screen nudge — one tap starts Pomodoro |

### The Contextual Nudge

When your limit is hit, you don't just get told to stop scrolling. You get a *contextual, actionable* nudge:

> *"You've used 1h 23m on Instagram today.*
> *Your task 'Complete notebook (Maths)' is due tomorrow.*
> *Tap to start a 25-min focus session."*

**One tap → Pomodoro starts → task pre-loaded. Zero friction back to studying.**

### Weekly Reality Report

Every Sunday the app generates a personal accountability report:

```
📱 Social Media This Week:  9h 04m
📚 Study Time This Week:    6h 30m

⚠️ You spent 2.5 hrs more scrolling than studying.
🎯 Most neglected subject: Maths
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Student sets their own limit** (default: 45 min/day) | App never forces anything — self-accountability |
| **All data stays on-device** | Nothing uploaded, ever — complete privacy |
| **Non-shaming tone** | *"You used 1h 23m"* not *"You wasted 1h 23m"* |
| **Max 1 notification per tier per day** | No spam — respects the student's attention |
| **Uses Android `UsageStatsManager`** | No root, no hacks — built into Android 5+ |

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **Dynamic Dashboard** | Bird's-eye view of your daily tasks, pending deadlines, and study progress |
| ✅ **Task Management** | Create, edit, categorize, and organize academic assignments with ease |
| ⏱️ **Study Timer (Pomodoro)** | Integrated focus timer with customizable session intervals |
| 📵 **FocusGuard™ Engine** | Passive social media monitoring with three-tier contextual intervention |
| 📈 **Weekly Reality Reports** | Automated comparison of social media vs. study time |
| 📱 **Cross-Platform UI** | Clean, glassmorphic design elements with smooth transitions |

---

## 🏗️ Proposed App Structure

The application follows a modern **React Native file-based routing architecture** leveraging Expo Router:

```
smart-study-planner/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Tab navigator configuration
│   │   ├── index.tsx                # 📊 Dashboard / Home screen
│   │   ├── tasks.tsx                # ✅ Task list & management
│   │   └── timer.tsx                # ⏱️ Pomodoro study timer
│   ├── task/
│   │   └── add.tsx                  # ➕ Add / edit task form
│   ├── _layout.tsx                  # Root layout & providers
│   └── focusguard-settings.tsx      # 📵 FocusGuard configuration
├── context/
│   ├── TaskContext.tsx               # Task state management
│   └── FocusGuardContext.tsx         # FocusGuard state & logic
├── android/app/src/main/java/.../
│   ├── FocusGuardModule.kt          # 🔌 Native bridge (UsageStatsManager)
│   ├── FocusGuardPackage.kt         # React Native package registration
│   ├── MainApplication.kt          # Application entry point
│   └── MainActivity.kt             # Main activity
├── assets/images/                   # App icons, splash, screenshots
├── app.json                         # Expo configuration
└── package.json                     # Dependencies & scripts
```

### Module Descriptions

| Module | File | Purpose |
|---|---|---|
| **Dashboard / Home** | `app/(tabs)/index.tsx` | Bird's-eye view of daily tasks, pending deadlines, and study progress |
| **Task Management** | `app/task/add.tsx` & `app/(tabs)/tasks.tsx` | Interfaces to create, categorize, and organize academic assignments |
| **Study Timer** | `app/(tabs)/timer.tsx` | Customizable Pomodoro session intervals to boost productivity |
| **FocusGuard Settings** | `app/focusguard-settings.tsx` | Granular controls for daily social limits, quiet hours, and app whitelist/blacklists |
| **Native Android Module** | `FocusGuardModule.kt` | Native bridge connecting Android's `UsageStatsManager` with the React Native UI |
| **FocusGuard Context** | `context/FocusGuardContext.tsx` | React Context for seamless FocusGuard state management across screens |
| **Task Context** | `context/TaskContext.tsx` | React Context for task CRUD operations and persistence |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Expo](https://expo.dev/) (SDK 55) | Managed workflow, OTA updates, EAS builds |
| **Library** | [React Native](https://reactnative.dev/) | Cross-platform mobile UI |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | File-based routing |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe application logic |
| **Native Bridges** | [Kotlin](https://kotlinlang.org/) | Android background tracking (`UsageStatsManager`) |
| **Icons** | [Expo Vector Icons](https://icons.expo.fyi/) | Material, FontAwesome, Ionicons |
| **State Management** | React Context API | Lightweight, zero-dependency state |
| **Build & Deploy** | [EAS Build](https://docs.expo.dev/build/introduction/) | Cloud-based APK/AAB generation |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your physical device *(optional, for development testing)*

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/9SERG4NT/Smart-Study-planner-Mobile-app.git
   cd Smart-Study-planner-Mobile-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go (Android) or the Camera app (iOS) to launch the app on your device.

---

## 📦 Build & Deployment

To build a standalone APK for Android using Expo Application Services (EAS):

```bash
# Install EAS CLI globally (one-time)
npm install -g eas-cli

# Login to your Expo account
eas login

# Build a preview APK
eas build --platform android --profile preview
```

The generated APK will be available for download from the [Expo dashboard](https://expo.dev/).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by [9SERG4NT](https://github.com/9SERG4NT)**

[![GitHub](https://img.shields.io/badge/GitHub-9SERG4NT-181717?style=flat-square&logo=github)](https://github.com/9SERG4NT)

</div>
