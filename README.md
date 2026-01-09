# 🎬 Movie Manager

A modern, beautifully animated movie discovery and wishlist management application built with React, TypeScript, and Framer Motion. Featuring glassmorphism design and smooth animations inspired by React Bits.

## ✨ Features

### 🎥 Movie Discovery

- **Browse Movies**: Explore movies by categories (Popular, Now Playing, Top Rated, Upcoming)
- **Search**: Real-time search functionality to find any movie
- **Pagination**: Navigate through thousands of movies with smooth page transitions
- **Movie Details**: View comprehensive information including synopsis, cast, ratings, and similar movies

### 💝 Wishlist Management

- **Add to Wishlist**: Save your favorite movies for later
- **Remove from Wishlist**: Easily manage your saved movies
- **Search Wishlist**: Filter through your saved movies
- **Persistent Storage**: Your wishlist is saved in localStorage and persists across sessions
- **Real-time Counter**: See the number of movies in your wishlist in the navigation bar

### 🎨 Design Features

- **Glassmorphism UI**: Modern frosted glass aesthetic with backdrop blur effects
- **Smooth Animations**: Professional animations powered by Framer Motion
- **Gradient Backgrounds**: Dynamic animated gradient orbs
- **Shimmer Buttons**: Eye-catching buttons with shimmer effects
- **Hover Interactions**: Interactive cards with zoom and glow effects
- **Responsive Design**: Fully responsive layout for all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v24 or higher recommended)
- npm or yarn package manager
- TMDB API Key (free from [The Movie Database](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd movie-manager
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
VITE_MOVIE_API_KEY=your_tmdb_api_key_here
```

4. **Start the development server**

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router 7** - Client-side routing
- **TMDB API** - Movie data and images

## 📁 Project Structure

```
movie-manager/
├── src/
│   ├── components/
│   │   ├── animated/          # Reusable animated components
│   │   │   ├── AnimatedText.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ShimmerButton.tsx
│   │   │   └── GradientBackground.tsx
│   │   ├── MovieList.tsx      # Movie browsing page
│   │   ├── MovieDetails.tsx   # Movie details page
│   │   ├── Wishlist.tsx       # Wishlist page
│   │   └── Navbar.tsx         # Navigation component
│   ├── context/
│   │   └── WishlistProvider.tsx # Wishlist state management
│   ├── routes.ts              # Route definitions
│   ├── App.tsx                # Main app component
│   └── main.tsx               # App entry point
├── .env                       # Environment variables
└── package.json
```

## 🎯 Key Features Explained

### Wishlist Functionality

- Add movies to your personal wishlist from any page
- Wishlist data persists using localStorage
- Real-time counter badge in the navigation
- Search and filter your saved movies
- Remove movies with a single click

### Animation System

- **Page transitions**: Smooth fade and slide effects
- **Card animations**: Staggered entrance animations
- **Hover effects**: Scale, glow, and shimmer interactions
- **Loading states**: Custom animated spinners
- **Background**: Continuously animated gradient orbs

### Responsive Design

- Mobile-first approach
- Adaptive grid layouts (2-5 columns based on screen size)
- Touch-friendly interactions
- Optimized for all device sizes

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie API
- [React Bits](https://www.reactbits.dev/) for design inspiration
- [Framer Motion](https://www.framer.com/motion/) for animations
