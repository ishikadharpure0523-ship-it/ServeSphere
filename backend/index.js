const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { auth, db, admin } = require('./firebaseAdmin');

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

// Middleware
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

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ServeSphere backend' });
});

// ============ USER ROUTES ============

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
      uid: req.user.uid,
      role,
      email: req.user.email,
      ...profileData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Set createdAt only on first creation
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
      payload.trustScore = 0;
      payload.level = 1;
      
      if (role === 'volunteer') {
        payload.badges = [];
        payload.totalHours = 0;
        payload.tasksCompleted = 0;
      } else if (role === 'donor') {
        payload.donationTotal = 0;
        payload.donationCount = 0;
      } else if (role === 'ngo') {
        payload.verificationStatus = 'pending';
        payload.trustScore = 0;
      }
    }

    await db.collection('users').doc(req.user.uid).set(payload, { merge: true });

    return res.json({ success: true, profile: payload });
  } catch (error) {
    console.error('Profile save error:', error);
    return res.status(500).json({ message: 'Failed to save profile' });
  }
});

app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(req.user.uid).update(updates);

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    return res.json({ success: true, profile: userDoc.data() });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ============ OPPORTUNITY ROUTES ============

app.get('/api/opportunities', async (req, res) => {
  try {
    const { cause, city, status = 'open', limit = 20 } = req.query;
    
    // Simplified query without orderBy to avoid index requirement
    let query = db.collection('opportunities');
    
    // Only filter by status if provided
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Get all matching documents
    const snapshot = await query.limit(parseInt(limit) * 2).get();
    
    // Filter in memory to avoid composite index requirement
    let opportunities = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      let matches = true;
      
      if (cause && cause !== 'All' && data.cause !== cause) {
        matches = false;
      }
      
      if (city && data.city !== city) {
        matches = false;
      }
      
      if (matches) {
        opportunities.push({ id: doc.id, ...data });
      }
    });
    
    // Sort in memory
    opportunities.sort((a, b) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime;
    });
    
    // Limit results
    opportunities = opportunities.slice(0, parseInt(limit));
    
    res.json({ opportunities });
  } catch (error) {
    console.error('Fetch opportunities error:', error);
    res.status(500).json({ message: 'Failed to fetch opportunities' });
  }
});

app.get('/api/opportunities/:id', async (req, res) => {
  try {
    const doc = await db.collection('opportunities').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch opportunity' });
  }
});

app.post('/api/opportunities', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can create opportunities' });
    }
    
    const opportunity = {
      ...req.body,
      ngoId: req.user.uid,
      ngoName: userDoc.data().organizationName || userDoc.data().name,
      volunteersApplied: 0,
      status: 'open',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('opportunities').add(opportunity);
    
    res.json({ success: true, id: docRef.id, opportunity });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ message: 'Failed to create opportunity' });
  }
});

app.put('/api/opportunities/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('opportunities').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    if (doc.data().ngoId !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await db.collection('opportunities').doc(req.params.id).update(updates);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update opportunity' });
  }
});

// ============ APPLICATION ROUTES ============

