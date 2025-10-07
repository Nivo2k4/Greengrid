import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key'; // Use env var in production!

// Register
export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, role = 'resident', phoneNumber, address } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        phoneNumber: phoneNumber || '',
        address: address || '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        joinedAt: new Date(),
        lastLogin: null,
        avatarUrl: '', // default blank
        passwordHash // new field
      }
    });

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

    res.status(201).json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, error: error.message || 'Registration failed' });
  }
};


// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    // Create JWT
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

    res.json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ success: false, error: 'Login failed' });
  }
};


// Get Profile (protected)
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; // From JWT middleware

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
};


// JWT Middleware
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
