# Hadir's Cafe POS System

A comprehensive full-stack Point of Sale (POS) system designed specifically for cafe and restaurant management, featuring real-time analytics, inventory management, and multi-role user access.

## 🚀 Live Demo

[View Live Application](https://your-deployed-url.com)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core POS Functionality
- **Interactive Menu Management**: Drag-and-drop menu organization with 79+ pre-loaded items
- **Real-time Order Processing**: Add items to cart, modify quantities, and process payments
- **Multi-role Access**: Separate interfaces for admin and cashier roles
- **Category-based Navigation**: Organized menu with categories (Coffee, Pastries, Sandwiches, etc.)
- **Inventory Tracking**: Real-time availability status and stock management

### Advanced Analytics
- **Sales Dashboard**: Real-time revenue tracking and daily statistics
- **Product Performance**: Best-selling items analysis with trend indicators
- **Customer Analytics**: Peak hour tracking and customer behavior insights
- **Revenue Reports**: Detailed financial summaries and profit analysis

### Receipt & Order Management
- **Professional Receipt Generation**: Customizable receipt templates with business branding
- **Dual Printing**: Separate receipts for customers and Kitchen Order Tickets (KOT)
- **Order History**: Complete transaction log with search and filter capabilities
- **Customer Details**: Capture and store customer information for loyalty programs

### User Management
- **Secure Authentication**: JWT-based login system with role-based access control
- **Password Protection**: Bcrypt encryption for secure user data storage
- **Admin Controls**: Complete system administration capabilities
- **User Registration**: Self-service account creation with email validation

## 🛠 Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - Modern component library with accessibility features
- **React Router** - Client-side routing for single-page application
- **React Hook Form** - Efficient form handling and validation

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js 4.16.1** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 8.16.4** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **Bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing configuration

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Swagger** - API documentation and testing
- **PostCSS** - CSS processing and optimization

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd hadir/backend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm start
```

### Frontend Setup

```bash
# Navigate to project root
cd hadir

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/hadir-cafe-pos
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

## 🚀 Usage

### For Administrators
1. **Login** with admin credentials
2. **Manage Menu**: Add, edit, or remove menu items with images and descriptions
3. **View Analytics**: Monitor sales performance, popular items, and revenue trends
4. **User Management**: Control access levels and manage staff accounts
5. **System Settings**: Configure tax rates, business information, and preferences

### For Cashiers
1. **Login** with cashier credentials
2. **Process Orders**: Add items to cart and complete transactions
3. **Handle Payments**: Accept cash, card, or UPI payments
4. **Print Receipts**: Generate and print customer receipts
5. **View Today's Sales**: Monitor daily performance metrics

### Customer Features
1. **Browse Menu**: View available items with descriptions and prices
2. **Place Orders**: Add items to cart and specify quantities
3. **Provide Details**: Enter contact information for order tracking
4. **Receive Receipts**: Get printed receipts with order details

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Menu Management
- `GET /api/menu` - Retrieve all menu items
- `POST /api/menu` - Add new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Remove menu item

### Order Processing
- `POST /api/orders` - Create new order
- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/my` - Get user's orders

### Receipt Management
- `GET /api/receipts` - Retrieve all receipts
- `GET /api/receipts/:id` - Get specific receipt
- `POST /api/receipts` - Generate new receipt

Full API documentation available at: `http://localhost:3000/api-docs`

## 📁 Project Structure

```
hadir/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── public/          # Static files
│   └── app.js           # Express server configuration
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin-specific components
│   │   └── ui/          # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API calls
│   ├── pages/           # Page components
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── dist/                # Production build
```

## 📱 Screenshots

### Dashboard Overview
![Dashboard](screenshots/dashboard.png)

### Menu Management
![Menu Management](screenshots/menu.png)

### Analytics Dashboard
![Analytics](screenshots/analytics.png)

### Receipt Generation
![Receipt](screenshots/receipt.png)

## 🔧 Configuration

### Business Settings
- **Company Information**: Update cafe name, address, and contact details
- **Tax Configuration**: Set tax rates and calculation methods
- **Receipt Customization**: Modify receipt templates and branding
- **Payment Methods**: Configure accepted payment types

### System Preferences
- **User Roles**: Define access levels for different staff members
- **Menu Categories**: Organize items into custom categories
- **Inventory Alerts**: Set low-stock notifications
- **Backup Settings**: Configure data backup and export options

## 🚀 Deployment

### Production Build

```bash
# Build frontend for production
npm run build

# Start production server
npm run preview
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
- Configure production MongoDB URI
- Set secure JWT secrets
- Enable HTTPS for secure transactions
- Set up domain and SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Maintain consistent code formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Mohammed Isa** - Full-Stack Developer
- **Project Duration**: [Insert timeline]
- **Technologies Used**: React, Node.js, MongoDB, TypeScript

## 📞 Support

For support, email support@hadirscafe.com or create an issue in the repository.

---

**Built with ❤️ for modern cafe management**