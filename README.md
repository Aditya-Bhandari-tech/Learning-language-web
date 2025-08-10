# LinguaLearn - MERN Stack Language Learning Platform

A comprehensive language learning website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- **Interactive Flashcards** - Learn vocabulary with flip animations
- **Quiz System** - Multiple choice questions with immediate feedback  
- **Progress Tracking** - Visual dashboards and analytics
- **Vocabulary Management** - Search, filter, and organize words
- **User Authentication** - Secure login and registration
- **Multiple Languages** - Support for various language courses
- **Gamification** - Points, badges, and achievement system
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Project Structure

```
language-learning-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-specific pages
│   │   ├── contexts/       # State management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- React.js with Hooks
- Context API for state management
- React Router for navigation
- CSS3 with modern features
- Responsive design

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API design

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd language-learning-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/languagelearning
   JWT_SECRET=your-secret-key
   ```

5. **Start the application**
   
   **Server (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Client (Terminal 2):**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons` - Create new lesson (admin)

### Vocabulary
- `GET /api/vocabulary` - Get vocabulary words
- `POST /api/vocabulary` - Add new word
- `PUT /api/vocabulary/:id` - Update word
- `DELETE /api/vocabulary/:id` - Delete word

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress
- `GET /api/progress/stats` - Get progress statistics

## 🎮 Usage

1. **Register/Login** - Create an account or sign in
2. **Choose Language** - Select from available language courses
3. **Study Vocabulary** - Use flashcards to learn new words
4. **Take Quizzes** - Test your knowledge with interactive quizzes
5. **Track Progress** - Monitor your learning journey
6. **Earn Achievements** - Unlock badges and rewards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by modern language learning platforms
- Built following MERN stack best practices
- Icons and images from various open source projects