app.get('/api/applications', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const role = userDoc.data()?.role;
    
    let query;
    if (role === 'volunteer') {
      query = db.collection('applications').where('volunteerId', '==', req.user.uid);
    } else if (role === 'ngo') {
      query = db.collection('applications').where('ngoId', '==', req.user.uid);
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }
    
    // Remove orderBy to avoid index requirement
    const snapshot = await query.get();
    
    let applications = [];
    snapshot.forEach(doc => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in memory
    applications.sort((a, b) => {
      const aTime = a.appliedAt?._seconds || 0;
      const bTime = b.appliedAt?._seconds || 0;
      return bTime - aTime;
    });
    
    res.json({ applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', verifyToken, async (req, res) => {
  try {
    const { opportunityId, message } = req.body;
    
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can apply' });
    }
    
    const oppDoc = await db.collection('opportunities').doc(opportunityId).get();
    if (!oppDoc.exists) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    // Check if already applied
    const existingApp = await db.collection('applications')
      .where('volunteerId', '==', req.user.uid)
      .where('opportunityId', '==', opportunityId)
      .get();
    
    if (!existingApp.empty) {
      return res.status(400).json({ message: 'Already applied to this opportunity' });
    }
    
    const application = {
      opportunityId,
      volunteerId: req.user.uid,
      volunteerName: userDoc.data().name,
      ngoId: oppDoc.data().ngoId,
      ngoName: oppDoc.data().ngoName,
      status: 'pending',
      message: message || '',
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('applications').add(application);
    
    // Update opportunity volunteers count
    await db.collection('opportunities').doc(opportunityId).update({
      volunteersApplied: admin.firestore.FieldValue.increment(1),
    });
    
    // Create notification for NGO
    await db.collection('notifications').add({
      userId: oppDoc.data().ngoId,
      type: 'new_application',
      title: 'New Volunteer Application',
      message: `${userDoc.data().name} applied for ${oppDoc.data().title}`,
      read: false,
      actionUrl: `/applications/${docRef.id}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    res.json({ success: true, id: docRef.id, application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Failed to create application' });
  }
});

app.put('/api/applications/:id', verifyToken, async (req, res) => {
  try {
    const { status, feedback, hoursContributed } = req.body;
    
    const doc = await db.collection('applications').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const application = doc.data();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userRole = userDoc.data()?.role;
    
    // NGO can update status
    if (userRole === 'ngo' && application.ngoId === req.user.uid) {
      const updates = {
        status,
        respondedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      if (status === 'completed' && hoursContributed) {
        updates.hoursContributed = hoursContributed;
        updates.completedAt = admin.firestore.FieldValue.serverTimestamp();
        
        // Update volunteer stats
        await db.collection('users').doc(application.volunteerId).update({
          totalHours: admin.firestore.FieldValue.increment(hoursContributed),
          tasksCompleted: admin.firestore.FieldValue.increment(1),
        });
        
        // Generate certificate
        const certificateCode = `SS-${new Date().getFullYear()}-${application.volunteerId.substring(0, 6).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
        
        await db.collection('certificates').add({
          code: certificateCode,
          volunteerId: application.volunteerId,
          volunteerName: application.volunteerName,
          ngoId: application.ngoId,
          ngoName: application.ngoName,
          opportunityId: application.opportunityId,
          taskName: (await db.collection('opportunities').doc(application.opportunityId).get()).data().title,
          hoursContributed,
          issuedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      
      if (feedback) {
        updates.feedback = {
          ...feedback,
          givenAt: admin.firestore.FieldValue.serverTimestamp(),
        };
      }
      
      await db.collection('applications').doc(req.params.id).update(updates);
      
      // Notify volunteer
      await db.collection('notifications').add({
        userId: application.volunteerId,
        type: 'application_status',
        title: 'Application Update',
        message: `Your application for ${application.ngoName} has been ${status}`,
        read: false,
        actionUrl: `/applications/${req.params.id}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return res.json({ success: true });
    }
    
    return res.status(403).json({ message: 'Not authorized' });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

// ============ CERTIFICATE ROUTES ============

app.get('/api/certificates', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('certificates')
      .where('volunteerId', '==', req.user.uid)
      .get();
    
    let certificates = [];
    snapshot.forEach(doc => {
      certificates.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in memory
    certificates.sort((a, b) => {
      const aTime = a.issuedAt?._seconds || 0;
      const bTime = b.issuedAt?._seconds || 0;
      return bTime - aTime;
    });
    
    res.json({ certificates });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

app.get('/api/certificates/:code/verify', async (req, res) => {
  try {
    const snapshot = await db.collection('certificates')
      .where('code', '==', req.params.code)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Certificate not found', valid: false });
    }
    
    const cert = snapshot.docs[0].data();
    res.json({ valid: true, certificate: cert });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

// ============ FUND REQUEST ROUTES ============

app.get('/api/fund-requests', async (req, res) => {
  try {
    const { status = 'active', ngoId, limit = 20 } = req.query;
    
    let query = db.collection('fundRequests');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (ngoId) {
      query = query.where('ngoId', '==', ngoId);
    }
    
    const snapshot = await query.limit(parseInt(limit) * 2).get();
    
    let fundRequests = [];
    snapshot.forEach(doc => {
      fundRequests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in memory
    fundRequests.sort((a, b) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime;
    });
    
    fundRequests = fundRequests.slice(0, parseInt(limit));
    
    res.json({ fundRequests });
  } catch (error) {
    console.error('Fetch fund requests error:', error);
    res.status(500).json({ message: 'Failed to fetch fund requests' });
  }
});

app.post('/api/fund-requests', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can create fund requests' });
    }
    
    const fundRequest = {
      ...req.body,
      ngoId: req.user.uid,
      ngoName: userDoc.data().organizationName || userDoc.data().name,
      raisedAmount: 0,
      currency: 'INR',
      status: 'active',
      milestones: req.body.milestones || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('fundRequests').add(fundRequest);
    
    res.json({ success: true, id: docRef.id, fundRequest });
  } catch (error) {
    console.error('Create fund request error:', error);
    res.status(500).json({ message: 'Failed to create fund request' });
  }
});

// ============ DONATION ROUTES ============

app.get('/api/donations', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const role = userDoc.data()?.role;
    
    console.log(`[Donations GET] User: ${req.user.uid}, Role: ${role}`);
    
    let query;
    if (role === 'donor') {
      query = db.collection('donations').where('donorId', '==', req.user.uid);
    } else if (role === 'ngo') {
      query = db.collection('donations').where('ngoId', '==', req.user.uid);
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }
    
    const snapshot = await query.get();
    
    let donations = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert Firestore timestamps to ISO strings
      const donation = {
        id: doc.id,
        ...data,
        donatedAt: data.donatedAt?.toDate?.()?.toISOString() || data.donatedAt,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
      donations.push(donation);
    });
    
    // Sort by createdAt descending
    donations.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
    
    console.log(`[Donations GET] Found ${donations.length} donations`);
    
    res.json({ donations });
  } catch (error) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

app.post('/api/donations', verifyToken, async (req, res) => {
  try {
    const { fundRequestId, amount } = req.body;
    
    console.log(`[Donations POST] User: ${req.user.uid}, FundRequest: ${fundRequestId}, Amount: ${amount}`);
    
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can make donations' });
    }
    
    const fundDoc = await db.collection('fundRequests').doc(fundRequestId).get();
    if (!fundDoc.exists) {
      console.log(`[Donations POST] Fund request not found: ${fundRequestId}`);
      return res.status(404).json({ message: 'Fund request not found' });
    }
    
    const donation = {
      donorId: req.user.uid,
      donorName: userDoc.data().name,
      ngoId: fundDoc.data().ngoId,
      ngoName: fundDoc.data().ngoName,
      fundRequestId,
      fundRequestTitle: fundDoc.data().title,
      amount,
      currency: 'INR',
      paymentStatus: 'pending', // Manual verification needed
      utilizationProof: [],
      donatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('donations').add(donation);
    console.log(`[Donations POST] Created donation: ${docRef.id}`);
    
    // Update fund request raised amount
    await db.collection('fundRequests').doc(fundRequestId).update({
      raisedAmount: admin.firestore.FieldValue.increment(amount),
    });
    
    // Update donor stats
    await db.collection('users').doc(req.user.uid).update({
      donationTotal: admin.firestore.FieldValue.increment(amount),
      donationCount: admin.firestore.FieldValue.increment(1),
    });
    
    // Notify NGO
    await db.collection('notifications').add({
      userId: fundDoc.data().ngoId,
      type: 'new_donation',
      title: 'New Donation Pledge',
      message: `${userDoc.data().name} pledged ₹${amount.toLocaleString('en-IN')}`,
      read: false,
      actionUrl: `/donations/${docRef.id}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`[Donations POST] Success - donation created and stats updated`);
    
    res.json({ success: true, id: docRef.id, donation });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Failed to create donation' });
  }
});

// ============ NOTIFICATION ROUTES ============

app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .limit(50)
      .get();
    
    let notifications = [];
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in memory
    notifications.sort((a, b) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime;
    });
    
    res.json({ notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({
      read: true,
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});

app.put('/api/notifications/mark-all-read', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
});

// ============ STATS ROUTES ============

app.get('/api/stats/volunteer', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'volunteer') {
      return res.status(403).json({ message: 'Not a volunteer' });
    }
    
    const user = userDoc.data();
    
    const certificatesSnapshot = await db.collection('certificates')
      .where('volunteerId', '==', req.user.uid)
      .get();
    
    res.json({
      tasksCompleted: user.tasksCompleted || 0,
      totalHours: user.totalHours || 0,
      trustScore: user.trustScore || 0,
      certificates: certificatesSnapshot.size,
      level: user.level || 1,
      badges: user.badges || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

app.get('/api/stats/ngo', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'ngo') {
      return res.status(403).json({ message: 'Not an NGO' });
    }
    
    const opportunitiesSnapshot = await db.collection('opportunities')
      .where('ngoId', '==', req.user.uid)
      .get();
    
    const applicationsSnapshot = await db.collection('applications')
      .where('ngoId', '==', req.user.uid)
      .get();
    
    const donationsSnapshot = await db.collection('donations')
      .where('ngoId', '==', req.user.uid)
      .get();
    
    let totalDonations = 0;
    donationsSnapshot.forEach(doc => {
      totalDonations += doc.data().amount || 0;
    });
    
    res.json({
      opportunities: opportunitiesSnapshot.size,
      applications: applicationsSnapshot.size,
      volunteers: new Set(applicationsSnapshot.docs.map(d => d.data().volunteerId)).size,
      totalDonations,
      trustScore: userDoc.data().trustScore || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

app.get('/api/stats/donor', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'donor') {
      return res.status(403).json({ message: 'Not a donor' });
    }
    
    const user = userDoc.data();
    
    const donationsSnapshot = await db.collection('donations')
      .where('donorId', '==', req.user.uid)
      .get();
    
    const ngosSupported = new Set();
    donationsSnapshot.forEach(doc => {
      ngosSupported.add(doc.data().ngoId);
    });
    
    res.json({
      totalDonated: user.donationTotal || 0,
      donationCount: user.donationCount || 0,
      ngosSupported: ngosSupported.size,
      impactScore: Math.floor((user.donationTotal || 0) / 1000),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
