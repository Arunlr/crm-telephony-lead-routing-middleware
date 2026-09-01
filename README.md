# CRM-to-Telephony Lead Routing Middleware

A production-grade, zero-cost cloud middleware service connecting inbound webhook channels, CRM platforms (Zoho CRM), telephony messaging (Twilio), audit data stores, and real-time team notifications (Telegram) with built-in **idempotency** and **dead-letter error handling**.

---

## 📌 Business Problem & Overview

When new client inquiries arrive from multiple digital channels (web forms, landing pages, paid campaigns), sales teams often lose momentum and leads go cold if the CRM, telephony provider, and internal notification channels are not seamlessly unified. 

This middleware acts as the central integration layer that:
1. Captures inbound leads instantly with zero latency.
2. Deduplicates incoming leads against existing CRM records.
3. Maintains an immutable audit trail for compliance and replay.
4. Triggers instant push notifications to sales reps and automated SMS confirmations to customers.
5. Traps and logs upstream API failures to prevent lead loss.

---

## 🏗 Architecture & Data Flow

```
                     [ Inbound REST Webhook ]
                                │
                                ▼
             [ Zoho CRM: Idempotent Lead Upsert ] ──────────► [ On-Error Directive Branch ]
               • Key: Email (Prevents Duplication)                      │
                                │ (Success Path)                        ▼
                                ▼                              [ Data Store Audit Log ]
                     [ Data Store Audit Log ]                    • Status: "failed"
                       • Status: "success"                       • Error Trace: Captured
                       • Zoho Lead ID: Saved                            │
                                │                                       ▼
                                ▼                              [ Telegram Incident Alert ]
                     [ Telegram Instant Alert ]                  • 🚨 Real-time Ops Alert
                       • 🎯 Sales Team Lead Card
                                │
                                ▼
                     [ Twilio SMS Dispatch ]
                       • 📱 Automated Customer SMS
```

---

## 🚀 Key Technical Highlights

* **Idempotent Ingestion & Deduplication:** Avoids duplicate contact entries in Zoho CRM by enforcing upsert constraints on primary email attributes (`duplicate_check_fields: ["Email"]`).
* **Zero-Loss Error Routing:** Dedicated error branch (`onerror`) intercepts network timeouts, schema validation mismatches, and third-party rate limits, logging full error traces for debugging.
* **Persistent Event Audit Logging:** Every transaction (both successes and failures) is recorded in a managed cloud Data Store (`Lead_Event_Log`) with timestamps, request payloads, and CRM record identifiers.
* **Multi-Channel Dispatch:** Real-time markdown notification cards delivered to Telegram and automated outbound SMS dispatched via Twilio.
* **Zero Infrastructure Cost:** Architected entirely on serverless cloud tiers (Make.com, Zoho CRM Developer, Twilio Free Trial, Telegram Bot API) without requiring paid servers or domain names.

---

## 📁 Repository Structure

```
├── blueprint.json          # Complete Make.com Scenario Blueprint (JSON)
├── test_runner.js          # Cross-platform Node.js integration test runner
├── test_payloads.sh        # Bash cURL test vectors
├── package.json            # Project definition & test scripts
└── README.md               # Architecture documentation & system guide
```

---

## 🧪 Testing & Verification

### 1. Run Automated Test Suite (Node.js)
```bash
node test_runner.js
```

### 2. Manual Test via cURL
```bash
curl -X POST https://hook.eu1.make.com/24rceje4juhqj9w6cjdeq73em37nmm2l \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "phone": "+918618952370",
    "source": "Website Demo Form"
  }'
```

### 3. Verification Checklist:
* **Zoho CRM:** Lead appears under **Leads** module.
* **Make Data Store:** Row created in `Lead_Event_Log` with status `success`.
* **Telegram:** Notification received in chat via `@Kaiser_47bot`.
* **Twilio:** Outbound SMS delivered to recipient phone.

---

## 💼 Resume Bullet & Recruiter Talking Points

### Resume Bullet:
> **"Architected and deployed a cloud middleware service integrating CRM and telephony webhooks, featuring idempotent duplicate elimination, structured event audit logging, and automated Telegram incident alerting — reducing lead response time to under 1 minute."**

### Key Interview Discussion Points:
1. **Handling Webhook Retries & Idempotency:**
   > *"Inbound webhooks frequently experience network retries. By enforcing an upsert policy on unique email identifiers, our middleware guarantees that retried requests update existing records rather than polluting the CRM with duplicates."*
2. **Resilience & Dead-Letter Handling:**
   > *"When external APIs experience intermittent downtime, standard webhooks fail silently. Our architecture catches errors at the CRM layer, preserves the raw payload with error traces in our audit store, and alerts operations in real time."*
3. **Decoupled Architecture:**
   > *"The middleware unifies independent systems (Web forms, CRM, Messaging, and Telephony) while maintaining clean separation of concerns and auditability."*
