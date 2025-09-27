import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getStudentResults = query({
  args: {
    semester: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!student) return [];

    let query = ctx.db
      .query("results")
      .withIndex("by_student", (q) => q.eq("studentId", student._id));

    if (args.semester) {
      query = ctx.db
        .query("results")
        .withIndex("by_student_semester", (q) => 
          q.eq("studentId", student._id).eq("semester", args.semester!)
        );
    }

    return await query.collect();
  },
});

export const addResult = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!student) throw new Error("Student profile not found");

    return await ctx.db.insert("results", {
      studentId: student._id,
      ...args,
    });
  },
});

export const calculateSGPA = query({
  args: { semester: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!student) return null;

    const results = await ctx.db
      .query("results")
      .withIndex("by_student_semester", (q) => 
        q.eq("studentId", student._id).eq("semester", args.semester)
      )
      .collect();

    if (results.length === 0) return null;

    const gradePoints: Record<string, number> = {
      'S': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
    };

    let totalCredits = 0;
    let totalGradePoints = 0;

    results.forEach(result => {
      if (result.grade && gradePoints[result.grade] !== undefined) {
        totalCredits += result.credits;
        totalGradePoints += gradePoints[result.grade] * result.credits;
      }
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : null;
  },
});
