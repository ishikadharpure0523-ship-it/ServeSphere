const fs = require('fs');
const path = require('path');

const dirs = [
  'src/pages/auth',
  'src/pages/dashboard'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const files = [
  'src/pages/ForNGOs.jsx',
  'src/pages/ForVolunteers.jsx',
  'src/pages/ForDonors.jsx',
  'src/pages/About.jsx',
  'src/pages/auth/SignIn.jsx',
  'src/pages/auth/VolunteerStep1.jsx',
  'src/pages/auth/VolunteerStep2.jsx',
  'src/pages/auth/DonorStep1.jsx',
  'src/pages/auth/DonorStep2.jsx',
  'src/pages/auth/NGOStep1.jsx',
  'src/pages/auth/NGOStep2.jsx',
  'src/pages/dashboard/VolunteerDashboard.jsx',
  'src/pages/dashboard/DonorDashboard.jsx',
  'src/pages/dashboard/NGODashboard.jsx'
];

files.forEach(file => {
  const compName = path.basename(file, '.jsx');
  const code = `import React from 'react';\n\nexport default function ${compName}() {\n  return <div className="p-8"><h1 className="text-2xl font-serif">${compName}</h1></div>;\n}\n`;
  fs.writeFileSync(path.join(__dirname, file), code);
});

console.log('Stubs created successfully');
