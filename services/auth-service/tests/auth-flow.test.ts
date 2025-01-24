import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';

interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  startDate: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
  };
  message?: string;
}

// Interface pour les erreurs API
interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

interface ApiError {
  response?: {
    data: ApiErrorResponse;
    status: number;
  };
  message: string;
}

const TEST_USER: TestUser = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  startDate: new Date().toISOString(),
};

async function testAuthFlow(): Promise<void> {
  let authCookie: string;
  let temporaryPassword: string;
  const NEW_PASSWORD = 'NewSecurePass123!';

  try {
    console.info('🚀 Starting complete auth flow test...\n');

    // 1. Register user
    console.info('1. Testing user registration...');
    const registerResponse = await axios.post<AuthResponse>(
      `${API_URL}/register`,
      TEST_USER
    );
    console.info('✅ User registered successfully:', registerResponse.data);
    console.info('\nCheck mail service logs for Ethereal preview URL');

    // Attendre le mot de passe temporaire
    console.info('\nPress Enter after noting down the temporary password...');
    temporaryPassword = await new Promise<string>((resolve) => {
      process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });

    // 2. Login with temporary password
    console.info('\n2. Testing login with temporary password...');
    const loginResponse = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      {
        email: TEST_USER.email,
        password: temporaryPassword,
      }
    );

    authCookie = loginResponse.headers['set-cookie']?.[0];
    if (!authCookie) {
      throw new Error('No authentication cookie received');
    }
    console.info('✅ Login successful');

    // 3. Get current user profile
    console.info('\n3. Testing profile fetch...');
    const profileResponse = await axios.get<AuthResponse>(
      `${API_URL}/auth/me`,
      {
        headers: { Cookie: authCookie },
      }
    );
    console.info('✅ Profile fetched:', profileResponse.data);

    // 4. Change password
    console.info('\n4. Testing password change...');
    await axios.put(
      `${API_URL}/auth/change-password`,
      {
        currentPassword: temporaryPassword,
        newPassword: NEW_PASSWORD,
      },
      {
        headers: { Cookie: authCookie },
      }
    );
    console.info('✅ Password changed successfully');

    // 5. Login with new password
    console.info('\n5. Testing login with new password...');
    await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: NEW_PASSWORD,
    });
    console.info('✅ Login with new password successful');

    // 6. Logout
    console.info('\n6. Testing logout...');
    const logoutResponse = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: { Cookie: authCookie },
      }
    );
    console.info('✅ Logout successful:', logoutResponse.data);

    // 7. Verify that protected route is inaccessible after logout
    console.info('\n7. Verifying protected route access after logout...');
    try {
      await axios.get(`${API_URL}/auth/me`, {
        headers: { Cookie: authCookie },
      });
      throw new Error('Protected route should not be accessible after logout');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        console.info('✅ Protected route properly secured after logout');
      } else {
        throw error;
      }
    }

    console.info('\n✨ All tests passed successfully!');
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.data) {
      console.error('\n❌ Test failed:', {
        message: apiError.response.data.message,
        statusCode: apiError.response.status,
        error: apiError.response.data.error,
      });
    } else if (error instanceof Error) {
      console.error('\n❌ Test failed:', error.message);
    } else {
      console.error('\n❌ Test failed:', 'Unknown error occurred');
    }
    process.exit(1);
  }
}

testAuthFlow();
