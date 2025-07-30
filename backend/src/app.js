require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route files
const parents = require('./routes/parents');
const students = require('./routes/students');
const classes = require('./routes/classes');
const subscriptions = require('./routes/subscriptions');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Teenup API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/parents', parents);
app.use('/api/students', students);
app.use('/api/classes', classes);
app.use('/api/subscriptions', subscriptions);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Teenup Student Management API',
        version: '1.0.0',
        endpoints: {
            parents: '/api/parents',
            students: '/api/students',
            classes: '/api/classes',
            subscriptions: '/api/subscriptions',
            health: '/health'
        }
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app; 