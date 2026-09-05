const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.openweathermap.org"]
        }
    }
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1y',
    etag: true
}));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check for Heroku
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        app: 'Kilimo Smart',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API routes (for future expansion)
app.get('/api/status', (req, res) => {
    res.json({
        app: 'Kilimo Smart',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(PORT, () => {
    console.log(`🌾 Kilimo Smart running on port ${PORT}`);
    console.log(`📱 Visit: http://localhost:${PORT}`);
});
