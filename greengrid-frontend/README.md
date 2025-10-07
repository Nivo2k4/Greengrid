# 🌱 GreenGrid Waste Management Platform

A comprehensive, production-ready waste management platform built with modern web technologies. Features real-time tracking, community engagement, administrative tools, and emergency reporting for sustainable waste management operations.

## 🚀 Features

### 🏠 **Homepage & Landing**
- **Hero Section** with compelling messaging and call-to-action
- **Feature Cards** showcasing platform capabilities with smooth animations
- **Statistics Dashboard** displaying key performance metrics
- **Testimonials Section** from community members and stakeholders
- **Newsletter Subscription** for updates and announcements
- **Professional Footer** with comprehensive navigation and contact information

### 🗺️ **Real-Time Tracking System**
- **Live Truck Tracking** with GPS coordinates and route visualization
- **Interactive Map Interface** showing collection vehicles in real-time
- **Schedule Management** with filtering by date, area, and status
- **Driver Information** and contact details for each vehicle
- **Capacity Monitoring** and current load tracking
- **Status Updates** (active, completed, delayed, emergency)
- **Route Optimization** and performance analytics

### 📊 **Community Dashboard**
- **Analytics Dashboard** with interactive charts and graphs
- **Performance Metrics** including collection rates and response times
- **Community Statistics** and trend analysis
- **User Engagement** tracking and insights
- **Report Export** functionality for data analysis
- **Real-time Updates** and notification system
- **Custom Date Range** filtering and data visualization

### 👥 **Community Hub**
- **Community Leader Profiles** with detailed information and contact details
- **Local Environmental Initiatives** and program management
- **Event Coordination** and community scheduling
- **Resource Sharing** and knowledge base
- **Community Feedback** system with ratings and reviews
- **Collaboration Tools** for community engagement
- **Leader Management** with role-based permissions

### 🚨 **Emergency Reporting System**
- **Incident Reporting** with photo upload capabilities
- **Priority Classification** (high, medium, low) with color coding
- **Location-based Reporting** with GPS coordinates
- **Emergency Contacts** integration and quick access
- **SMS Notifications** via Twilio integration
- **Real-time Status** tracking and updates
- **Multi-media Support** for comprehensive incident documentation

### ⚙️ **Admin Panel**
- **User Management** system with role-based access control
- **Community Leader Administration** with CRUD operations
- **System Settings** configuration and customization
- **Data Management** tools and analytics
- **Role Permissions** (resident, community-leader, admin)
- **Bulk Operations** for efficient management

### 🔐 **Authentication System**
- **Professional Login Page** with modern UI/UX design
- **Registration System** for new user onboarding
- **Role-based Access Control** with protected routes
- **Session Management** with Firebase integration
- **Form Validation** with real-time error handling
- **Password Security** with show/hide functionality
- **Remember Me** and forgot password features

### 📱 **Progressive Web App (PWA)**
- **Mobile-first Design** with responsive layouts
- **Offline Functionality** for core features
- **App-like Experience** with service worker
- **Push Notifications** capability
- **Install Prompt** for mobile devices
- **Cross-platform Compatibility**

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent iconography
- **Recharts** for data visualization
- **React Hook Form** for form management
- **Sonner** for toast notifications

### **Backend**
- **Node.js** with Express.js framework
- **Firebase** for authentication and real-time database
- **Cloudinary** for image upload and management
- **Twilio** for SMS notifications
- **Helmet** for security headers
- **CORS** for cross-origin resource sharing

### **Development Tools**
- **TypeScript** for static type checking
- **ESLint** for code linting
- **Prettier** for code formatting
- **Hot Module Replacement** for development
- **Error Boundaries** for error handling
- **Code Splitting** for performance optimization

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project setup
- Cloudinary account (for image uploads)
- Twilio account (for SMS notifications)

### **Frontend Setup**
```bash
# Clone the repository
git clone <repository-url>
cd GreenGrid

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Backend Setup**
```bash
# Navigate to backend directory
cd greengrid-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

