const admin = require('firebase-admin');
const fs = require('fs');

const loadServiceAccount = () => {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH points to a missing file');
    }

    return require(serviceAccountPath);
  }

  const requiredEnv = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ];

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(
        `Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_PATH or ${requiredEnv.join(', ')}`
      );
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
};

const serviceAccount = loadServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
