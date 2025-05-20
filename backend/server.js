const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MemoryStore = require('memorystore')(session);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const deliveryRoutes = require('./routes/delivery');
const productRoutes = require('./routes/products');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'coex-pharmacy-secret',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Make upload middleware available globally
app.locals.upload = upload;

// Serve static assets from frontend build if it exists
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
const frontendPath = path.join(__dirname, '../frontend');
const indexPath = fs.existsSync(path.join(frontendBuildPath, 'index.html')) 
  ? path.join(frontendBuildPath, 'index.html')
  : path.join(frontendPath, 'index.html');

// Serve build directory first (production build)
app.use(express.static(frontendBuildPath));

// Fallback to serving from frontend directory (for development)
app.use(express.static(frontendPath));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', require('./routes/notifications'));

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`COEx backend server running on port ${PORT}`);
});

module.exports = app;
