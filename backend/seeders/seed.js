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

    console.log('[Seeder] Cleared old records. Creating NxtWave mentors & students...');

    // 1. Create Teachers / Mentors (Password: teacher@123)
    const teacherShraddha = await User.create({
      name: 'Shraddha',
      email: 'shraddha@nxtwave.in',
      password: 'teacher@123',
      role: 'TEACHER',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    const teacherNishanth = await User.create({
      name: 'Nishanth',
      email: 'nishanth@nxtwave.in',
      password: 'teacher@123',
      role: 'TEACHER',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const teacherPayal = await User.create({
      name: 'Payal Sharma',
      email: 'payal@nxtwave.in',
      password: 'teacher@123',
      role: 'TEACHER',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    });

    const teacherLilly = await User.create({
      name: 'Lillian Grace Philips',
      email: 'lilly@nxtwave.in',
      password: 'teacher@123',
      role: 'TEACHER',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    });

    // 2. Create NxtWave Students
    const studentSai = await User.create({
      name: 'Sai Shivani',
      email: 'saishivani@nxtwave.in',
      password: 'saishivani@stu1869',
      role: 'STUDENT',
      studentId: 'NXT-STU-1869',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const studentAnanya = await User.create({
      name: 'Ananya',
      email: 'ananya@nxtwave.in',
      password: 'ananya@stu1870',
      role: 'STUDENT',
      studentId: 'NXT-STU-1870',
      department: 'Full Stack & AI Academy',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    const admin = await User.create({
      name: 'NxtWave Admin',
      email: 'admin@nxtwave.in',
      password: 'adminpassword123',
      role: 'ADMIN',
      department: 'System Administration',
    });

    // 3. Create NxtWave Classrooms
    const class1 = await Classroom.create({
      name: 'NxtWave AI & Full Stack Engineering',
      subject: 'MERN & GenAI Track',
      section: 'Batch 2026-A',
      room: 'Virtual Classroom 101',
      description: 'Official NxtWave Learning Track covering React, Node.js, Mongoose, WebRTC, and Gemini AI integration.',
      academicYear: '2026',
      classCode: 'NXT-AI-2026',
      teacher: teacherShraddha._id,
      coverBanner: 'gradient-blue',
    });

    const class2 = await Classroom.create({
      name: 'Database Architecture & System Design',
      subject: 'NoSQL & Systems',
      section: 'Batch 2026-B',
      room: 'Virtual Lab 202',
      description: 'Data modeling, MongoDB performance tuning, indexing, and real-time Socket.IO architecture.',
      academicYear: '2026',
      classCode: 'NXT-DB-99X4',
      teacher: teacherNishanth._id,
      coverBanner: 'gradient-purple',
    });

    // Enroll Mentors & Students
    await ClassMember.create([
      { classroom: class1._id, user: teacherShraddha._id, role: 'TEACHER' },
      { classroom: class1._id, user: teacherNishanth._id, role: 'TEACHER' },
      { classroom: class1._id, user: studentSai._id, role: 'STUDENT' },
      { classroom: class1._id, user: studentAnanya._id, role: 'STUDENT' },
      { classroom: class2._id, user: teacherNishanth._id, role: 'TEACHER' },
      { classroom: class2._id, user: studentSai._id, role: 'STUDENT' },
    ]);

    // 4. Announcements
    await Announcement.create({
      classroom: class1._id,
      author: teacherShraddha._id,
      content: 'Welcome NxtWave Students! Please review the syllabus in the Classwork tab and prepare for tomorrow\'s live WebRTC session with mentor Nishanth.',
      comments: [
        { author: studentSai._id, text: 'Super excited for the NxtWave AI track!' },
        { author: studentAnanya._id, text: 'Looking forward to building full stack projects.' },
      ],
    });

    // 5. Study Materials
    await Material.create({
      classroom: class1._id,
      uploadedBy: teacherShraddha._id,
      title: 'Module 1: Advanced Full Stack Architecture & AI Integration',
      description: 'Comprehensive guide covering Node.js microservices, React 18 hooks, and Gemini API integration.',
      topic: 'Module 1 – Foundation',
      attachments: [
        { fileName: 'NxtWave_FullStack_Module1.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf', fileSize: 1048576 },
      ],
    });

    // 6. Assignments
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const assign1 = await Assignment.create({
      classroom: class1._id,
      createdBy: teacherShraddha._id,
      title: 'Project Assignment 1: NxtWave LMS Component Implementation',
      description: 'Build a production-ready React component with custom hooks and real-time Socket.IO synchronization.',
      instructions: 'Submit your GitHub repository link and deployed live URL.',
      topic: 'Module 1 – Foundation',
      maxMarks: 100,
      dueDate: tomorrow,
      allowLate: true,
      status: 'PUBLISHED',
    });

    // 7. Submissions & Grading
    await Submission.create({
      assignment: assign1._id,
      student: studentSai._id,
      textResponse: 'Completed NxtWave LMS component design and connected real-time state management.',
      status: 'GRADED',
      submittedAt: now,
      marksObtained: 95,
      feedback: 'Outstanding project execution! Excellent clean code structure.',
      gradedAt: now,
      gradedBy: teacherShraddha._id,
    });

    await Grade.create({
      classroom: class1._id,
      assignment: assign1._id,
      student: studentSai._id,
      marksObtained: 95,
      maxMarks: 100,
      percentage: 95,
      gradedBy: teacherShraddha._id,
    });

    // 8. Attendance Session & Records
    const session = await AttendanceSession.create({
      classroom: class1._id,
      createdBy: teacherShraddha._id,
      title: 'NxtWave AI Live Session Attendance',
      date: now,
      startTime: now,
      windowMinutes: 30,
      status: 'OPEN',
      sessionToken: 'NXT_ATT_TOKEN_1',
    });

    await AttendanceRecord.create([
      { session: session._id, classroom: class1._id, student: studentSai._id, status: 'PRESENT', method: 'ONLINE_SESSION' },
      { session: session._id, classroom: class1._id, student: studentAnanya._id, status: 'PRESENT', method: 'ONLINE_SESSION' },
    ]);

    // 9. Live Meetings
    await Meeting.create({
      classroom: class1._id,
      host: teacherShraddha._id,
      title: 'NxtWave Mentor Session: WebRTC & AI System Architecture',
      description: 'Live interactive session hosted by mentors Shraddha & Nishanth.',
      scheduledStartTime: tomorrow,
      expectedDurationMinutes: 60,
      meetingCode: 'NXT-LIVE-MEET1',
      status: 'SCHEDULED',
    });

    // 10. Notifications
    await Notification.create({
      user: studentSai._id,
      title: 'Assignment Graded: Project Assignment 1',
      message: 'Your assignment has been graded by Mentor Shraddha. Score: 95/100 (95%)',
      type: 'ASSIGNMENT_GRADED',
      link: `/classroom/${class1._id}`,
    });

    console.log('[Seeder] NxtWave official accounts & classrooms populated successfully! 🚀');
  } catch (err) {
    console.error('[Seeder Error]', err.message);
  }
};

import { connectDB } from '../config/db.js';

// Standalone execution check
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  connectDB().then(async () => {
    await runSeed();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
