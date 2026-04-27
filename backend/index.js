const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { auth, db } = require('./firebaseAdmin');

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ServeSphere backend' });
});

app.get('/api/me', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      profile: userDoc.exists ? userDoc.data() : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load user profile' });
  }
});

app.post('/api/profile', verifyToken, async (req, res) => {
  try {
    const { role, ...profileData } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'role is required' });
    }

    const payload = {
      role,
      email: req.user.email,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(req.user.uid).set(payload, { merge: true });

    return res.json({ success: true, profile: payload });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save profile' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
