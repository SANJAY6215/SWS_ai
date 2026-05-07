# SWS AI - Document Management Dashboard

A high-performance, real-time Document Management System built for the SWS AI Technical Assessment. This application handles bulk PDF uploads, background processing notifications, and a persistent notification center.

## 🚀 Key Features

- **Real-time File Uploads**: Individual progress tracking for every file using Socket.io and Multer.
- **Smart Bulk Handling**: 
  - Up to 3 files: Inline detailed progress.
  - More than 3 files: Automated background processing state with smart notifications.
- **Persistent Notification Center**: Header-integrated badge with unread counts and historical alerts stored in MongoDB.
- **Premium Design System**: Built with the **Livvic** font, following a sleek white and blue enterprise theme.
- **Responsive Workspace**: Clean, glassmorphic UI with smooth Framer Motion transitions.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io, Multer.
- **Database**: MongoDB (Mongoose) for metadata and notification persistence.
- **Real-time**: WebSocket (Socket.io) for instant notifications.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017/sws-ai`)

### Installation

1. **Clone and Setup Backend**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sws-ai
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🏗️ Architecture Note
The system uses a **Service-Oriented approach**. The backend emits events via Socket.io during the upload lifecycle. When bulk uploads (>3 files) occur, the server processes them in a background-ready state and notifies the frontend once the entire batch is persisted.

## 📜 License
Technical Assessment Prototype - 2025 SWS AI.
