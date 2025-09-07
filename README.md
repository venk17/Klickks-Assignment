# Login & Logout Flow - Full Stack Authentication App

A complete authentication system built with React.js (frontend) and Node.js + Express + SQLite (backend), featuring user registration, login, session management, and protected routes.

## Features

### Backend Features
- **SQLite Database**: Automatic database creation with users table
- **Password Security**: bcrypt hashing for secure password storage
- **Session Management**: express-session with secure cookie handling
- **User Registration**: Email validation and duplicate prevention
- **Authentication API**: RESTful endpoints for all auth operations
- **CORS Support**: Configured for frontend communication

### Frontend Features
- **React Components**: Modular login, register, and dashboard components
- **Form Validation**: Client-side validation with error handling
- **Session Persistence**: Automatic authentication state management
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Loading States**: User feedback during API operations
- **Protected Routes**: Dashboard accessible only when authenticated

## Project Structure

```
project-root/
├── backend/
│   ├── server.js          # Express server setup
│   ├── db.js             # SQLite database configuration
│   ├── routes/
│   │   └── auth.js       # Authentication routes
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── main.jsx      # React app entry point
│   │   ├── App.jsx       # Main app component
│   │   └── components/
│   │       ├── Login.jsx     # Login form component
│   │       ├── Register.jsx  # Registration form component
│   │       └── Dashboard.jsx # Protected dashboard component
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies
└── README.md            # This file
```

## API Endpoints

- `POST /api/register` - Create new user account
- `POST /api/login` - Authenticate user and create session
- `GET /api/dashboard` - Get dashboard data (protected)
- `POST /api/logout` - Destroy session and logout
- `GET /api/check-auth` - Check current authentication status

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend server will run on `http://localhost:5000`
   
   **Note**: The SQLite database (`users.db`) will be created automatically on first run.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

### Access the Application
Open your browser and go to `http://localhost:3000` to use the application.

## Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access protected content after authentication
4. **Logout**: Clear session and return to login page

## Security Features

- Passwords are hashed using bcrypt
- Sessions are stored securely with httpOnly cookies
- CORS is configured to allow only frontend origin
- Input validation on both client and server
- SQL injection protection with parameterized queries

## Database Schema

The SQLite database contains a `users` table with the following structure:

| Column     | Type    | Description                    |
|------------|---------|--------------------------------|
| id         | INTEGER | Primary key (auto-increment)  |
| email      | TEXT    | User email (unique)            |
| password   | TEXT    | Hashed password                |
| created_at | DATETIME| Account creation timestamp     |

## Development Notes

- The frontend uses Vite for fast development and building
- Backend uses ES modules (type: "module" in package.json)
- Tailwind CSS is loaded via CDN for styling
- Sessions expire after 24 hours
- CORS is enabled for `http://localhost:3000` only

## Production Considerations

Before deploying to production:

1. Change the session secret in `backend/server.js`
2. Set `cookie.secure: true` for HTTPS
3. Configure proper CORS origins
4. Set up environment variables for configuration
5. Use a production database (PostgreSQL, MySQL)
6. Add rate limiting and additional security headers
7. Implement proper logging and error handling

## Troubleshooting

### Common Issues
- **Backend won't start**: Make sure Node.js is installed and run `npm install`
- **Frontend can't connect**: Ensure backend is running on port 5000
- **Database errors**: Delete `users.db` and restart backend to recreate
- **Session issues**: Clear browser cookies and try again

### Development Tips
- Use browser dev tools to monitor network requests
- Check backend console for server logs
- SQLite database file is created in the backend directory
- Sessions persist until browser is closed or logout is called