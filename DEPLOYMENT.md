# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - Click "Deploy"
   - Done! Your app will be live in ~2 minutes

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
# Your app will be deployed automatically
```

## 📹 Recording Demo Video (30-45 seconds)

### Recommended Flow:

1. **Start with empty canvas** (2-3 sec)
   - Show clean interface

2. **Add 3 agents** (5-7 sec)
   - Click LLM Agent
   - Click Tool Agent  
   - Click Memory
   - Arrange them vertically

3. **Connect agents** (5-7 sec)
   - Drag from LLM → Tool
   - Drag from Tool → Memory
   - Show smooth connection animation

4. **Configure one agent** (5-7 sec)
   - Click on LLM Agent
   - Show properties panel slide in
   - Type a sample prompt
   - Click Save

5. **Step execution** (8-10 sec)
   - Click "Step" button 3 times
   - Show each agent lighting up
   - Show memory updating
   - Show logs appearing

6. **Full run** (5-7 sec)
   - Click "Reset"
   - Click "Run"
   - Show automatic execution with progress bar

7. **Export** (2-3 sec)
   - Click "Export JSON"
   - Show download notification

### Recording Tools:

- **Mac**: QuickTime (Cmd+Shift+5)
- **Windows**: Xbox Game Bar (Win+G)
- **Cross-platform**: OBS Studio (free)
- **Screen recording**: Loom, ScreenFlow

### Tips:

- Record in 1920x1080 for best quality
- Use cursor highlight tool
- No audio needed (or add simple music)
- Export as MP4 (H.264)
- Keep under 45 seconds

## 🎨 Customization

### Change Color Scheme

Edit `src/utils/mockExecution.ts`:

```typescript
export const getAgentTypeColor = (type: AgentType): string => {
  switch (type) {
    case 'llm':
      return 'from-pink-500 to-pink-600'; // Change here
    // ...
  }
};
```

### Change Agent Icons

Edit `src/components/AgentNode.tsx`:

```typescript
import { Star, Zap, Cloud } from 'lucide-react'; // Import new icons

const getIcon = (type: AgentType) => {
  switch (type) {
    case 'llm':
      return Star; // Change here
    // ...
  }
};
```

## 🐛 Troubleshooting

### Build fails

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styles not loading

Check that `index.css` imports are correct in `main.tsx`

### ReactFlow not showing

Make sure `ReactFlowProvider` wraps the Canvas component

## 📊 Performance Tips

- Workflow works best with 10-20 agents
- For large workflows (50+ agents), consider pagination
- Use MiniMap for navigation in large workflows

## 🎯 Demo Checklist

Before recording:

- [ ] Clear all agents (start fresh)
- [ ] Test all buttons work
- [ ] Check animations are smooth
- [ ] Verify Export JSON works
- [ ] Test on target resolution
- [ ] Close unnecessary browser tabs
- [ ] Hide bookmarks bar (Cmd+Shift+B)
- [ ] Use Incognito mode (clean browser)

## 📝 Video Script Example

```
0:00 - Show empty canvas
0:03 - Add LLM Agent
0:05 - Add Tool Agent
0:07 - Add Memory
0:10 - Connect LLM → Tool
0:13 - Connect Tool → Memory
0:16 - Click LLM Agent
0:18 - Edit prompt "Analyze user input"
0:22 - Click Save
0:24 - Click Step (3x with pauses)
0:32 - Click Reset
0:34 - Click Run (auto execution)
0:40 - Click Export JSON
0:43 - End
```

## 🎬 Post-Production

Recommended edits:
- Add fade in/out (0.5s)
- Add text overlay with app name at start
- Add subtle music (optional)
- Add call-to-action at end

Free music sources:
- YouTube Audio Library
- Bensound.com
- Incompetech.com

## 🚀 Going Live

1. Deploy to Vercel ✅
2. Record demo video ✅
3. Upload video to YouTube/Vimeo
4. Share Vercel URL with client
5. Include video link in delivery

## 📧 Delivery Checklist

Send to client:

- [ ] Vercel live URL
- [ ] GitHub repository link
- [ ] Demo video link
- [ ] README.md
- [ ] This deployment guide
- [ ] Source code ZIP

## 🎉 Done!

Your beautiful, production-ready Agent Workflow Builder is ready to impress! 🔥
