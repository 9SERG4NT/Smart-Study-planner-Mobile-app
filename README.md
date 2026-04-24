# Smart Study Planner 📚🚀

A high-performance, intuitive mobile application designed to help students organize their academic life, track tasks, and optimize study sessions with a built-in focus timer. Built with **React Native** and **Expo**.

[**🚀 Live Build / Download APK**](https://expo.dev/artifacts/eas/iNqCN4f6yPmG4jqrZeFXxr.apk)

---

## 📸 Screenshots

*(To display these screenshots on GitHub, please save your attached images as `focusguard-settings.png` and `focusguard-apps.png` inside the `assets/images/` folder and commit them.)*

<div align="center">
  <img src="assets/images/focusguard-settings.png" alt="FocusGuard Settings" width="300" style="margin-right: 20px;" />
  <img src="assets/images/focusguard-apps.png" alt="FocusGuard Monitored Apps" width="300" />
</div>

---

## ❓ Problem Statement

Students frequently struggle with time management, often falling victim to digital distractions. They claim they have "no time to study," yet lose hours daily to social media platforms like Instagram, WhatsApp, and Facebook. Traditional productivity apps and planners tell students what they *should* do, but completely fail to intervene when they inevitably get distracted.

## 💡 Proposed Solution

The Smart Study Planner acts as an all-in-one productivity hub combining task management, Pomodoro scheduling, and our flagship **FocusGuard** engine. It passively monitors daily social media usage using Android's native APIs and contextually interrupts doom-scrolling by gently nudging the student back to their most urgent pending task.

## 🎯 Target Audience

- **High school & university students** balancing multiple subjects and deadlines.
- **Self-taught developers & boot-camp attendees** requiring disciplined study routines.
- **Individuals with ADHD or time-blindness** who struggle with digital distractions.

## 🌟 What makes this app UNIQUE?

While apps like Forest, Digital Wellbeing, and Todoist exist, **none** of them combine social media monitoring, pending task awareness, and a one-tap study launcher in a single free application.

- **FocusGuard™ Intervention:** We don't just track time. If a student exceeds their self-imposed social media limit, the app intercepts with a contextual nudge (e.g., *"You've used 1h 23m on Instagram. Your 'Chemistry' task is due tomorrow."*).
- **One-Tap to Study:** The intervention screen features a single button to instantly launch a 25-minute Pomodoro timer with the pending task pre-loaded. Zero friction.
- **Privacy-First Accountability:** No shaming. Your limits are self-set. **100% of the usage data stays locally on your device**—nothing is ever uploaded to a server.
- **Weekly Reality Reports:** Automated weekly breakdowns comparing your social media screen time directly against your focused study time.

---

## 🏗️ Proposed App Structure

The application follows a modern React Native file-based routing architecture leveraging Expo Router:

- **Dashboard / Home:** `app/(tabs)/index.tsx` – Bird's-eye view of your daily tasks, pending deadlines, and study progress.
- **Task Management:** `app/task/add.tsx` & `app/(tabs)/tasks.tsx` – Interfaces to create, categorize, and organize academic assignments.
- **Study Timer (Pomodoro):** `app/(tabs)/timer.tsx` – Customizable session intervals to boost productivity.
- **FocusGuard Settings:** `app/focusguard-settings.tsx` – Granular controls for daily social limits, quiet hours, and app whitelist/blacklists.
- **Native Android Module:** `android/app/src/main/java/.../FocusGuardModule.kt` – Native Bridge connecting Android's native `UsageStatsManager` with the React Native UI.
- **Global Context:** `context/FocusGuardContext.tsx` – React Context for seamless state management across screens.

---

## ✨ Key Features

- **📊 Dynamic Dashboard**: Your academic life at a glance.
- **✅ Task Management**: Create, edit, and organize with ease.
- **⏱️ Study Timer**: Integrated focus timer natively.
- **📱 Cross-Platform UI**: Clean, glassmorphic design elements with smooth transitions.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 55)
- **Library**: [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Expo Vector Icons](https://icons.expo.fyi/)
- **State Management**: React Context API
- **Native Bridges**: Kotlin (for Android background tracking)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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

## 📦 Build & Deployment

To build a standalone APK for Android using Expo Application Services (EAS):
```bash
eas build --platform android --profile preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Built with ❤️ by [9SERG4NT](https://github.com/9SERG4NT)

