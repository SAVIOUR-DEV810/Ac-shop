require('dotenv').config();

const fs = require('fs');
const path = require('path');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('Warning: CLIENT_ID or CLIENT_SECRET not set in environment.');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initializeDatabase } = require('./src/db');
const { verifyAccessToken } = require('./src/utils/jwt');
const authRoutes = require('./src/routes/auth');
const paymentsRoutes = require('./src/routes/payments');
const adsRoutes = require('./src/routes/ads');
const callsRoutes = require('./src/routes/calls');
const enrollmentRoutes = require('./src/routes/enrollments');
const ceoRoutes = require('./src/routes/ceo');
const davidRoutes = require('./src/routes/david');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'http://127.0.0.1:3000', 'https:'],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"]
    }
  }
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const ceoPages = new Set([
  '/ceo-data.html',
  '/ceo-ads.html',
  '/ceo-enrollments.html',
  '/ceo-people.html'
]);

app.use((req, res, next) => {
  if (!ceoPages.has(req.path)) return next();

  const cookies = req.headers.cookie || '';
  const sessionCookie = cookies
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('ceoSession='));
  const token = sessionCookie ? decodeURIComponent(sessionCookie.slice('ceoSession='.length)) : '';

  try {
    const payload = verifyAccessToken(token);
    if (payload.role !== 'ceo') throw new Error('Not a CEO session');
    return next();
  } catch (error) {
    return res.redirect(`/link.html?next=${encodeURIComponent(req.path)}`);
  }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'website.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AC Shop backend is running.' });
});

app.get('/download/:fileName', (req, res) => {
  const allowedFiles = [
    'ac-shop-desktop.zip',
    'ac-shop-mac.dmg',
    'ac-shop-android.apk',
    'ac-shop-ios.ipa'
  ];

  const requested = req.params.fileName;
  if (!allowedFiles.includes(requested)) {
    return res.status(404).json({
      status: 'error',
      message: 'Download file not found.'
    });
  }

  const downloadPath = path.join(__dirname, 'downloads', requested);
  if (!fs.existsSync(downloadPath)) {
    return res.status(404).json({
      status: 'error',
      message: 'The selected package is not available yet.'
    });
  }

  const contentTypeMap = {
    'ac-shop-desktop.zip': 'application/zip',
    'ac-shop-mac.dmg': 'application/octet-stream',
    'ac-shop-android.apk': 'application/vnd.android.package-archive',
    'ac-shop-ios.ipa': 'application/octet-stream'
  };

  res.setHeader('Content-Type', contentTypeMap[requested] || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${requested}"`);
  return res.sendFile(downloadPath);
});

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/ceo', ceoRoutes);
app.use('/api/david', davidRoutes);

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`AC Shop backend listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = app;
