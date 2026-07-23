import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Classroom } from '../models/Classroom.js';
import { ClassMember } from '../models/ClassMember.js';
import { Announcement } from '../models/Announcement.js';
import { Material } from '../models/Material.js';
import { Assignment } from '../models/Assignment.js';
import { Submission } from '../models/Submission.js';
import { Grade } from '../models/Grade.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Meeting } from '../models/Meeting.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

export const runSeed = async () => {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Classroom.deleteMany({}),
      ClassMember.deleteMany({}),
      Announcement.deleteMany({}),
      Material.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Grade.deleteMany({}),
      AttendanceSession.deleteMany({}),
      AttendanceRecord.deleteMany({}),
      Meeting.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seeder] Cleared old records. Creating demo users & classrooms...');

    // 1. Create Users
    const teacher = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@school.edu',
      password: 'password123',
      role: 'TEACHER',
      department: 'Computer Science & AI',
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    const student1 = await User.create({
      name: 'Sai Shivani',
      email: 'sai@school.edu',
      password: 'password123',
      role: 'STUDENT',
      studentId: 'CS2026-001',
      department: 'Computer Science & AI',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const student2 = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@school.edu',
      password: 'password123',
      role: 'STUDENT',
      studentId: 'CS2026-002',
      department: 'Computer Science & AI',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const student3 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@school.edu',
      password: 'password123',
      role: 'STUDENT',
      studentId: 'CS2026-003',
      department: 'Computer Science & AI',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@school.edu',
      password: 'adminpassword123',
      role: 'ADMIN',
      department: 'Administration',
    });

    // 2. Create Classroom
    const class1 = await Classroom.create({
      name: 'Artificial Intelligence & Machine Learning',
      subject: 'AI & ML CS-401',
      section: 'A',
      room: 'Turing Lab 304',
      description: 'Comprehensive course on Neural Networks, Supervised Learning, Model Evaluation, and Gemini API integration.',
      academicYear: '2025-2026',
      classCode: 'CS-AI-7X92',
      teacher: teacher._id,
      coverBanner: 'gradient-blue',
    });

    const class2 = await Classroom.create({
      name: 'Database Management Systems',
      subject: 'DBMS CS-302',
      section: 'B',
      room: 'Codd Lab 102',
      description: 'Relational databases, SQL query optimization, MongoDB NoSQL architecture, and ACID transactions.',
      academicYear: '2025-2026',
      classCode: 'CS-DB-4Y18',
      teacher: teacher._id,
      coverBanner: 'gradient-green',
    });

    // Enroll Teacher & Students
    await ClassMember.create([
      { classroom: class1._id, user: teacher._id, role: 'TEACHER' },
      { classroom: class1._id, user: student1._id, role: 'STUDENT' },
      { classroom: class1._id, user: student2._id, role: 'STUDENT' },
      { classroom: class1._id, user: student3._id, role: 'STUDENT' },
      { classroom: class2._id, user: teacher._id, role: 'TEACHER' },
      { classroom: class2._id, user: student1._id, role: 'STUDENT' },
    ]);

    // 3. Announcements
    await Announcement.create({
      classroom: class1._id,
      author: teacher._id,
      content: 'Welcome to Artificial Intelligence & Machine Learning! Please check the syllabus in Classwork tab and prepare for tomorrow\'s live WebRTC session.',
      comments: [
        { author: student1._id, text: 'Looking forward to the course, Professor Ananya!' },
        { author: student2._id, text: 'Will slides be uploaded after each lecture?' },
      ],
    });

    // 4. Study Materials
    await Material.create({
      classroom: class1._id,
      uploadedBy: teacher._id,
      title: 'Unit 1: Introduction to Supervised Learning & Loss Functions',
      description: 'Comprehensive lecture slides covering Gradient Descent, MSE, and Cross-Entropy loss.',
      topic: 'Unit 1 – Intro to ML',
      attachments: [
        { fileName: 'Unit1_Supervised_Learning.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf', fileSize: 1048576 },
      ],
    });

    // 5. Assignments
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const assign1 = await Assignment.create({
      classroom: class1._id,
      createdBy: teacher._id,
      title: 'Assignment 1: Neural Networks & Backpropagation',
      description: 'Implement a multi-layer perceptron in Python or JavaScript and derive the partial derivatives for backpropagation.',
      instructions: 'Upload a PDF report and code solution. Ensure all matrix dimensions are clearly written.',
      topic: 'Unit 1 – Intro to ML',
      maxMarks: 20,
      dueDate: tomorrow,
      allowLate: true,
      status: 'PUBLISHED',
    });

    // 6. Submissions & Grading
    await Submission.create({
      assignment: assign1._id,
      student: student1._id,
      textResponse: 'Completed backpropagation derivation and attached the python matrix implementation.',
      status: 'GRADED',
      submittedAt: now,
      marksObtained: 18,
      feedback: 'Excellent work on the mathematical derivations! Clean code implementation.',
      gradedAt: now,
      gradedBy: teacher._id,
    });

    await Grade.create({
      classroom: class1._id,
      assignment: assign1._id,
      student: student1._id,
      marksObtained: 18,
      maxMarks: 20,
      percentage: 90,
      gradedBy: teacher._id,
    });

    // 7. Attendance Session & Records
    const session = await AttendanceSession.create({
      classroom: class1._id,
      createdBy: teacher._id,
      title: 'Session 1: Neural Networks Lecture Attendance',
      date: now,
      startTime: now,
      windowMinutes: 30,
      status: 'OPEN',
      sessionToken: 'SEED_ATT_TOKEN_1',
    });

    await AttendanceRecord.create([
      { session: session._id, classroom: class1._id, student: student1._id, status: 'PRESENT', method: 'ONLINE_SESSION' },
      { session: session._id, classroom: class1._id, student: student2._id, status: 'PRESENT', method: 'ONLINE_SESSION' },
    ]);

    // 8. Live Meetings
    await Meeting.create({
      classroom: class1._id,
      host: teacher._id,
      title: 'Live Lab: Deep Learning Model Optimization & Gemini API',
      description: 'Live interactive coding lab. Bring your questions regarding Assignment 1.',
      scheduledStartTime: tomorrow,
      expectedDurationMinutes: 60,
      meetingCode: 'MEET-AI-LAB1',
      status: 'SCHEDULED',
    });

    // 9. Notifications
    await Notification.create({
      user: student1._id,
      title: 'Assignment Graded: Neural Networks & Backpropagation',
      message: 'Your assignment has been graded. Score: 18/20 (90%)',
      type: 'ASSIGNMENT_GRADED',
      link: `/classroom/${class1._id}`,
    });

    console.log('[Seeder] Demo accounts & classrooms populated successfully! 🌱');
  } catch (err) {
    console.error('[Seeder Error]', err.message);
  }
};

// Standalone execution check
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/google_classroom_lms';
  mongoose.connect(mongoUri).then(async () => {
    await runSeed();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
