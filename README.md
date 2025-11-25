# Mokua Farm Management System

A comprehensive farm management system built for the Mokua family to manage crops, livestock, tasks, sales, and more.

## Features

- **Task Assignment** - Assign tasks to family members (Patrick 👨‍🌾, Carolyne 👩‍🌾, Fadhili 👦, Michael 👦)
- **Sales Management** - Track revenue, manage buyers, view analytics
- **Farm Calendar** - Unified view of all farm events
- **Smart Notifications** - Real-time alerts for tasks and activities
- **Photo Documentation** - Upload and manage farm photos
- **Enhanced Dashboard** - Quick stats, charts, and activity feed
- **Global Search** - Press Cmd/Ctrl+K to search everything
- **Mobile PWA** - Installable as a mobile app
- **Weather Integration** - Current conditions and forecasts

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Recharts

**Backend:**
- Node.js
- Express
- Firebase Firestore
- Firebase Storage

## Getting Started

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## Environment Variables

**Backend (.env):**
```
JWT_SECRET=your_secret
OPENWEATHER_API_KEY=your_key
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
# (add all Firebase config)
```

## Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Deployment

1. Push to GitHub
2. Deploy backend to Railway/Render
3. Deploy frontend to Vercel
4. Configure environment variables

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## License

Private - Mokua Family Farm

---

Built with ❤️ for the Mokua family
