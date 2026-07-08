import { pgTable, varchar, text, jsonb, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: varchar("email", { length: 255 }).primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  grade: varchar("grade", { length: 100 }),
  preferredSubject: varchar("preferredSubject", { length: 100 }),
  registeredAt: varchar("registeredAt", { length: 100 }),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
  role: varchar("role", { length: 50 }).default("Student"),
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  senderName: varchar("senderName", { length: 255 }),
  senderEmail: varchar("senderEmail", { length: 255 }),
  senderRole: varchar("senderRole", { length: 50 }),
  message: text("message"),
  timestamp: varchar("timestamp", { length: 100 }),
  studentEmail: varchar("studentEmail", { length: 255 }),
  studentName: varchar("studentName", { length: 255 }),
});

export const forum_posts = pgTable("forum_posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  authorEmail: varchar("authorEmail", { length: 255 }),
  authorName: varchar("authorName", { length: 255 }),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  timestamp: varchar("timestamp", { length: 100 }),
  likes: integer("likes").default(0),
  replies: jsonb("replies").default([]),
});

export const live_classes = pgTable("live_classes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }),
  subject: varchar("subject", { length: 255 }),
  instructor: varchar("instructor", { length: 255 }),
  scheduledTime: varchar("scheduledTime", { length: 100 }),
  link: text("link"),
  status: varchar("status", { length: 50 }).default("Scheduled"),
  createdAt: varchar("createdAt", { length: 100 }),
});

export const activity_logs = pgTable("activity_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userEmail: varchar("userEmail", { length: 255 }),
  userName: varchar("userName", { length: 255 }),
  action: varchar("action", { length: 100 }),
  timestamp: varchar("timestamp", { length: 100 }),
  details: text("details"),
});

export const govt_job_notes = pgTable("govt_job_notes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  subject: varchar("subject", { length: 100 }),
  timestamp: varchar("timestamp", { length: 100 }),
  comments: jsonb("comments").default([]),
  authorEmail: varchar("authorEmail", { length: 255 }),
  authorName: varchar("authorName", { length: 255 }),
});

export const ai_pdf_notes = pgTable("ai_pdf_notes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  fileName: varchar("fileName", { length: 255 }),
  title: varchar("title", { length: 255 }),
  summary: text("summary"),
  mcqs: jsonb("mcqs").default([]),
  flashcards: jsonb("flashcards").default([]),
  timestamp: varchar("timestamp", { length: 100 }),
  userEmail: varchar("userEmail", { length: 255 }),
  subject: varchar("subject", { length: 100 }),
});

export const study_notes = pgTable("study_notes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  subject: varchar("subject", { length: 100 }),
  userEmail: varchar("userEmail", { length: 255 }),
  summaryPoints: jsonb("summaryPoints").default([]),
  tags: jsonb("tags").default([]),
  flashcards: jsonb("flashcards").default([]),
  timestamp: varchar("timestamp", { length: 100 }),
  attachmentUrl: text("attachmentUrl"),
});

export const system_settings = pgTable("system_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value"),
});

export const video_lectures = pgTable("video_lectures", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  uploadedBy: varchar("uploadedBy", { length: 255 }),
  timestamp: varchar("timestamp", { length: 100 }),
  subject: varchar("subject", { length: 255 }),
  comments: jsonb("comments").default([]),
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info"),
  timestamp: varchar("timestamp", { length: 100 }).notNull(),
  isRead: boolean("isRead").default(false),
  userEmail: varchar("userEmail", { length: 255 }),
});
