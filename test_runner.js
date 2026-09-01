/**
 * Test Runner for CRM-to-Telephony Lead Routing Middleware
 *
 * Runs automated integration tests against the live Webhook endpoint.
 */

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://hook.eu1.make.com/24rceje4juhqj9w6cjdeq73em37nmm2l';

async function sendLead(testName, payload) {
  console.log(`\n========================================`);
  console.log(`▶ Running: ${testName}`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`Status Code: ${response.status} ${response.statusText}`);
    console.log(`Response Body: ${responseText}`);
    console.log(`✔ Webhook delivery completed.`);
  } catch (error) {
    console.error(`✖ Test failed:`, error.message);
  }
}

async function runAllTests() {
  console.log(`Target Middleware Webhook: ${WEBHOOK_URL}`);
  
  // Test 1: Happy Path
  await sendLead('Test 1: Happy Path - New Inbound Lead', {
    name: 'Alex Smith',
    email: 'alex.smith@example.com',
    phone: '+918618952370',
    source: 'Google Ads Landing Page'
  });

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  // Test 2: Idempotency (Duplicate Submission)
  await sendLead('Test 2: Idempotency Check - Duplicate Submission for Same Email', {
    name: 'Alex Smith Updated',
    email: 'alex.smith@example.com',
    phone: '+918618952370',
    source: 'Website Return Visit'
  });

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  // Test 3: Error Branch (Missing Required Email/Contact info)
  await sendLead('Test 3: Fault-Tolerance Check - Missing Email / Malformed Lead', {
    source: 'Unverified Third-Party Bot'
  });

  console.log(`\n========================================`);
  console.log(`🎉 All tests dispatched! Check your Zoho CRM, Telegram, and Data Store.`);
}

runAllTests();
