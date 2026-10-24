# 🎲 Randomly

### Less scrolling. More doing.

**Randomly** is a fun, interactive activity discovery web app that helps you decide what to do when you're bored. Instead of wasting time thinking of something to do, explore activities, filter them by your preferences, and discover something new — or let the "Surprise Me" button pick for you!

With a playful, colourful interface and a collection of activities across different categories, Randomly turns the simple question *"What should I do now?"* into an opportunity to try something different.

---

## ✨ Features

- **🎯 Discover Activities** — Explore a curated collection of activities across different categories.
- **🔎 Smart Filtering** — Filter activities by category, mood, duration, budget, location, and company type.
- **🎲 Surprise Me** — Let the universe decide with a random activity picker and fun spin animation.
- **📋 Activity Details** — View full activity descriptions with step-by-step instructions.
- **❤️ Favourites (Cloud-Synced)** — Save favourite activities to your account. Sign in to access your favorites from any device. Powered by Supabase.
- **🔐 User Authentication** — Create an account or sign in with existing credentials via Supabase.
- **✅ Activity History** — Track activities you've completed (stored locally).
- **⚙️ Saved Preferences** — Persist your filter preferences between visits.
- **💾 Local Persistence** — Favourites, history, and preferences persist in your browser.
- **📱 Responsive Interface** — Enjoy the experience across desktop and mobile screen sizes.
- **🎨 Playful Visual Design** — A colourful, scrapbook-inspired interface with hand-drawn styling.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI component library |
| **TypeScript** | Type-safe frontend code |
| **Vite** | Fast development server and production build |
| **CSS Modules** | Scoped component styling |
| **Supabase** | Backend-as-a-service: authentication + cloud favorites database |
| **Vitest** | Unit testing framework |
| **oxlint** | JavaScript/JSX linter |
| **Docker** | Containerization for deployment |
| **nginx** | Production web server (in Docker container) |
| **Jenkins** | CI/CD automation pipeline |
| **Docker Hub** | Docker image registry |
| **Kubernetes (Minikube)** | Local container orchestration |

---

## 🏗️ Architecture and Workflow

```
Developer Push → GitHub → Webhook → Jenkins Pipeline → Docker Hub → Minikube
```

### The CI/CD Pipeline

1. **Developer Push** — You push code changes to the GitHub repository.
2. **GitHub Webhook** — A webhook triggers the Jenkins pipeline automatically.
3. **Jenkins Checkout** — Jenkins pulls the latest code from the repository.
4. **Install, Test & Lint** — Runs `npm ci`, `npm test`, and `npm run lint` inside a Docker container.
5. **Build Docker Image** — Jenkins builds a Docker image with Supabase environment variables injected at build time:
   - `VITE_SUPABASE_URL` — Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — Your Supabase anonymous/public key
6. **Push to Docker Hub** — The image is pushed with two tags:
   - `$DOCKERHUB_USER/randomly:$BUILD_NUMBER` — Versioned tag
   - `$DOCKERHUB_USER/randomly:latest` — Latest tag
7. **Manual Kubernetes Deployment** — Pull the image on Minikube and manually update the Deployment to use the new image tag.

---

## 📂 Repository Structure

```text
randomly/
├── .git/                   # Git repository data
├── .gitignore              # Ignores node_modules, dist, .env, etc.
├── .env                    # Local Supabase credentials (DO NOT COMMIT)
├── Dockerfile              # Multi-stage build: Node → nginx
├── Jenkinsfile             # Jenkins CI/CD pipeline definition
├── nginx.conf              # nginx configuration for SPA routing
├── .dockerignore           # Excludes unnecessary files from Docker build
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml     # Deployment with 2 replicas
│   └── service.yaml        # NodePort Service on port 30080
├── package.json            # npm dependencies and scripts
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest test runner configuration
├── tsconfig*.json          # TypeScript configuration
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── components/         # React components (Navigation, Card, ActivityGrid, etc.)
│   ├── lib/                # Business logic (useUserData, filters, storage, Supabase client)
│   ├── data/               # Activity data (mock activities, food categories)
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── App.css             # Global application styles
│   └── index.css           # Global CSS variables and base styles
├── dist/                   # Production build output (generated)
└── README.md               # This file
```

---

## 📋 Prerequisites

### For Local Development

- **Node.js** (v20 LTS or newer recommended)
- **npm** (comes with Node.js)
- **Git**
- A **Supabase** project (free tier works)

### For DevOps Workflow

- **Docker** (Desktop or Engine)
- **Jenkins** (configured with GitHub webhook)
- **Docker Hub** account
- **Minikube** (local Kubernetes)
- **kubectl** (Kubernetes CLI)

---

## 🖥️ Local Setup (Windows-Friendly)

### 1. Clone the Repository

```powershell
git clone https://github.com/Aarushi1607/randomly
cd randomly
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Supabase Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```powershell
# Edit .env file
notepad .env
```

Add the following (replace with your actual Supabase values):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Important:** The URL should be the base URL only (e.g., `https://abc123.supabase.co`) — do NOT include `/rest/v1/`.

> **Security:** The `.env` file is in `.gitignore` and must never be committed. Only the variable names are stored in the code.

### 4. Start the Development Server

```powershell
npm run dev
```

Open your browser to `http://localhost:5173/`.

### 5. Build for Production

```powershell
npm run build
```

The production build is generated in the `dist/` directory.

### 6. Run Tests

```powershell
npm test
```

This runs the Vitest test suite. All tests must pass.

### 7. Run Linter

```powershell
npm run lint
```

---

## 🐳 Docker Setup

