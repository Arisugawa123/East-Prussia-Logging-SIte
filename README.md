# East Prussia Regiment - React Application

A React application built with Vite for the East Prussia Regiment website.

## Features

- Modern React 19 with Vite
- Tailwind CSS for styling
- React Icons
- Responsive design
- Multiple components for personnel management

## Development

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment

### Quick Deployment to Vercel

1. **Run the setup script:**
   ```bash
   setup_git_and_deploy.bat
   ```
   This will:
   - Initialize Git repository
   - Add all files to Git
   - Commit initial version
   - Add GitHub remote
   - Push to GitHub

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import the `EAST-PRUSSIA-REGIMENT` repository
   - Vercel will auto-detect the Vite configuration
   - Click "Deploy"

### Manual Git Setup

If you prefer manual setup:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Arisugawa123/EAST-PRUSSIA-REGIMENT.git
git branch -M main
git push -u origin main
```

## Project Structure

```
src/
├── App.jsx              # Main application component
├── Dashboard.jsx        # Dashboard component
├── HallOfHiCom.jsx     # Hall of High Command
├── InactivityNotice.jsx # Inactivity notices
├── LowRankLogging.jsx   # Low rank personnel logging
├── NCOLogging.jsx       # NCO logging
├── OfficerLogging.jsx   # Officer logging
├── Personnels.jsx       # Personnel management
├── RetiredPersonnel.jsx # Retired personnel
└── assets/             # Static assets

public/
├── images/             # Public images
└── modal.js           # Modal functionality
```

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- React Icons
- ESLint for code quality
