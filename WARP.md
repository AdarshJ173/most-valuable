# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Common Commands
```bash
# Development
npm run dev                    # Start Next.js dev server (port 3000)
npx convex dev                # Start Convex backend dev server
npm run build                 # Build for production
npm run start                 # Start production server
npm run lint                  # Run ESLint

# Database & Backend
npx convex deploy             # Deploy Convex functions to production
npx convex docs              # Launch Convex documentation
npx convex logs              # View Convex function logs
npx convex auth              # Authenticate with Convex
```

### Raffle Management Scripts
```bash
# Setup/configure raffle
node scripts/setup-raffle.js                    # Initialize new raffle configuration
node scripts/setup-gold-rush.js                # Setup specific Gold Rush raffle
node scripts/update-raffle-dates.js            # Modify raffle timing
node scripts/update-pricing.js                 # Change entry pricing

# Entry management
node scripts/check-entries.js                  # Verify entry counts
node scripts/sync-raffle-totals.js            # Fix entry count sync issues
node scripts/test-payment-flow.js             # Test Stripe integration

# Winner selection (Admin only - requires ADMIN_TOKEN)
node scripts/init-raffle-timer.js             # Initialize timer system
```

### Testing & Debugging
```bash
# Payment testing (uses Stripe test mode)
node scripts/test-payment-flow.js             # End-to-end payment test

# Database checks
node scripts/check-raffle-config.js           # Verify raffle configuration
node scripts/direct-fix.js                    # Emergency database fixes
```

## High-Level Architecture

### Tech Stack Overview
This is a **Next.js 15 + Convex + Stripe raffle system** with the following architecture:

**Frontend (Next.js 15)**
- **App Router** with TypeScript and Tailwind CSS
- **Real-time UI** via Convex reactive queries
- **Client Components** for interactive features (countdown timer, forms)
- **Static Generation** for performance optimization

**Backend (Convex Database + Serverless Functions)**
- **Reactive Database** with real-time subscriptions
- **Serverless Functions** (queries, mutations, actions)
- **Node.js Actions** for cryptographic operations (winner selection)
- **Schema-first** database design with TypeScript safety

**Payment Processing (Stripe Integration)**
- **Checkout Sessions** for secure payment processing
- **Webhook Handlers** for payment confirmation
- **Live Mode** configured for production

### Core System Components

#### 1. Raffle Entry System
The system implements a **multi-entry raffle** where users can purchase raffle tickets:

- **Lead Collection**: Email capture on landing page (free raffle entry)
- **Paid Entries**: Stripe checkout for additional entries ($50 each, $100/4-entry bundle)
- **Entry Tracking**: Each entry creates database records linked to payments
- **Real-time Stats**: Live updating of participant counts and revenue

#### 2. Payment Flow Architecture
```
Landing Page → Email Collection → Shop Page → Stripe Checkout → Webhook Processing → Database Entry Creation
```

**Critical Flow**: Payment confirmation via Stripe webhooks is **essential** - entries are only valid after webhook confirms payment.

#### 3. Winner Selection System
**Cryptographically Secure** winner selection using Node.js `crypto.randomInt()`:

- **Entry Bag Creation**: Each paid entry gets `count` number of tickets in the pool
- **Provably Fair**: Uses cryptographic randomness, not pseudo-random
- **Audit Trail**: Complete logging of selection process with timestamps
- **Multiple Winners**: Supports selecting multiple winners (configurable)

#### 4. Admin Security System
**Multi-layer security** for admin access:

- **Token-based Authentication**: Secure admin token validation
- **Session Management**: IP tracking with expiration
- **Brute Force Protection**: Account lockout after failed attempts
- **Complete Audit Logging**: All admin actions tracked

### Database Schema Overview

**Core Tables**:
- **`leads`**: Email collection with unique constraints
- **`entries`**: Paid raffle entries with Stripe references
- **`raffleConfig`**: Active raffle configuration and settings
- **`raffleWinners`**: Winner selection with complete audit trail
- **`paymentEvents`**: Stripe webhook processing logs

**Security Tables**:
- **`adminSessions`**: Secure admin session management
- **`adminSecurity`**: Login attempt tracking and fraud detection
- **`errorLogs`**: System error monitoring and debugging

### File Structure & Key Components

```
├── src/app/                   # Next.js App Router pages
│   ├── page.tsx              # Landing page with email capture
│   ├── shop/page.tsx         # Product showcase with Stripe integration
│   └── admin/                # Admin dashboard (secure access)
├── src/components/           # Reusable React components
│   ├── RaffleCountdownTimer.tsx  # Real-time countdown component
│   └── ConvexClientProvider.tsx  # Convex React integration
├── convex/                   # Backend functions and schema
│   ├── schema.ts             # Database schema definitions
│   ├── entries.ts            # Raffle entry management
│   ├── entriesNode.ts        # Winner selection (Node.js crypto)
│   ├── payments.ts           # Payment processing logic
│   ├── stripeActions.ts      # Stripe integration actions
│   └── adminAuth.ts          # Admin authentication system
├── scripts/                  # Management and utility scripts
│   ├── setup-raffle.js       # Raffle configuration setup
│   ├── check-entries.js      # Entry validation and debugging
│   └── test-payment-flow.js  # Payment system testing
└── public/                   # Static assets and product media
```

### Environment Configuration

**Required Environment Variables**:
```bash
# Convex Database
NEXT_PUBLIC_CONVEX_URL        # Convex deployment URL
CONVEX_DEPLOY_KEY            # For deploying functions

# Stripe Payment Processing
STRIPE_SECRET_KEY            # Live Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Live Stripe publishable key
STRIPE_WEBHOOK_SECRET        # Webhook signature verification

# Admin Security
ADMIN_TOKEN                  # Secure token for admin operations

# Raffle Configuration
NEXT_PUBLIC_RAFFLE_START_DATE # ISO 8601 raffle start date
NEXT_PUBLIC_SITE_URL         # Production domain URL
```

### Security Considerations

**Payment Security**: All card data handled by Stripe (PCI compliant). No sensitive payment information stored locally.

**Admin Security**: Military-grade security with IP tracking, session management, and brute force protection.

**Data Integrity**: Cryptographic winner selection with complete audit trails. Unique constraints prevent duplicate entries.

**Fraud Prevention**: IP address tracking, duplicate webhook prevention, and suspicious activity monitoring.

### Real-time Features

The system leverages **Convex's reactive queries** for real-time updates:

- **Countdown Timer**: Updates every second across all connected clients
- **Entry Counts**: Live participant and revenue statistics  
- **Admin Dashboard**: Real-time order notifications and system monitoring
- **Payment Status**: Immediate UI updates on successful payments

### Production Deployment Notes

**Critical Production Requirements**:
1. **Stripe Webhook Configuration**: Must configure webhook endpoint in Stripe dashboard
2. **Live Environment Variables**: All production keys must be set
3. **Domain Configuration**: HTTPS required for Stripe integration
4. **Database Initialization**: Admin dashboard provides database setup tools

**Monitoring**: Admin dashboard provides comprehensive system monitoring including payment success rates, error logs, and security event tracking.

This system is designed for **high-stakes raffle operations** with enterprise-level security, complete audit trails, and provably fair winner selection suitable for valuable prizes (gold-backed merchandise).
