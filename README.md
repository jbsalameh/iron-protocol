[README.md](https://github.com/user-attachments/files/25766156/README.md)
# Iron Protocol 🏋️

AI-powered gym training companion — track workouts, get AI coaching, monitor nutrition, and progress photos.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — just click **Deploy**
5. Done! Your app is live at `your-project.vercel.app`

## Install as Phone App

Once deployed, open the URL on your phone:

**iPhone (Safari):**
- Tap the **Share** button (square with arrow)
- Scroll down and tap **Add to Home Screen**
- Tap **Add**

**Android (Chrome):**
- Tap the **⋮** menu
- Tap **Add to Home Screen** or **Install app**

The app will open fullscreen like a native app.

## Local Development

```bash
npm install
npm run dev
```

## Data Storage

The app uses `localStorage` — your data lives on your device in the browser. It persists across restarts but can be lost if you clear browser data. See the README section on data safety below.

## Data Safety Tips

- **Don't clear Safari/Chrome data** — this deletes localStorage
- **Adding to Home Screen** makes the data more persistent on iOS
- **Private/Incognito mode** will lose data when closed
