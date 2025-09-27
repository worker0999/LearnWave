import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentStudent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return student;
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    usn: v.string(),
    name: v.string(),
    branch: v.string(),
    semester: v.number(),
    batch: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingStudent = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingStudent) {
      await ctx.db.patch(existingStudent._id, {
        usn: args.usn,
        name: args.name,
        branch: args.branch,
        semester: args.semester,
        batch: args.batch,
      });
      return existingStudent._id;
    } else {
      return await ctx.db.insert("students", {
        userId,
        usn: args.usn,
        name: args.name,
        branch: args.branch,
        semester: args.semester,
        batch: args.batch,
      });
    }
  },
});

export const getStudentStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!student) return null;

    // Get results count
    const resultsCount = await ctx.db
      .query("results")
      .withIndex("by_student", (q) => q.eq("studentId", student._id))
      .collect();

    // Get study materials count
    const materialsCount = await ctx.db
      .query("studyMaterials")
      .withIndex("by_branch_semester", (q) => 
        q.eq("branch", student.branch).eq("semester", student.semester)
      )
      .collect();

    return {
      student,
      resultsCount: resultsCount.length,
      materialsCount: materialsCount.length,
    };
  },
});
