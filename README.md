# Equipment Rental Platform — Client

## Project Overview
Equipment Rental Platform is a web-based application that allows customers to rent equipment online and owners to manage their rental products. Administrators can monitor users, equipment, bookings, and payments through an admin dashboard.

## Live Website
https://equipment-rental-platform-client-three.vercel.app/

## Technology Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- JWT Authentication

## Key Features
- User registration and login
- Role-based dashboards for Customer, Owner, and Admin
- Responsive homepage and equipment browsing
- Equipment details and rental information
- Equipment management for owners
- Admin equipment management and approval
- Booking management
- Payment history dashboard
- Protected dashboard routes
- API integration with the backend

## Installation

Clone the repository:

```bash
git clone https://github.com/ivyakterlotamoni/equipment-rental-platform-client.git
```

Navigate to the project folder:

```bash
cd equipment-rental-platform-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://equipment-rental-platform-server.onrender.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

```bash
npm run build
```

## Deployment
The frontend is deployed using Vercel.

## Backend Repository
https://github.com/ivyakterlotamoni/equipment-rental-platform-server

## Author
Ivy Akter Lota