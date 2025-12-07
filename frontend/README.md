# InsightSphere AI - Frontend

Premium React + TypeScript frontend with stunning animations and glassmorphism design.

## Features

- ✨ **Beautiful UI**: Glassmorphism effects, gradient accents, smooth animations
- 🎨 **Premium Design**: Professional SaaS-level aesthetics
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Optimized with Vite and React 18
- 🎭 **Smooth Animations**: Framer Motion for delightful interactions
- 📊 **Data Visualization**: Interactive charts with Recharts
- 🎯 **Type-Safe**: Full TypeScript coverage

## Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Create production build
npm run preview      # Preview production build locally

# Testing
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Analysis/          # Analysis-specific components
│   │   │   ├── EmotionChart.tsx
│   │   │   └── ResultSummary.tsx
│   │   ├── Layout/            # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── UI/                # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ProgressBar.tsx
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Analyze.tsx
│   │   ├── Insights.tsx
│   │   └── About.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useAnalysis.ts
│   ├── utils/                 # Utility functions
│   │   ├── api.ts
│   │   ├── localStorage.ts
│   │   └── types.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies
```

## Design System

### Colors

- **Primary**: Cyan (#22d3ee) - Main accent color
- **Secondary**: Purple (#8b5cf6) - Secondary accent
- **Accent**: Pink (#ec4899) - Tertiary accent
- **Dark**: Navy (#050816) - Background
- **Dark Lighter**: (#0f172a) - Card backgrounds

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Regular weight, good contrast

### Components

All components follow these principles:
- Glassmorphism effects (translucent backgrounds with blur)
- Smooth animations with Framer Motion
- Responsive design with Tailwind breakpoints
- Accessible with ARIA labels and keyboard navigation

## Key Features

### Home Page
- Hero section with animated dashboard preview
- Feature cards with hover effects
- How it works section
- Safety and ethics information
- Animated background gradients

### Analyze Page
- Large textarea with character counter
- Real-time validation
- Loading states with spinner
- Beautiful results display
- Emotion charts and stress gauge
- Personalized suggestions

### Insights Page
- Session history with filters
- Stress trend line chart
- Emotion frequency bar chart
- Statistics cards
- Empty state for no data

### About Page
- Vision and mission
- How the technology works
- Important disclaimers
- Tech stack showcase
- Academic project information

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment

The built files can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for routes
- Optimized bundle size
- Fast initial load
- Smooth 60fps animations

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader friendly
- Sufficient color contrast
- Focus indicators

## Troubleshooting

### Port Already in Use

If port 5173 is in use:

```bash
npm run dev -- --port 3000
```

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues

Make sure:
1. Backend is running on port 8000
2. CORS is configured correctly
3. `.env` file has correct API URL

## License

This project is for educational purposes.
