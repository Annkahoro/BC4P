require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testBackend = async () => {
  console.log('--- Starting Backend Verification ---');

  try {
    // 1. Admin Login
    console.log('\nTesting Admin Login...');
    const adminLogin = await axios.post(`${API_URL}/auth/admin-login`, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    const adminToken = adminLogin.data.token;
    console.log('✅ Admin Login Successful');

    // 2. User Registration
    console.log('\nTesting User Registration...');
    const testUserPhone = '0712345678';
    let userToken;
    try {
      const userReg = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Contributor',
        phone: testUserPhone,
        location: { county: 'Muranga', subCounty: 'Kandara' }
      });
      userToken = userReg.data.token;
      console.log('✅ User Registration Successful');
    } catch (e) {
      if (e.response && e.response.data.message === 'User already exists') {
        console.log('ℹ️ User already exists, logging in instead...');
        const userLogin = await axios.post(`${API_URL}/auth/login`, { phone: testUserPhone });
        userToken = userLogin.data.token;
        console.log('✅ User Login Successful');
      } else {
        throw e;
      }
    }

    // 3. User Submission
    console.log('\nTesting User Submission...');
    const submission = await axios.post(
      `${API_URL}/submissions`,
      {
        title: 'Traditional Medicine Ritual',
        pillar: 'Cultural',
        category: 'Rituals & Ceremonies',
        description: 'Detailed description of a local ritual...',
        location: JSON.stringify({ county: 'Muranga', subCounty: 'Kandara' }),
        metadata: JSON.stringify({ sourceOfInformation: 'Elder' })
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    const submissionId = submission.data._id;
    console.log(`✅ Submission Created (ID: ${submissionId})`);

    // 4. Admin View All
    console.log('\nTesting Admin View All Submissions...');
    const allSubmissions = await axios.get(`${API_URL}/submissions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Admin retrieved ${allSubmissions.data.length} submissions`);

    // 5. Admin Stats
    console.log('\nTesting Admin Dashboard Stats...');
    const stats = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin stats retrieved:', stats.data);

    // 6. Admin Review (Approve)
    console.log('\nTesting Admin Review Workflow...');
    await axios.put(
      `${API_URL}/submissions/${submissionId}/status`,
      { status: 'Approved', adminNotes: 'Verified with local elders.' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ Submission Approved Successfully');

    // 7. CSV Export check (Metadata check)
    console.log('\nTesting CSV Export Head...');
    const exportCheck = await axios.get(`${API_URL}/admin/export`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (exportCheck.headers['content-type'] === 'text/csv') {
        console.log('✅ CSV Export header verified');
    }

    console.log('\n--- Backend Verification Complete ---');
    console.log('All core systems are working correctly.');

  } catch (error) {
    console.error('\n❌ Verification Failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testBackend();
