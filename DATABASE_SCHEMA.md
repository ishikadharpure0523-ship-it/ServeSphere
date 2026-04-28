# ServeSphere Database Schema

## Collections

### users
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,
  role: 'volunteer' | 'donor' | 'ngo',
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Common fields
  name: string,
  phone: string,
  city: string,
  state: string,
  profileImage: string,     // Storage URL
  
  // Volunteer specific
  skills: string[],
  bio: string,
  availability: string,
  trustScore: number,
  level: number,
  badges: string[],
  totalHours: number,
  tasksCompleted: number,
  
  // Donor specific
  donationTotal: number,
  donationCount: number,
  
  // NGO specific
  organizationName: string,
  registrationNumber: string,
  foundedYear: number,
  website: string,
  description: string,
  causes: string[],
  verificationStatus: 'pending' | 'verified' | 'rejected',
  verificationDocuments: string[],
  trustScore: number,
  sdgs: number[],
}
```

### opportunities
```javascript
{
  id: string,
  ngoId: string,
  ngoName: string,
  title: string,
  description: string,
  cause: string,
  location: string,
  city: string,
  state: string,
  duration: string,
  timeCommitment: string,
  skillsRequired: string[],
  volunteersNeeded: number,
  volunteersApplied: number,
  status: 'open' | 'closed' | 'completed',
  certificateAvailable: boolean,
  sdgs: number[],
  startDate: timestamp,
  endDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### applications
```javascript
{
  id: string,
  opportunityId: string,
  volunteerId: string,
  volunteerName: string,
  ngoId: string,
  ngoName: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed',
  appliedAt: timestamp,
  respondedAt: timestamp,
  completedAt: timestamp,
  hoursContributed: number,
  feedback: {
    rating: number,
    comment: string,
    givenAt: timestamp,
  },
}
```

### certificates
```javascript
{
  id: string,
  code: string,             // Unique certificate code
  volunteerId: string,
  volunteerName: string,
  ngoId: string,
  ngoName: string,
  opportunityId: string,
  taskName: string,
  hoursContributed: number,
  issuedAt: timestamp,
  verificationUrl: string,
}
```

### fundRequests
```javascript
{
  id: string,
  ngoId: string,
  ngoName: string,
  title: string,
  description: string,
  cause: string,
  targetAmount: number,
  raisedAmount: number,
  currency: 'INR',
  status: 'active' | 'completed' | 'cancelled',
  sdgs: number[],
  startDate: timestamp,
  endDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Transparency
  milestones: [{
    title: string,
    description: string,
    amount: number,
    status: 'pending' | 'completed',
    completedAt: timestamp,
    proofDocuments: string[],
  }],
}
```

### donations
```javascript
{
  id: string,
  donorId: string,
  donorName: string,
  ngoId: string,
  ngoName: string,
  fundRequestId: string,
  amount: number,
  currency: 'INR',
  paymentId: string,        // Razorpay/Stripe payment ID
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  donatedAt: timestamp,
  
  // Transparency tracking
  utilizationProof: [{
    description: string,
    amount: number,
    documents: string[],     // Bills, photos
    uploadedAt: timestamp,
  }],
}
```

### notifications
```javascript
{
  id: string,
  userId: string,
  type: 'application_status' | 'new_opportunity' | 'donation_update' | 'message',
  title: string,
  message: string,
  read: boolean,
  actionUrl: string,
  createdAt: timestamp,
}
```

### messages
```javascript
{
  id: string,
  conversationId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  receiverId: string,
  message: string,
  attachments: string[],
  read: boolean,
  sentAt: timestamp,
}
```

## Storage Structure

```
/users/{uid}/
  - profile-image.jpg
  - documents/
    - verification-doc-1.pdf
    - verification-doc-2.pdf

/ngos/{ngoId}/
  - logo.png
  - verification/
    - registration-certificate.pdf
    - tax-exemption.pdf
  - projects/{projectId}/
    - photos/
    - bills/
    - reports/

/certificates/{certificateId}/
  - certificate.pdf

/donations/{donationId}/
  - proof/
    - receipt.pdf
    - utilization-photo-1.jpg
```

## Indexes

### users
- email
- role
- city + role
- trustScore (descending)

### opportunities
- ngoId
- status
- city + status
- cause + status
- createdAt (descending)

### applications
- volunteerId + status
- ngoId + status
- opportunityId

### fundRequests
- ngoId
- status
- endDate

### donations
- donorId
- ngoId
- fundRequestId
- donatedAt (descending)

### notifications
- userId + read
- createdAt (descending)
