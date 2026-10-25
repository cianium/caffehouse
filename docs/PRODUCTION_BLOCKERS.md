# BODRIN — production blockers and security notes

**Status: DEMO ONLY.** Based on current public source; no end-to-end production security assessment has been completed.

## Critical: administrative authentication

`src/context/AdminAuthContext.tsx` checks that a password is at least six characters rather than verifying a stored credential on a server. OTP is generated and checked in the browser, and login state is recorded in `localStorage`. `src/pages/AdminLoginPage.tsx` contains example credentials and displays a simulated OTP.

**Impact:** browser-side checks cannot authorize protected admin actions. Any production server API must independently authenticate sessions, authorize roles and enforce permissions.

## Critical: checkout simulation

The repository README previously described a banking gateway simulation. A simulated checkout is **not** a real payment provider integration or authorization. Never ask real customers to enter bank card credentials into a fake bank page.

## Minimum production acceptance

- Server-managed identities with protected sessions, password/OTP verification and rate limits
- No hardcoded demo credentials in published applications
- Server-side product prices, inventory, order records and idempotent payment verification
- No collection of full card numbers/PIN/CVV in the app; redirect to a genuine trusted gateway
- CSRF and access-control tests, secure secret storage, audit logs and backup strategy
- Privacy notice, data retention and deletion process
- Automated tests and successful staging integration evidence

Until these conditions are met, label this project **interactive storefront demo** only.