### Build the Docker Image Locally

```powershell
# Build with Supabase environment variables
docker build `
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co `
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key `
  -t randomly:local .
```

### Run the Container

```powershell
docker run -d -p 8080:80 --name randomly-app randomly:local
```

Open `http://localhost:8080/` in your browser.

### Stop and Remove

```powershell
docker stop randomly-app
docker rm randomly-app
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### Pipeline Stages

1. **Checkout** — Pulls the latest code from GitHub.
2. **Install, Test and Lint** — Runs `npm ci`, `npm test`, and `npm run lint` inside a Node.js Docker container.
3. **Build and Push Docker Image** — Builds the Docker image with Supabase credentials injected, then pushes to Docker Hub with versioned and `latest` tags.

### GitHub Webhook Configuration

1. Go to your GitHub repository → **Settings** → **Webhooks**
2. Add a new webhook:
   - **Payload URL:** `https://your-jenkins-server/github-webhook/`
   - **Events:** Push events
3. Save the webhook.

### Jenkins Credentials (Configured in Jenkins)

| Credential ID | Type | Purpose |
|---------------|------|---------|
| `dockerhub-push` | Username/Password | Docker Hub authentication |
| `supabase-url` | Secret String | `VITE_SUPABASE_URL` for Docker build |
| `supabase-anon-key` | Secret String | `VITE_SUPABASE_ANON_KEY` for Docker build |

> **Never commit secrets** — all sensitive values are managed through Jenkins credentials.

---

## ☸️ Kubernetes Deployment (Minikube)

### Start Minikube

```powershell
minikube start
```

### Load the Docker Image

If you built the image locally:

```powershell
# Tag for Minikube's Docker daemon
docker tag randomly:local randomly:cca2

# Load into Minikube
minikube image load randomly:cca2
```

Or pull from Docker Hub:

```powershell
docker pull your-dockerhub-user/randomly:latest
minikube image load randomly:latest
```

### Apply Kubernetes Manifests

```powershell
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Check Deployment Status

```powershell
kubectl rollout status deployment/randomly-deployment
kubectl get pods
kubectl get services
```

### Update the Deployment (Manual Image Update)

When a new image is pushed to Docker Hub:

```powershell
# Edit the deployment to use the new image tag
kubectl set image deployment/randomly-deployment randomly=your-dockerhub-user/randomly:$BUILD_NUMBER

# Or edit manually
kubectl edit deployment randomly-deployment
```

### Check Rollout

```powershell
kubectl rollout status deployment/randomly-deployment
```

### Access the Application

```powershell
minikube service randomly-service
```

This opens the app in your browser at `http://<minikube-ip>:30080`.

> **Note:** If using Minikube's tunnel feature, keep the terminal open while accessing the service.

---

## 🔐 Environment Variables and Security

### Required Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Base URL of your Supabase project (e.g., `https://abc123.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key (from Settings → API) |

### Security Guidelines

1. **Never commit `.env`** — It is gitignored for a reason.
2. **Never expose the service-role key** — Only use the anonymous key in frontend code.
3. **Use Jenkins credentials** — Store secrets in Jenkins, not in code.
4. **Enable RLS** — Supabase Row Level Security should be enabled on all tables.
5. **Restrict API keys** — In Supabase, enable key restrictions for the anonymous key.

---

## 🧪 Testing and Troubleshooting

### Run Tests

```powershell
npm test
```

### Run Tests in Watch Mode

```powershell
npm run test:watch
```

### Run Tests with Coverage

```powershell
npm run test:coverage
```

### Build for Production

```powershell
npm run build
```

### Run Linter

```powershell
npm run lint
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Missing VITE_SUPABASE_URL" | Check your `.env` file. URL must NOT include `/rest/v1/`. |
| "Invalid path specified in request URL" | Supabase URL in `.env` should be `https://xxx.supabase.co` not `https://xxx.supabase.co/rest/v1/` |
| Blank/yellow screen on deploy | Ensure environment variables are set in Vercel or Docker build args. |
| Tests fail | Run `npm test` locally to diagnose. Check for recent code changes. |
| Kubernetes pod not starting | Check pod logs: `kubectl logs <pod-name>` |
| Minikube service not accessible | Run `minikube service randomly-service` — keep the terminal open. |

---

## ⚠️ Current Limitations

- **Manual Kubernetes Deployment:** Jenkins automatically builds and pushes Docker images to Docker Hub, but the Kubernetes deployment to Minikube must be done manually (`kubectl set image`).
- **Local-Only History:** Activity history is stored in localStorage and is not synced to the cloud. Each device maintains its own history.
- **No Admin Panel:** There is no admin interface for managing activities.

---

## 🚀 Future Improvements

- **Auto-Deploy to Kubernetes:** Automate the Kubernetes image update as part of the Jenkins pipeline.
- **Cloud History Sync:** Store activity history in Supabase to sync across devices.
- **Activity Suggestions:** Add a suggestion button allowing users to submit new activity ideas. Suggestions would be visible only to an admin for review — approved suggestions get added to the activity collection.

---

## 🤝 Contributing

Contributions, ideas, and bug reports are welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests where appropriate.
4. Run the test suite: `npm test`
5. Run the linter: `npm run lint`
6. Build: `npm run build`
7. Submit a pull request.

---

## 👥 Team

**Randomly** is a collaborative project built as a college CCA 2 DevOps assignment by a two-person team.

---

## 📄 License

No license has been specified yet. Add a `LICENSE` file and update this section once decided.

---

*Randomly — because life is more fun when you try something new.* 🎲