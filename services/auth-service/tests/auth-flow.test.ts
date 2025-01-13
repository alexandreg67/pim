import axios from 'axios';

const API_URL = 'http://localhost:8000';
const TEST_USER = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  startDate: new Date().toISOString(),
};

async function testAuthFlow() {
  try {
    console.info('🚀 Starting auth flow test...\n');

    // 1. Register user
    console.info('1. Testing user registration...');
    const registerResponse = await axios.post(
      `${API_URL}/auth/register`,
      TEST_USER
    );
    console.info('✅ User registered successfully:', registerResponse.data);
    console.info('\nCheck mail service logs for Ethereal preview URL');

    // Pause to check mail service logs
    console.info('\nPress Enter after noting down the temporary password...');
    const tempPassword = await new Promise<string>((resolve) => {
      process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });

    // 2. Try login
    console.info('\n2. Testing login with temporary password...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: tempPassword,
    });

    console.info('✅ Login successful:', loginResponse.data);

    // Vérifier la présence du cookie
    const authCookie = loginResponse.headers['set-cookie']?.[0];
    if (!authCookie) {
      throw new Error('No authentication cookie received');
    }

    // 3. Get current user profile
    console.info('\n3. Testing profile fetch...');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Cookie: authCookie },
    });
    console.info('✅ Profile fetched:', profileResponse.data);

    console.info('\n✨ All tests passed successfully!');
  } catch (error) {
    if (error) {
      console.error('\n❌ Test failed:', error);
    } else if (error instanceof Error) {
      console.error('\n❌ Test failed:', error);
    } else {
      console.error('\n❌ Test failed:', error);
    }
    process.exit(1);
  }
}

testAuthFlow();
