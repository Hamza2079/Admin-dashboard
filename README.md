# Admin Dashboard

A modern, responsive admin dashboard built with React, TypeScript, and Tailwind CSS. Features user management, order tracking, and role-based access control with a beautiful mobile-first design.

## ✨ Features

### 🔐 Authentication & Authorization

- **Three User Roles**: Super Admin, Admin, and Regular User
- **Role-Based Access Control**: Different permissions for each role
- **Secure Login**: Email and password authentication
- **Account Status**: Active/Blocked user management

### 📊 Dashboard

- **Order Statistics**: Total orders, pending, and shipped counts
- **User Overview**: Total users display
- **Quick Actions**: Navigate to Users and Orders pages
- **Responsive Grid**: 2 columns on mobile, 4 on desktop

### 🛒 Orders Management

- **Order Tracking**: View all orders with detailed information
- **Status Management**: Update order status (pending, paid, shipped, cancelled)
- **Create Orders**: Users can create new orders
- **Cancel Orders**: Users can cancel pending orders
- **Revenue Stats**: Admins see revenue, users see order counts
- **Mobile Card View**: Beautiful card layout on mobile devices
- **Desktop Table View**: Full table with all columns on desktop

### 👥 Users Management (Admin Only)

- **User List**: View all registered users
- **Role Management**: Change user roles (User/Admin)
- **Status Control**: Activate or block user accounts
- **Permission System**:
  - Super Admin can edit all users except themselves
  - Regular Admins can only edit regular users
  - Cannot edit other admins or themselves

### 📱 Mobile-Responsive Design

- **Hamburger Menu**: Slide-out navigation drawer
- **Bottom Navigation**: Quick access to main pages
- **Card Layouts**: Mobile-optimized card views for tables
- **Touch-Friendly**: 44px+ touch targets
- **No Horizontal Scroll**: All content fits on mobile screens
- **Sticky Headers**: Headers stay visible while scrolling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd admin-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

### Super Admin

- **Email**: `sadmin@gmail.com`
- **Password**: `sadmin123`
- **Permissions**: Can edit all users and orders, including cancelled orders

### Admin

- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Permissions**: Can manage regular users and orders (except cancelled)

### Regular User

- **Email**: `user@gmail.com`
- **Password**: `user123`
- **Permissions**: Can view and create own orders

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching

- **React Query (TanStack Query)** - Server state management
- **React Context** - Authentication state
- **Axios** - HTTP client

### UI Components

- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Custom UI Components** - Built with Tailwind CSS

### Backend/API

- **JSON Server** - Mock REST API
- **db.json** - Local database

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── api/              # API service functions
│   │   ├── axios.ts      # Axios instance configuration
│   │   ├── orders.ts     # Orders API calls
│   │   └── users.ts      # Users API calls
│   ├── auth/             # Authentication
│   │   └── AuthContext.tsx
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI components (Button, Dialog, etc.)
│   │   ├── MobileMenu.tsx
│   │   └── MobileNav.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useOrders.ts
│   │   └── useUsers.ts
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Users.tsx
│   │   └── login.tsx
│   ├── providers/        # Context providers
│   │   └── QueryProvider.tsx
│   ├── types/            # TypeScript types
│   │   ├── orders.ts
│   │   └── users.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── db.json               # Mock database
├── package.json
└── README.md
```

## 🎨 Key Features Breakdown

### Super Admin Privileges

- Edit **all users** including other admins
- Edit **cancelled orders** (exclusive feature)
- Full access to all dashboard features
- Identified by purple "Super Admin" badge

### Admin Privileges

- Edit **regular users only**
- Manage all orders (except cancelled)
- Access to Users Management page
- View revenue statistics

### User Privileges

- Create new orders
- View own orders only
- Cancel pending orders
- View order count statistics

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (md to lg)
- **Desktop**: > 1024px (lg+)

### Mobile Features

- Hamburger menu with user profile
- Bottom navigation bar (Home, Orders, Users)
- Card-based layouts for tables
- Responsive stat grids (2 columns)
- Touch-optimized buttons and dropdowns

### Desktop Features

- Full navigation in header
- Table layouts with all columns
- 4-5 column stat grids
- Hover effects and transitions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Future Enhancements

- [ ] User profile editing
- [ ] Order details page
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF
- [ ] Dark mode support
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Bulk actions for orders/users

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using React and TypeScript
