import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    audioStorageId: v.id('_storage'),
    imageStorageId: v.id('_storage'),
    user: v.id('users'),
    title: v.string(),
    description: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.optional(v.string()),
    languageType: v.string(),
    audioDuration: v.number(),
    speed: v.number(),
    views: v.number(),
  })
    .searchIndex('search_author',{ searchField: 'author'})
    .searchIndex('search_title',{ searchField: 'title'})
    .searchIndex('search_body',{ searchField: 'description'})
  ,
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string()
  })
})