#!/usr/bin/env node

/**
 * API Test Script for Duolingo JP Backend
 * Tests all major endpoints to verify functionality
 */

const BASE_URL = 'http://localhost:5195';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function testEndpoint(method, path, body = null, headers = {}) {
  const fullUrl = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, options);
    const data = await response.json().catch(() => response.text());
    return {
      success: response.ok,
      status: response.statusCode || response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function runTests() {
  log(colors.cyan, '🧪 Starting API Tests...\n');

  let token = null;
  let userId = null;

  // Test 1: Register
  log(colors.blue, '📝 Test 1: User Registration');
  const registerRes = await testEndpoint('POST', '/api/account/register', {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test@12345',
  });

  if (registerRes.success && registerRes.data?.token) {
    log(colors.green, '✅ Registration successful');
    log(colors.cyan, `Response fields:`, Object.keys(registerRes.data).join(', '));
    token = registerRes.data.token;
    userId = registerRes.data.userId;
    console.log(`\nUser Data:`);
    console.log(registerRes.data);
  } else {
    log(colors.red, '❌ Registration failed:', registerRes.error || registerRes.data);
  }

  // Test 2: Login
  log(colors.blue, '\n🔐 Test 2: User Login');
  const loginRes = await testEndpoint('POST', '/api/account/login', {
    username: 'test123',
    password: 'Test@12345',
  });

  if (loginRes.success && loginRes.data?.token) {
    log(colors.green, '✅ Login successful');
    log(colors.cyan, `Response fields:`, Object.keys(loginRes.data).join(', '));
    token = loginRes.data.token;
    userId = loginRes.data.userId;
    console.log(`\nLogin Response:`);
    console.log(loginRes.data);
  } else {
    log(colors.red, '❌ Login failed:', loginRes.error || loginRes.data);
  }

  // Test 3: Get Profile
  if (token) {
    log(colors.blue, '\n👤 Test 3: Get User Profile');
    const profileRes = await testEndpoint('GET', '/api/profile/display', null, {
      Authorization: `Bearer ${token}`,
    });

    if (profileRes.success) {
      log(colors.green, '✅ Profile fetched successfully');
      console.log('\nProfile Data:');
      console.log(profileRes.data);
    } else {
      log(colors.red, '❌ Profile fetch failed:', profileRes.error || profileRes.data);
    }
  }

  // Test 4: Get Learning Path
  if (token) {
    log(colors.blue, '\n📚 Test 4: Get Learning Path');
    const pathRes = await testEndpoint('GET', '/api/learning-path/japanese-path', null, {
      Authorization: `Bearer ${token}`,
    });

    if (pathRes.success) {
      log(colors.green, '✅ Learning path fetched successfully');
      console.log(`\nLessons Count: ${Array.isArray(pathRes.data) ? pathRes.data.length : 'N/A'}`);
      if (Array.isArray(pathRes.data) && pathRes.data.length > 0) {
        console.log('First lesson:', pathRes.data[0]);
      }
    } else {
      log(colors.red, '❌ Learning path fetch failed:', pathRes.error || pathRes.data);
    }
  }

  // Test 5: Get Leaderboard
  if (token) {
    log(colors.blue, '\n🏆 Test 5: Get Leaderboard');
    const leaderboardRes = await testEndpoint('GET', '/api/leaderboard', null, {
      Authorization: `Bearer ${token}`,
    });

    if (leaderboardRes.success) {
      log(colors.green, '✅ Leaderboard fetched successfully');
      console.log(`\nLeaderboard entries: ${Array.isArray(leaderboardRes.data) ? leaderboardRes.data.length : 'N/A'}`);
    } else {
      log(colors.red, '❌ Leaderboard fetch failed:', leaderboardRes.error || leaderboardRes.data);
    }
  }

  // Test 6: Get Shop Items
  log(colors.blue, '\n🛍️  Test 6: Get Shop Items');
  const shopRes = await testEndpoint('GET', '/api/shop/items');

  if (shopRes.success) {
    log(colors.green, '✅ Shop items fetched successfully');
    console.log(`\nShop items count: ${Array.isArray(shopRes.data) ? shopRes.data.length : 'N/A'}`);
  } else {
    log(colors.red, '❌ Shop fetch failed:', shopRes.error || shopRes.data);
  }

  // Test 7: Get Alphabets
  log(colors.blue, '\n🔤 Test 7: Get Hiragana Alphabets');
  const hiraganaRes = await testEndpoint('GET', '/api/alphabets/hiragana');

  if (hiraganaRes.success) {
    log(colors.green, '✅ Hiragana fetched successfully');
    console.log(`\nHiragana count: ${Array.isArray(hiraganaRes.data) ? hiraganaRes.data.length : 'N/A'}`);
  } else {
    log(colors.red, '❌ Hiragana fetch failed:', hiraganaRes.error || hiraganaRes.data);
  }

  log(colors.cyan, '\n✅ API Tests Complete!\n');
}

// Run tests
runTests().catch((error) => {
  log(colors.red, '❌ Test suite error:', error);
  process.exit(1);
});
