import { query, mutation, internalAction, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const getChatSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createChatSession = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("chatSessions", {
      userId,
      title: args.title,
    });
  },
});

export const getChatMessages = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session_timestamp", (q) => 
        q.eq("sessionId", args.sessionId)
      )
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Add user message
    await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      userId,
      content: args.content,
      role: "user",
      timestamp: Date.now(),
    });

    // Update session last message
    await ctx.db.patch(args.sessionId, {
      lastMessage: args.content,
    });

    // Schedule AI response
    await ctx.scheduler.runAfter(0, internal.chat.generateAIResponse, {
      sessionId: args.sessionId,
      userMessage: args.content,
    });
  },
});

export const generateAIResponse = internalAction({
  args: {
    sessionId: v.id("chatSessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Get recent messages for context
    const messages = await ctx.runQuery(internal.chat.getRecentMessages, {
      sessionId: args.sessionId,
    });

    const systemPrompt = `You are a helpful VTU (Visvesvaraya Technological University) academic assistant. 
    Help students with:
    - Academic queries about VTU curriculum, syllabus, and exam patterns
    - Study guidance and preparation strategies
    - Career advice and placement preparation
    - University procedures and regulations
    - Technical concepts and problem-solving
    
    Keep responses concise, helpful, and focused on VTU academic context.`;

    try {
      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-nano",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Add AI response to chat
      await ctx.runMutation(internal.chat.addAIMessage, {
        sessionId: args.sessionId,
        content: aiResponse,
      });

    } catch (error) {
      console.error("AI response error:", error);
      await ctx.runMutation(internal.chat.addAIMessage, {
        sessionId: args.sessionId,
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
      });
    }
  },
});

export const getRecentMessages = internalQuery({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session_timestamp", (q) => 
        q.eq("sessionId", args.sessionId)
      )
      .order("desc")
      .take(10);
  },
});

export const addAIMessage = internalMutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Get session to find userId
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      userId: session.userId,
      content: args.content,
      role: "assistant",
      timestamp: Date.now(),
    });

    // Update session last message
    await ctx.db.patch(args.sessionId, {
      lastMessage: args.content,
    });
  },
});
