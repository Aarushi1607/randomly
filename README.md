# 🎲 Randomly

### Less scrolling. More doing.

**Randomly** is a fun, interactive activity discovery web app that helps you decide what to do when you're bored. Instead of wasting time thinking of something to do, explore activities, filter them by your preferences, and discover something new.

With a playful, colourful interface and a collection of activities across different categories, Randomly turns the simple question *"What should I do now?"* into an opportunity to try something different.

---

## ✨ Features

- **🎯 Discover Activities** — Explore a curated collection of activities across different categories.
- **🔎 Smart Filtering** — Narrow down activities based on available categories, duration, difficulty, and other supported preferences.
- **🎲 Surprise Me** — Discover an activity when you don't know what to choose.
- **📋 Activity Details** — View activity descriptions and step-by-step instructions before getting started.
- **❤️ Favourites** — Save activities you want to revisit.
- **✅ Activity History** — Keep track of activities you've completed.
- **⚙️ Saved Preferences** — Retain supported preferences between visits.
- **💾 Local Persistence** — Save favourites, history, and preferences in browser storage.
- **📱 Responsive Interface** — Enjoy the experience across desktop and mobile screen sizes.
- **🎨 Playful Visual Design** — A colourful, scrapbook-inspired interface designed to make discovering activities enjoyable.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building reusable UI components |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and production build tooling |
| CSS Modules | Component-scoped styling |
| Local Storage | Persisting user data in the browser |
| Vitest | Automated testing |

---

## 🚀 Getting Started

Follow these steps to run Randomly locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) — preferably a current LTS version
- npm, which comes with Node.js
- Git, if you want to clone the repository

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd randomly
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually `http://localhost:5173/`.

### 4. Build for production

```bash
npm run build
```

Vite generates the production build in the `dist/` directory.

### 5. Run tests

```bash
npm test
```

This runs the project's configured test suite. Check the terminal output to confirm that all tests pass.

---

## 📖 How to Use Randomly

1. **Explore** the available activities.
2. **Filter** activities according to your preferences.
3. **Choose an activity** or use the surprise feature to discover something unexpected.
4. **Open the details** to read the description and instructions.
5. **Get started** and try the activity.
6. **Save favourites** to revisit activities later.
7. **Track completed activities** through your activity history.

The available options depend on the activity and the features enabled in the current version.

---

## 📂 Project Structure

The project follows a component-based React architecture. The structure below illustrates the main areas of the application; individual files may evolve as development continues.

```text
randomly/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Filtering, storage and utility logic
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── ...                 # Other application files
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧪 Testing and Quality

Randomly uses automated tests to help verify application behaviour and reduce regressions.

The test and build commands are:

```bash
npm test
npm run build
```

Key areas to validate include:

- Activity filtering and selection
- Activity data integrity
- Favourites and completed history
- Browser storage and preference persistence
- Navigation and activity detail interactions
- Production build and responsive layout

---

## 🔮 Future Improvements

Potential enhancements for future versions include:

- More activity categories and personalised recommendations
- Better discovery based on mood, available time, and interests
- Optional activity timers and progress tracking
- Sharing activities with friends
- Additional accessibility improvements
- Automated deployment and CI/CD
- Containerisation and cloud deployment

These are possible future enhancements, not claims about features already implemented.

---

## 🤝 Contributing

Contributions, ideas, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and add tests where appropriate.
4. Run the test suite and production build.
5. Submit a pull request describing your changes.

---

## 👥 Team

**Randomly** is being developed as a collaborative project by a two-person team.

Both contributors work together to build, test, and improve the application.

---

## 📄 License

No license has been specified yet. Add a `LICENSE` file and update this section once the project’s license has been decided.

---

*Randomly — because life is more fun when you try something new.* 🎲