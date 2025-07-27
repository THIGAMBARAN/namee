# SupplyConnect - Vendor-Supplier Platform

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Supabase Credentials

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: "SupplyConnect" 
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Wait for project setup** (takes 1-2 minutes)

4. **Get your credentials**:
   - In your project dashboard, go to **Settings** → **API**
   - Copy the **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - Copy the **anon/public key** (long string starting with `eyJ...`)

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** in your project root (same level as package.json)

2. **Add your credentials**:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

3. **Replace the placeholder values** with your actual Supabase URL and key

### Step 3: Set Up Database

1. **In Supabase dashboard**, go to **SQL Editor**
2. **Create a new query** and paste the contents of `scripts/database-setup.sql`
3. **Click "Run"** to create all tables and security policies
4. **Optional**: Run `scripts/sample-data.sql` for test data

### Step 4: Run the Application

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` - you should now see the working application!

### Step 5: Test the Application

1. **Register as a vendor** or **supplier**
2. **Check your email** for verification (check spam folder)
3. **Login** and explore the dashboard

---

## Features

### For Vendors
- **Product Discovery**: Browse and search raw materials by category and location
- **Price Comparison**: Compare prices from multiple suppliers
- **Order Management**: Add items to cart, place orders, and track delivery status
- **Location-based Filtering**: Find suppliers near your location
- **Order History**: View past orders and reorder easily

### For Suppliers
- **Product Management**: Add, edit, and manage product inventory
- **Order Processing**: View incoming orders, accept/decline, and update status
- **Business Dashboard**: Track sales and manage business operations
- **Inventory Control**: Monitor stock levels and update availability

### Core Features
- **Dual Authentication**: Separate registration and login for vendors and suppliers
- **Real-time Updates**: Order status updates and notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Transactions**: Built with security best practices
- **Role-based Access**: Different dashboards for vendors and suppliers

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API Routes and Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Detailed Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd vendor-supplier-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase** (follow Quick Setup above)

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

### Tables
- **profiles**: User information for both vendors and suppliers
- **products**: Product listings from suppliers
- **orders**: Order information
- **order_items**: Individual items within orders

### Key Relationships
- Users have profiles with roles (vendor/supplier)
- Suppliers can have multiple products
- Orders connect vendors with suppliers
- Order items link products to orders

## Project Structure

\`\`\`
├── app/
│   ├── auth/                 # Authentication pages
│   ├── vendor/              # Vendor dashboard and pages
│   ├── supplier/            # Supplier dashboard and pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── middleware.ts        # Route protection
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── VendorLayout.tsx     # Vendor layout wrapper
│   └── SupplierLayout.tsx   # Supplier layout wrapper
├── scripts/
│   ├── database-setup.sql   # Database schema
│   └── sample-data.sql      # Sample data
└── lib/
    └── utils.ts             # Utility functions
\`\`\`

## Key Features Implementation

### Authentication Flow
1. Users register as either vendor or supplier
2. Email verification (handled by Supabase)
3. Role-based dashboard redirection
4. Protected routes with middleware

### Order Management
1. Vendors browse products and add to cart
2. Orders are created with multiple items
3. Suppliers receive orders and can update status
4. Real-time status tracking for vendors

### Security Features
- Row Level Security (RLS) policies
- Role-based access control
- Protected API routes
- Input validation and sanitization

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Usage Guide

### For Vendors
1. Register as a vendor with business details
2. Browse products by category or search
3. Filter by location to find nearby suppliers
4. Add items to cart and place orders
5. Track order status in real-time

### For Suppliers
1. Register as a supplier with business information
2. Add products with pricing and stock information
3. Manage inventory and update stock levels
4. Process incoming orders from vendors
5. Update order status (accept, dispatch, deliver)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
