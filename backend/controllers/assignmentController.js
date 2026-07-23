import { Assignment } from '../models/Assignment.js';
import { Submission } from '../models/Submission.js';
import { Grade } from '../models/Grade.js';
import { Classroom } from '../models/Classroom.js';
import { ClassMember } from '../models/ClassMember.js';
import { Notification } from '../models/Notification.js';
import { CalendarEvent } from '../models/CalendarEvent.js';

// @route POST /api/assignments/:classroomId
export const createAssignment = async (req, res) => {
  try {
    const { title, description, instructions, topic, maxMarks, dueDate, allowLate, status } = req.body;
    const { classroomId } = req.params;

    const attachments = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        }))
      : [];

    const assignment = await Assignment.create({
      classroom: classroomId,
      createdBy: req.user._id,
      title,
      description: description || '',
      instructions: instructions || '',
      topic: topic || 'General',
      maxMarks: Number(maxMarks) || 100,
      dueDate: new Date(dueDate),
      allowLate: allowLate === undefined ? true : allowLate,
      status: status || 'PUBLISHED',
      attachments,
    });

    // Add to Calendar
    const classroom = await Classroom.findById(classroomId);
    await CalendarEvent.create({
      classroom: classroomId,
      title: `Assignment Due: ${title}`,
      description: `Class: ${classroom.name}`,
      eventType: 'ASSIGNMENT',
      startDate: new Date(dueDate),
      link: `/classroom/${classroomId}`,
    });

    // Send notification if Published
    if (assignment.status === 'PUBLISHED') {
      const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' });
      const notifications = members.map((m) => ({
        user: m.user,
        title: `New Assignment in ${classroom.name}`,
        message: `${title} has been posted. Due: ${new Date(dueDate).toLocaleString()}`,
        type: 'ASSIGNMENT_POSTED',
        link: `/classroom/${classroomId}`,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/assignments/classroom/:classroomId
export const getClassroomAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ classroom: req.params.classroomId })
      .sort({ dueDate: 1 })
      .populate('createdBy', 'name profilePhoto');

    // If student, attach submission status per assignment
    if (req.user.role === 'STUDENT') {
      const studentSubmissions = await Submission.find({ student: req.user._id });
      const submissionMap = new Map(studentSubmissions.map((s) => [s.assignment.toString(), s]));

      const enriched = assignments.map((a) => {
        const sub = submissionMap.get(a._id.toString());
        return {
          ...a._doc,
          mySubmission: sub || null,
          myStatus: sub ? sub.status : 'NOT_SUBMITTED',
        };
      });

      return res.json({ success: true, assignments: enriched });
    }

    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/assignments/:id
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('classroom', 'name subject teacher')
      .populate('createdBy', 'name profilePhoto');

    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    let mySubmission = null;
    if (req.user.role === 'STUDENT') {
      mySubmission = await Submission.findOne({ assignment: assignment._id, student: req.user._id });
    }

    res.json({ success: true, assignment, mySubmission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/assignments/:id/submit
export const submitAssignment = async (req, res) => {
  try {
    const { textResponse } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);

    if (isLate && !assignment.allowLate) {
      return res.status(400).json({ success: false, message: 'Submission closed. Late submissions are not allowed for this assignment.' });
    }

    const files = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        }))
      : [];

    let submission = await Submission.findOne({ assignment: assignment._id, student: req.user._id });

    if (submission) {
      submission.textResponse = textResponse || submission.textResponse;
      if (files.length > 0) submission.files = files;
      submission.submittedAt = now;
      submission.status = isLate ? 'LATE' : 'SUBMITTED';
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: assignment._id,
        student: req.user._id,
        textResponse: textResponse || '',
        files,
        submittedAt: now,
        status: isLate ? 'LATE' : 'SUBMITTED',
      });
    }

    res.json({ success: true, message: 'Assignment submitted successfully.', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/assignments/:id/submissions (Teacher)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const members = await ClassMember.find({ classroom: assignment.classroom, role: 'STUDENT' }).populate('user', 'name email profilePhoto studentId');

    const submissions = await Submission.find({ assignment: assignment._id }).populate('student', 'name email profilePhoto studentId');
    const submissionMap = new Map(submissions.map((s) => [s.student._id.toString(), s]));

    const rosterSubmissions = members.map((m) => {
      const sub = submissionMap.get(m.user._id.toString());
      return {
        student: m.user,
        submission: sub || null,
        status: sub ? sub.status : 'NOT_SUBMITTED',
      };
    });

    const summary = {
      assigned: members.length,
      submitted: submissions.filter((s) => s.status === 'SUBMITTED').length,
      late: submissions.filter((s) => s.status === 'LATE').length,
      graded: submissions.filter((s) => s.status === 'GRADED' || s.status === 'RETURNED').length,
      missing: members.length - submissions.length,
    };

    res.json({ success: true, summary, rosterSubmissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/assignments/:id/grade (Teacher)
export const gradeSubmission = async (req, res) => {
  try {
    const { studentId, marksObtained, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    let submission = await Submission.findOne({ assignment: assignment._id, student: studentId });

    if (!submission) {
      submission = new Submission({
        assignment: assignment._id,
        student: studentId,
        status: 'GRADED',
      });
    }

    const marks = Number(marksObtained);
    submission.marksObtained = marks;
    submission.feedback = feedback || '';
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;
    submission.status = 'GRADED';

    await submission.save();

    // Create or update Grade entry
    const percentage = Math.round((marks / assignment.maxMarks) * 100);
    await Grade.findOneAndUpdate(
      { assignment: assignment._id, student: studentId },
      {
        classroom: assignment.classroom,
        assignment: assignment._id,
        student: studentId,
        marksObtained: marks,
        maxMarks: assignment.maxMarks,
        percentage,
        gradedBy: req.user._id,
      },
      { upsert: true, new: true }
    );

    // Notify student
    await Notification.create({
      user: studentId,
      title: `Assignment Graded: ${assignment.title}`,
      message: `Your assignment has been graded. Marks: ${marks}/${assignment.maxMarks} (${percentage}%)`,
      type: 'ASSIGNMENT_GRADED',
      link: `/classroom/${assignment.classroom}`,
    });

    res.json({ success: true, message: 'Grade recorded and student notified.', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/assignments/gradebook/:classroomId
export const getClassroomGradebook = async (req, res) => {
  try {
    const assignments = await Assignment.find({ classroom: req.params.classroomId }).sort({ createdAt: 1 });
    const members = await ClassMember.find({ classroom: req.params.classroomId, role: 'STUDENT' }).populate('user', 'name email profilePhoto studentId');
    const grades = await Grade.find({ classroom: req.params.classroomId });

    const gradeMap = new Map();
    grades.forEach((g) => {
      gradeMap.set(`${g.student.toString()}_${g.assignment.toString()}`, g);
    });

    const studentMatrix = members.map((m) => {
      const studentGrades = assignments.map((a) => {
        const g = gradeMap.get(`${m.user._id.toString()}_${a._id.toString()}`);
        return {
          assignmentId: a._id,
          title: a.title,
          maxMarks: a.maxMarks,
          marksObtained: g ? g.marksObtained : null,
          percentage: g ? g.percentage : null,
        };
      });

      const gradedItems = studentGrades.filter((sg) => sg.marksObtained !== null);
      const overallAvg = gradedItems.length > 0 ? Math.round(gradedItems.reduce((acc, curr) => acc + curr.percentage, 0) / gradedItems.length) : 0;

      return {
        student: m.user,
        grades: studentGrades,
        overallPercentage: overallAvg,
      };
    });

    res.json({ success: true, assignments, studentMatrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