### **Environment Variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

## 🌍 Localization

The platform is specifically configured for **Sri Lankan operations**:
- **Address**: 34/ Wellawatte, Colombo
- **Phone**: +94777534286
- **Community Leaders**: Local Sri Lankan team
- **Cultural Adaptation**: Local customs and practices
- **Language Support**: English with Sinhala/Tamil considerations

## 🔐 Admin Access

### **Default Admin Credentials**
- **Email**: `zaid.nasheem@greengrid.com`
- **Password**: `123`

### **Role Hierarchy**
1. **Admin**: Full system access and management
2. **Community Leader**: Area-specific management and reporting
3. **Resident**: Basic features and reporting access

## 📊 API Endpoints

### **Authentication**
- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - User authentication
- `POST /api/auth/sync` - User synchronization
- `GET /api/test` - API testing endpoint

### **Emergency System**
- `POST /api/emergency/report` - Submit emergency report
- `GET /api/emergency/reports` - Retrieve emergency reports
- `PUT /api/emergency/update/:id` - Update report status

### **Community Management**
- `GET /api/community/leaders` - Get community leaders
- `POST /api/community/leaders` - Add new leader
- `PUT /api/community/leaders/:id` - Update leader info
- `DELETE /api/community/leaders/:id` - Remove leader

## 🚀 Deployment

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to your hosting service
# The build folder contains the production-ready files
```

### **Backend Deployment**
```bash
# Set production environment variables
export NODE_ENV=production

# Start the server
npm start
```

### **Recommended Hosting**
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: Firebase (already configured)

## 📱 Mobile App Features

The platform includes PWA capabilities for mobile app experience:
- **Install Prompt** for adding to home screen
- **Offline Mode** for basic functionality
- **Push Notifications** for updates and alerts
- **Responsive Design** optimized for mobile devices

## 🤝 Contributing

We welcome contributions to improve the GreenGrid platform:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 👨‍💻 Developer

**Mohamed Zaid Nasheem** - Full-Stack Developer & System Administrator

### **Key Contributions**
- ✅ Implemented comprehensive admin panel and user management system
- ✅ Configured authentication and role-based access control
- ✅ Localized platform for Sri Lankan operations
- ✅ Enhanced community features and leader management
- ✅ Built real-time tracking and emergency reporting systems
- ✅ Developed PWA capabilities for mobile experience
- ✅ Integrated third-party services (Firebase, Cloudinary, Twilio)
- ✅ Created professional UI/UX with modern design patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Community Leaders** for their valuable feedback and support
- **Open Source Contributors** for the amazing libraries and tools
- **Sri Lankan Tech Community** for inspiration and collaboration
- **Environmental Organizations** for promoting sustainable practices

## 📞 Support

For technical support or questions:
- **Email**: support@greengrid.com
- **Phone**: +94777534286
- **Address**: 34/ Wellawatte, Colombo, Sri Lanka

---

**Built with ❤️ for a cleaner, greener future**

## Authentication
- Authentication is handled solely by Firebase Authentication (Email/Password and optional social providers).
- Backend auth endpoints `/api/auth/login` and `/api/auth/admin-login` are disabled and return 410.
- Roles and profiles are stored in Firestore under `users/{uid}` with fields like `role`, `fullName`, `joinedAt`.

### Developer setup
1. Enable Email/Password in Firebase Console → Authentication.
2. Create test users in Firebase Auth or register via the app.
3. Set user role in Firestore (`users/{uid}.role`) to `admin`, `community-leader`, or `resident`.
4. App login/registration uses Firebase SDK. On login, the app reads role from Firestore and enforces route access.

### Optional sync
- You may call `/api/auth/sync` after login/registration to upsert profile fields in your backend/Firestore if needed.

### Securing backend
- Protect sensitive routes by validating Firebase ID tokens from `Authorization: Bearer <token>`.