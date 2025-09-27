import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMaterials = query({
  args: {
    branch: v.optional(v.string()),
    semester: v.optional(v.number()),
    subject: v.optional(v.string()),
    type: v.optional(v.union(v.literal("notes"), v.literal("question_paper"), v.literal("syllabus"), v.literal("lab_manual"))),
  },
  handler: async (ctx, args) => {
    let materials;

    if (args.branch && args.semester) {
      materials = await ctx.db
        .query("studyMaterials")
        .withIndex("by_branch_semester", (q) => 
          q.eq("branch", args.branch!).eq("semester", args.semester!)
        )
        .collect();
    } else if (args.subject) {
      materials = await ctx.db
        .query("studyMaterials")
        .withIndex("by_subject", (q) => q.eq("subject", args.subject!))
        .collect();
    } else if (args.type) {
      materials = await ctx.db
        .query("studyMaterials")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else {
      materials = await ctx.db.query("studyMaterials").collect();
    }

    return Promise.all(
      materials.map(async (material) => ({
        ...material,
        fileUrl: material.fileId ? await ctx.storage.getUrl(material.fileId) : null,
      }))
    );
  },
});

export const uploadMaterial = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    branch: v.string(),
    semester: v.number(),
    type: v.union(v.literal("notes"), v.literal("question_paper"), v.literal("syllabus"), v.literal("lab_manual")),
    fileId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("studyMaterials", {
      ...args,
      uploadedBy: userId,
      downloadCount: 0,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.storage.generateUploadUrl();
  },
});

export const incrementDownload = mutation({
  args: { materialId: v.id("studyMaterials") },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.materialId);
    if (!material) throw new Error("Material not found");

    await ctx.db.patch(args.materialId, {
      downloadCount: (material.downloadCount || 0) + 1,
    });
  },
});
