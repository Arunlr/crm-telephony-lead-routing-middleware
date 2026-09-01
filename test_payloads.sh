#!/bin/bash

WEBHOOK_URL="https://hook.eu1.make.com/24rceje4juhqj9w6cjdeq73em37nmm2l"

echo "========================================"
echo "1. Testing Happy Path (New Inbound Lead)"
echo "========================================"
curl -i -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "phone": "+918618952370",
    "source": "Website Contact Form"
  }'

echo -e "\n\nSleeping 3 seconds...\n"
sleep 3

echo "========================================"
echo "2. Testing Idempotency (Duplicate Email)"
echo "========================================"
curl -i -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "phone": "+918618952370",
    "source": "Chat Widget"
  }'

echo -e "\n\nSleeping 3 seconds...\n"
sleep 3

echo "========================================"
echo "3. Testing Error Fallback (Malformed)"
echo "========================================"
curl -i -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Broken Inbound Stream"
  }'

echo -e "\n\nDone."
