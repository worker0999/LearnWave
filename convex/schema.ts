import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Student profiles with academic info
  students: defineTable({
    userId: v.id("users"),
    usn: v.string(),
    name: v.string(),
    branch: v.string(),
    semester: v.number(),
    batch: v.string(),
    cgpa: v.optional(v.number()),
    isAdmin: v.optional(v.boolean()),
  }).index("by_user", ["userId"])
    .index("by_usn", ["usn"]),

  // Study materials and resources
  studyMaterials: defineTable({
    title: v.string(),
    subject: v.string(),
    branch: v.string(),
    semester: v.number(),
    type: v.union(v.literal("notes"), v.literal("question_paper"), v.literal("syllabus"), v.literal("lab_manual")),
    fileId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    uploadedBy: v.id("users"),
    tags: v.optional(v.array(v.string())),
    downloadCount: v.optional(v.number()),
  }).index("by_subject", ["subject"])
    .index("by_branch_semester", ["branch", "semester"])
    .index("by_type", ["type"]),

  // Academic results
  results: defineTable({
    studentId: v.id("students"),
    semester: v.number(),
    subject: v.string(),
    subjectCode: v.string(),
    internalMarks: v.optional(v.number()),
    externalMarks: v.optional(v.number()),
    totalMarks: v.optional(v.number()),
    grade: v.optional(v.string()),
    credits: v.number(),
    examType: v.union(v.literal("regular"), v.literal("revaluation"), v.literal("supplementary")),
    academicYear: v.string(),
  }).index("by_student", ["studentId"])
    .index("by_semester", ["semester"])
    .index("by_student_semester", ["studentId", "semester"]),

  // AI Chat conversations
  chatSessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    lastMessage: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    userId: v.id("users"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    timestamp: v.number(),
  }).index("by_session", ["sessionId"])
    .index("by_session_timestamp", ["sessionId", "timestamp"]),

  // Placement resources and opportunities
  placements: defineTable({
    companyName: v.string(),
    role: v.string(),
    package: v.optional(v.string()),
    eligibleBranches: v.array(v.string()),
    cgpaCriteria: v.optional(v.number()),
    description: v.string(),
    applicationDeadline: v.optional(v.number()),
    driveDate: v.optional(v.number()),
    status: v.union(v.literal("upcoming"), v.literal("ongoing"), v.literal("completed")),
    requirements: v.optional(v.array(v.string())),
    contactInfo: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_deadline", ["applicationDeadline"]),

  // Announcements and notifications
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("general"), v.literal("academic"), v.literal("placement"), v.literal("urgent")),
    targetBranches: v.optional(v.array(v.string())),
    targetSemesters: v.optional(v.array(v.number())),
    createdBy: v.id("users"),
    isActive: v.boolean(),
  }).index("by_type", ["type"])
    .index("by_active", ["isActive"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
