import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_google_classroom_2026', {
    expiresIn: '30d',
  });
};

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, studentId, department } = req.body;

    // Strict Access Restriction: Only official @nxtwave.in email addresses allowed
    if (!email || !email.toLowerCase().trim().endsWith('@nxtwave.in')) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Only authorized NxtWave students and mentors are allowed to access this portal.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: role || 'STUDENT',
      studentId: studentId || '',
      department: department || 'Full Stack & AI Academy',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Strict Access Restriction: Only official @nxtwave.in email addresses allowed
    if (!email || !email.toLowerCase().trim().endsWith('@nxtwave.in')) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Only authorized NxtWave students and mentors are allowed to access this portal.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.accountStatus !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Account is suspended or inactive.' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, department, profilePhoto, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (department) user.department = department;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (password) user.password = password;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/auth/students
export const getStudentsList = async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT', accountStatus: 'ACTIVE' }).select('name email profilePhoto studentId department');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
