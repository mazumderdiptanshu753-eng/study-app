import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, "db.json");

// Default Local DB state
let localDB: any = {
  users: [],
  chatMessages: [],
  activityLogs: [],
  forumPosts: [],
  liveClasses: [],
  govtJobNotes: [],
  aiPdfNotes: [],
  studyNotes: [],
  videoLectures: [],
  notifications: [],
  settings: { maintenanceMode: false },
  systemSettings: {
    app_version: {
      latestVersion: "2.6.2",
      changelogEn: "Initial Release of Study Hub Portal with dynamic interactive animations.",
      changelogBn: "ইন্টারেক্টিভ অ্যানিমেশন সহ স্টাডি হাব পোর্টালের প্রথম রিলিজ।"
    }
  }
};

// Load local DB
function loadLocalDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8").trim();
      if (data) {
        const parsed = JSON.parse(data);
        localDB = { ...localDB, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load local db.json:", e);
    }
  }
}
loadLocalDB();

function saveLocalDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDB, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save local db.json:", e);
  }
}

// Pool initialization
let pool: pg.Pool | null = null;

const databaseUrl = process.env.DATABASE_URL;
const sqlHost = process.env.SQL_HOST;
const isPostgresActive = !!databaseUrl || !!sqlHost;

if (databaseUrl) {
  console.log("Found DATABASE_URL. Initializing database pool...");
  pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 15000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
  });
} else if (sqlHost) {
  console.log("Found Cloud SQL credentials. Initializing database pool...");
  pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
  });
} else {
  console.log("No PostgreSQL credentials found. Running with local db.json file database.");
}

export async function initDatabase(): Promise<boolean> {
  if (!pool) return false;
  
  let retries = 5;
  let delay = 2000;
  let client = null;
  
  while (retries > 0) {
    try {
      client = await pool.connect();
      console.log("Successfully connected to Neon PostgreSQL database!");
      break;
    } catch (err: any) {
      retries--;
      console.warn(`PostgreSQL connection attempt failed. Retries remaining: ${retries}. Error: ${err.message}`);
      if (retries === 0) {
        console.error("Failed to initialize PostgreSQL after 5 attempts. Keeping pool registered but falling back to local DB for this startup run if necessary.");
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  try {
    if (client) {
      client.release();
    }

    // Create tables
    console.log("Database initialized");
    
    // Auto-migrate local JSON database data to Neon PostgreSQL
    await migrateLocalDataToPostgres();
    
    return true;
  } catch (err: any) {
    console.error("Failed to setup tables in PostgreSQL:", err.message);
    return false;
  }
}

export async function migrateLocalDataToPostgres(): Promise<void> {
  if (!pool) return;
  try {
    console.log("Starting automatic migration from local db.json to Neon PostgreSQL...");

    // 1. Migrate Users
    const pgUsersCountRes = await pool.query("SELECT COUNT(*) FROM users");
    const pgUsersCount = parseInt(pgUsersCountRes.rows[0].count, 10);
    if (pgUsersCount === 0 && localDB.users && localDB.users.length > 0) {
      console.log(`Migrating ${localDB.users.length} users to Neon...`);
      for (const user of localDB.users) {
        if (!user.email) continue;
        await pool.query(`
          INSERT INTO users (email, "fullName", grade, "preferredSubject", "registeredAt", "avatarUrl", role, "isSuspended")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (email) DO NOTHING
        `, [
          user.email.trim().toLowerCase(),
          user.fullName || '',
          user.grade || '',
          user.preferredSubject || '',
          user.registeredAt || new Date().toISOString(),
          user.avatarUrl || '',
          user.role || 'Student',
          user.isSuspended || false
        ]);
      }
    }

    // 2. Migrate Chat Messages
    const pgChatCountRes = await pool.query("SELECT COUNT(*) FROM chat_messages");
    const pgChatCount = parseInt(pgChatCountRes.rows[0].count, 10);
    if (pgChatCount === 0 && localDB.chatMessages && localDB.chatMessages.length > 0) {
      console.log(`Migrating ${localDB.chatMessages.length} chat messages to Neon...`);
      for (const msg of localDB.chatMessages) {
        if (!msg.id) continue;
        await pool.query(`
          INSERT INTO chat_messages (id, "senderName", "senderEmail", "senderRole", message, timestamp, "studentEmail", "studentName")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          msg.id,
          msg.senderName || '',
          msg.senderEmail || '',
          msg.senderRole || '',
          msg.message || '',
          msg.timestamp || new Date().toISOString(),
          msg.studentEmail || '',
          msg.studentName || ''
        ]);
      }
    }

    // 3. Migrate Forum Posts
    const pgForumCountRes = await pool.query("SELECT COUNT(*) FROM forum_posts");
    const pgForumCount = parseInt(pgForumCountRes.rows[0].count, 10);
    if (pgForumCount === 0 && localDB.forumPosts && localDB.forumPosts.length > 0) {
      console.log(`Migrating ${localDB.forumPosts.length} forum posts to Neon...`);
      for (const post of localDB.forumPosts) {
        if (!post.id) continue;
        await pool.query(`
          INSERT INTO forum_posts (id, "authorEmail", "authorName", title, content, timestamp, likes, replies)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          post.id,
          post.authorEmail || '',
          post.authorName || '',
          post.title || '',
          post.content || '',
          post.timestamp || new Date().toISOString(),
          post.likes || 0,
          JSON.stringify(post.replies || [])
        ]);
      }
    }

    // 4. Migrate Live Classes
    const pgLiveClassesCountRes = await pool.query("SELECT COUNT(*) FROM live_classes");
    const pgLiveClassesCount = parseInt(pgLiveClassesCountRes.rows[0].count, 10);
    if (pgLiveClassesCount === 0 && localDB.liveClasses && localDB.liveClasses.length > 0) {
      console.log(`Migrating ${localDB.liveClasses.length} live classes to Neon...`);
      for (const cls of localDB.liveClasses) {
        if (!cls.id) continue;
        await pool.query(`
          INSERT INTO live_classes (id, title, subject, instructor, "scheduledTime", link, status, "createdAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          cls.id,
          cls.title || '',
          cls.subject || '',
          cls.instructor || '',
          cls.scheduledTime || '',
          cls.link || '',
          cls.status || 'Scheduled',
          cls.createdAt || new Date().toISOString()
        ]);
      }
    }

    // 5. Migrate Activity Logs
    const pgLogsCountRes = await pool.query("SELECT COUNT(*) FROM activity_logs");
    const pgLogsCount = parseInt(pgLogsCountRes.rows[0].count, 10);
    if (pgLogsCount === 0 && localDB.activityLogs && localDB.activityLogs.length > 0) {
      console.log(`Migrating ${localDB.activityLogs.length} activity logs to Neon...`);
      for (const log of localDB.activityLogs) {
        if (!log.id) continue;
        await pool.query(`
          INSERT INTO activity_logs (id, "userEmail", "userName", action, timestamp, details)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          log.id,
          log.userEmail || '',
          log.userName || '',
          log.action || '',
          log.timestamp || new Date().toISOString(),
          log.details || ''
        ]);
      }
    }

    // 6. Migrate Govt Job Notes
    const pgNotesCountRes = await pool.query("SELECT COUNT(*) FROM govt_job_notes");
    const pgNotesCount = parseInt(pgNotesCountRes.rows[0].count, 10);
    if (pgNotesCount === 0 && localDB.govtJobNotes && localDB.govtJobNotes.length > 0) {
      console.log(`Migrating ${localDB.govtJobNotes.length} govt job notes to Neon...`);
      for (const note of localDB.govtJobNotes) {
        if (!note.id) continue;
        await pool.query(`
          INSERT INTO govt_job_notes (id, title, content, subject, timestamp, comments, "authorEmail", "authorName")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          note.id,
          note.title || '',
          note.content || '',
          note.subject || '',
          note.timestamp || new Date().toISOString(),
          JSON.stringify(note.comments || []),
          note.authorEmail || '',
          note.authorName || ''
        ]);
      }
    }

    // 7. Migrate AI PDF Notes
    const pgPdfCountRes = await pool.query("SELECT COUNT(*) FROM ai_pdf_notes");
    const pgPdfCount = parseInt(pgPdfCountRes.rows[0].count, 10);
    if (pgPdfCount === 0 && localDB.aiPdfNotes && localDB.aiPdfNotes.length > 0) {
      console.log(`Migrating ${localDB.aiPdfNotes.length} AI PDF notes to Neon...`);
      for (const note of localDB.aiPdfNotes) {
        if (!note.id) continue;
        const summaryPayload = JSON.stringify({
          introduction: note.introduction || "",
          keyTopics: note.keyTopics || [],
          theoryContent: note.theoryContent || note.summary || "",
          month: note.month || ""
        });
        await pool.query(`
          INSERT INTO ai_pdf_notes (id, "fileName", title, summary, mcqs, flashcards, timestamp, "userEmail", subject)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING
        `, [
          note.id,
          note.fileName || "",
          note.title || "",
          summaryPayload,
          JSON.stringify(note.mcqs || []),
          JSON.stringify(note.flashcards || []),
          note.timestamp || new Date().toISOString(),
          note.userEmail || "",
          note.subject || ""
        ]);
      }
    }

    // 8. Migrate Study Notes
    const pgStudyNotesCountRes = await pool.query("SELECT COUNT(*) FROM study_notes");
    const pgStudyNotesCount = parseInt(pgStudyNotesCountRes.rows[0].count, 10);
    if (pgStudyNotesCount === 0 && localDB.studyNotes && localDB.studyNotes.length > 0) {
      console.log(`Migrating ${localDB.studyNotes.length} study notes to Neon...`);
      for (const note of localDB.studyNotes) {
        if (!note.id) continue;
        await pool.query(`
          INSERT INTO study_notes (
            id, title, content, subject, "userEmail", "summaryPoints", tags, flashcards, timestamp, "attachmentUrl", "attachmentName", "attachmentType"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING
        `, [
          note.id,
          note.title || '',
          note.content || '',
          note.subject || '',
          (note.userEmail || '').trim().toLowerCase(),
          JSON.stringify(note.summaryPoints || []),
          JSON.stringify(note.tags || []),
          JSON.stringify(note.flashcards || []),
          note.timestamp || new Date().toISOString(),
          note.attachmentUrl || null,
          note.attachmentName || null,
          note.attachmentType || 'none'
        ]);
      }
    }

    console.log("Local data migration to Neon PostgreSQL completed successfully!");
  } catch (err: any) {
    console.error("Error migrating local data to Neon PostgreSQL:", err.message);
  }
}

// --- Users Database Queries ---
export async function getUsers(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM users');
      if (res.rows && res.rows.length > 0) {
        localDB.users = res.rows;
        saveLocalDB();
      }
      return res.rows;
    } catch (e) {
      console.error("Error fetching users from PG, falling back to local cache:", e);
    }
  }
  return localDB.users || [];
}

export async function saveUser(user: any): Promise<any[]> {
  const existing = localDB.users.find((u: any) => (u.email || '').trim().toLowerCase() === (user.email || '').trim().toLowerCase());
  if (existing) {
    Object.assign(existing, user);
  } else {
    localDB.users.push(user);
  }
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO users (email, "fullName", grade, "preferredSubject", "registeredAt", "avatarUrl", role, "isSuspended")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) 
        DO UPDATE SET 
          "fullName" = EXCLUDED."fullName",
          grade = EXCLUDED.grade,
          "preferredSubject" = EXCLUDED."preferredSubject",
          "registeredAt" = EXCLUDED."registeredAt",
          "avatarUrl" = EXCLUDED."avatarUrl",
          role = EXCLUDED.role,
          "isSuspended" = EXCLUDED."isSuspended"
      `, [
        user.email.trim().toLowerCase(),
        user.fullName || '',
        user.grade || '',
        user.preferredSubject || '',
        user.registeredAt || new Date().toISOString(),
        user.avatarUrl || '',
        user.role || 'Student',
        user.isSuspended || false
      ]);
    } catch (e) {
      console.error("Error saving user to PG, but local backup saved:", e);
    }
  }
  return localDB.users;
}

export async function deleteUser(email: string): Promise<boolean> {
  const len = localDB.users.length;
  localDB.users = localDB.users.filter((u: any) => u.email.trim().toLowerCase() !== email.trim().toLowerCase());
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    } catch (e) {
      console.error("Error deleting user from PG, but local backup updated:", e);
    }
  }
  return localDB.users.length < len;
}

export async function getUserByEmail(email: string): Promise<any | null> {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.error("Error fetching user by email from PG:", e);
    }
  }
  return (localDB.users || []).find((u: any) => (u.email || '').trim().toLowerCase() === normalizedEmail) || null;
}

// --- Chat Messages Database Queries ---
export async function getChatMessages(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM chat_messages');
      if (res.rows && res.rows.length > 0) {
        localDB.chatMessages = res.rows;
        saveLocalDB();
      }
      return res.rows;
    } catch (e) {
      console.error("Error fetching chat messages from PG, falling back to local cache:", e);
    }
  }
  return localDB.chatMessages || [];
}

export async function saveChatMessage(msg: any): Promise<any> {
  if (!localDB.chatMessages) localDB.chatMessages = [];
  localDB.chatMessages.push(msg);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO chat_messages (id, "senderName", "senderEmail", "senderRole", message, timestamp, "studentEmail", "studentName")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [
        msg.id,
        msg.senderName,
        msg.senderEmail,
        msg.senderRole,
        msg.message,
        msg.timestamp,
        msg.studentEmail,
        msg.studentName
      ]);
    } catch (e) {
      console.error("Error saving chat message to PG, but local backup saved:", e);
    }
  }
  return msg;
}

// --- Forum Posts Database Queries ---
export async function getForumPosts(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM forum_posts');
      const posts = res.rows.map(row => ({
        ...row,
        replies: typeof row.replies === 'string' ? JSON.parse(row.replies) : (row.replies || [])
      }));
      if (posts && posts.length > 0) {
        localDB.forumPosts = posts;
        saveLocalDB();
      }
      return posts;
    } catch (e) {
      console.error("Error fetching forum posts from PG, falling back to local cache:", e);
    }
  }
  return localDB.forumPosts || [];
}

export async function saveForumPost(post: any): Promise<any> {
  if (!localDB.forumPosts) localDB.forumPosts = [];
  const idx = localDB.forumPosts.findIndex((p: any) => p.id === post.id);
  if (idx > -1) {
    localDB.forumPosts[idx] = post;
  } else {
    localDB.forumPosts.push(post);
  }
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO forum_posts (id, "authorEmail", "authorName", title, content, timestamp, likes, replies)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          likes = EXCLUDED.likes,
          replies = EXCLUDED.replies
      `, [
        post.id,
        post.authorEmail,
        post.authorName,
        post.title,
        post.content,
        post.timestamp,
        post.likes || 0,
        JSON.stringify(post.replies || [])
      ]);
    } catch (e) {
      console.error("Error saving forum post to PG, but local backup saved:", e);
    }
  }
  return post;
}

export async function addForumReply(postId: string, reply: any): Promise<any> {
  if (!localDB.forumPosts) localDB.forumPosts = [];
  const post = localDB.forumPosts.find((p: any) => p.id === postId);
  if (post) {
    if (!post.replies) post.replies = [];
    post.replies.push(reply);
    saveLocalDB();
  }

  if (pool) {
    try {
      const res = await pool.query('SELECT replies FROM forum_posts WHERE id = $1', [postId]);
      if (res.rows.length > 0) {
        const replies = Array.isArray(res.rows[0].replies) ? res.rows[0].replies : JSON.parse(res.rows[0].replies || '[]');
        replies.push(reply);
        await pool.query('UPDATE forum_posts SET replies = $1 WHERE id = $2', [JSON.stringify(replies), postId]);
      }
    } catch (e) {
      console.error("Error adding forum reply to PG, but local backup saved:", e);
    }
  }
  return reply;
}

// --- Live Classes Database Queries ---
export async function getLiveClasses(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM live_classes');
      if (res.rows && res.rows.length > 0) {
        localDB.liveClasses = res.rows;
        saveLocalDB();
      }
      return res.rows;
    } catch (e) {
      console.error("Error fetching live classes from PG, falling back to local cache:", e);
    }
  }
  return localDB.liveClasses || [];
}

export async function saveLiveClass(cls: any): Promise<any> {
  if (!localDB.liveClasses) localDB.liveClasses = [];
  const idx = localDB.liveClasses.findIndex((c: any) => c.id === cls.id);
  if (idx > -1) {
    localDB.liveClasses[idx] = cls;
  } else {
    localDB.liveClasses.push(cls);
  }
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO live_classes (id, title, subject, instructor, "scheduledTime", link, status, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subject = EXCLUDED.subject,
          instructor = EXCLUDED.instructor,
          "scheduledTime" = EXCLUDED."scheduledTime",
          link = EXCLUDED.link,
          status = EXCLUDED.status
      `, [
        cls.id,
        cls.title,
        cls.subject,
        cls.instructor,
        cls.scheduledTime,
        cls.link,
        cls.status || 'Scheduled',
        cls.createdAt
      ]);
    } catch (e) {
      console.error("Error saving live class to PG, but local backup saved:", e);
    }
  }
  return cls;
}

export async function updateLiveClassStatus(id: string, status: string): Promise<any> {
  let updatedCls = null;
  if (!localDB.liveClasses) localDB.liveClasses = [];
  const cls = localDB.liveClasses.find((c: any) => c.id === id);
  if (cls) {
    cls.status = status;
    saveLocalDB();
    updatedCls = cls;
  }

  if (pool) {
    try {
      const res = await pool.query(`
        UPDATE live_classes 
        SET status = $1 
        WHERE id = $2 
        RETURNING *
      `, [status, id]);
      if (res.rows.length > 0) {
        updatedCls = res.rows[0];
      }
    } catch (e) {
      console.error("Error updating live class status in PG, but local backup updated:", e);
    }
  }
  return updatedCls;
}

export async function deleteLiveClass(id: string): Promise<boolean> {
  const len = (localDB.liveClasses || []).length;
  localDB.liveClasses = (localDB.liveClasses || []).filter((c: any) => c.id !== id);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM live_classes WHERE id = $1', [id]);
    } catch (e) {
      console.error("Error deleting live class from PG, but local backup updated:", e);
    }
  }
  return (localDB.liveClasses || []).length < len;
}

// --- Activity Logs Database Queries ---
export async function getActivityLogs(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM activity_logs');
      if (res.rows && res.rows.length > 0) {
        localDB.activityLogs = res.rows;
        saveLocalDB();
      }
      return res.rows;
    } catch (e) {
      console.error("Error fetching activity logs from PG, falling back to local cache:", e);
    }
  }
  return localDB.activityLogs || [];
}

export async function saveActivityLog(log: any): Promise<any> {
  if (!localDB.activityLogs) localDB.activityLogs = [];
  localDB.activityLogs.unshift(log);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO activity_logs (id, "userEmail", "userName", action, timestamp, details)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        log.id,
        log.userEmail,
        log.userName || '',
        log.action,
        log.timestamp,
        log.details || ''
      ]);
    } catch (e) {
      console.error("Error saving activity log to PG, but local backup saved:", e);
    }
  }
  return log;
}

// --- Govt Job Notes Database Queries ---
export async function getGovtJobNotes(subject?: string): Promise<any[]> {
  if (pool) {
    try {
      let queryStr = 'SELECT * FROM govt_job_notes';
      const params: any[] = [];
      if (subject) {
        queryStr += ' WHERE subject = $1';
        params.push(subject);
      }
      const res = await pool.query(queryStr, params);
      const mapped = res.rows.map(row => ({
        ...row,
        comments: typeof row.comments === 'string' ? JSON.parse(row.comments) : (row.comments || [])
      }));
      if (mapped && mapped.length > 0) {
        const allRes = await pool.query('SELECT * FROM govt_job_notes');
        localDB.govtJobNotes = allRes.rows.map(row => ({
          ...row,
          comments: typeof row.comments === 'string' ? JSON.parse(row.comments) : (row.comments || [])
        }));
        saveLocalDB();
      }
      return mapped;
    } catch (e) {
      console.error("Error fetching govt job notes from PG, falling back to local cache:", e);
    }
  }
  let notes = localDB.govtJobNotes || [];
  if (subject) {
    notes = notes.filter((n: any) => n.subject === subject);
  }
  return notes;
}

export async function saveGovtJobNote(note: any): Promise<any> {
  if (!localDB.govtJobNotes) localDB.govtJobNotes = [];
  const idx = localDB.govtJobNotes.findIndex((n: any) => n.id === note.id);
  if (idx > -1) {
    localDB.govtJobNotes[idx] = note;
  } else {
    localDB.govtJobNotes.push(note);
  }
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO govt_job_notes (id, title, content, subject, timestamp, comments, "authorEmail", "authorName")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          subject = EXCLUDED.subject,
          comments = EXCLUDED.comments
      `, [
        note.id,
        note.title,
        note.content,
        note.subject,
        note.timestamp,
        JSON.stringify(note.comments || []),
        note.authorEmail,
        note.authorName
      ]);
    } catch (e) {
      console.error("Error saving govt job note to PG, but local backup saved:", e);
    }
  }
  return note;
}

export async function addGovtJobNoteComment(noteId: string, comment: any): Promise<any> {
  if (!localDB.govtJobNotes) localDB.govtJobNotes = [];
  const note = localDB.govtJobNotes.find((n: any) => n.id === noteId);
  if (note) {
    if (!note.comments) note.comments = [];
    note.comments.push(comment);
    saveLocalDB();
  }

  if (pool) {
    try {
      const res = await pool.query('SELECT comments FROM govt_job_notes WHERE id = $1', [noteId]);
      if (res.rows.length > 0) {
        const comments = Array.isArray(res.rows[0].comments) ? res.rows[0].comments : JSON.parse(res.rows[0].comments || '[]');
        comments.push(comment);
        await pool.query('UPDATE govt_job_notes SET comments = $1 WHERE id = $2', [JSON.stringify(comments), noteId]);
      }
    } catch (e) {
      console.error("Error adding comment to govt job note in PG, but local backup saved:", e);
    }
  }
  return comment;
}

export async function deleteGovtJobNote(id: string): Promise<boolean> {
  const len = (localDB.govtJobNotes || []).length;
  localDB.govtJobNotes = (localDB.govtJobNotes || []).filter((n: any) => n.id !== id);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM govt_job_notes WHERE id = $1', [id]);
    } catch (e) {
      console.error("Error deleting govt job note from PG, but local backup updated:", e);
    }
  }
  return (localDB.govtJobNotes || []).length < len;
}

// --- AI PDF Notes Database Queries ---
export async function getAiPdfNotes(subject?: string): Promise<any[]> {
  if (pool) {
    try {
      let queryStr = 'SELECT * FROM ai_pdf_notes';
      const params: any[] = [];
      if (subject) {
        queryStr += ' WHERE subject = $1';
        params.push(subject);
      }
      const res = await pool.query(queryStr, params);
      const mapped = res.rows.map(row => {
        let noteData: any = {};
        try {
          if (row.summary && row.summary.trim().startsWith('{')) {
            noteData = JSON.parse(row.summary);
          }
        } catch (e) {
          // ignore
        }
        return {
          id: row.id,
          subject: row.subject,
          title: row.title,
          timestamp: row.timestamp,
          mcqs: typeof row.mcqs === 'string' ? JSON.parse(row.mcqs) : (row.mcqs || []),
          introduction: noteData.introduction || "",
          keyTopics: noteData.keyTopics || [],
          theoryContent: noteData.theoryContent || row.summary || "",
          month: noteData.month || "",
          flashcards: typeof row.flashcards === 'string' ? JSON.parse(row.flashcards) : (row.flashcards || [])
        };
      });

      if (mapped && mapped.length > 0) {
        const allRes = await pool.query('SELECT * FROM ai_pdf_notes');
        localDB.aiPdfNotes = allRes.rows.map(row => {
          let noteData: any = {};
          try {
            if (row.summary && row.summary.trim().startsWith('{')) {
              noteData = JSON.parse(row.summary);
            }
          } catch (e) {
            // ignore
          }
          return {
            id: row.id,
            subject: row.subject,
            title: row.title,
            timestamp: row.timestamp,
            mcqs: typeof row.mcqs === 'string' ? JSON.parse(row.mcqs) : (row.mcqs || []),
            introduction: noteData.introduction || "",
            keyTopics: noteData.keyTopics || [],
            theoryContent: noteData.theoryContent || row.summary || "",
            month: noteData.month || "",
            flashcards: typeof row.flashcards === 'string' ? JSON.parse(row.flashcards) : (row.flashcards || [])
          };
        });
        saveLocalDB();
      }
      return mapped;
    } catch (e) {
      console.error("Error fetching AI PDF notes from PG, falling back to local cache:", e);
    }
  }
  let notes = localDB.aiPdfNotes || [];
  if (subject) {
    notes = notes.filter((n: any) => n.subject === subject);
  }
  return notes;
}

export async function saveAiPdfNote(note: any): Promise<any> {
  if (!localDB.aiPdfNotes) localDB.aiPdfNotes = [];
  const idx = localDB.aiPdfNotes.findIndex((n: any) => n.id === note.id);
  if (idx > -1) {
    localDB.aiPdfNotes[idx] = note;
  } else {
    localDB.aiPdfNotes.push(note);
  }
  saveLocalDB();

  if (pool) {
    try {
      const summaryPayload = JSON.stringify({
        introduction: note.introduction || "",
        keyTopics: note.keyTopics || [],
        theoryContent: note.theoryContent || "",
        month: note.month || ""
      });
      await pool.query(`
        INSERT INTO ai_pdf_notes (id, "fileName", title, summary, mcqs, flashcards, timestamp, "userEmail", subject)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          mcqs = EXCLUDED.mcqs,
          flashcards = EXCLUDED.flashcards,
          subject = EXCLUDED.subject
      `, [
        note.id,
        note.fileName || "",
        note.title,
        summaryPayload,
        JSON.stringify(note.mcqs || []),
        JSON.stringify(note.flashcards || []),
        note.timestamp,
        note.userEmail || "",
        note.subject || ''
      ]);
    } catch (e) {
      console.error("Error saving AI PDF note to PG, but local backup saved:", e);
    }
  }
  return note;
}

export async function deleteAiPdfNote(id: string): Promise<boolean> {
  const len = (localDB.aiPdfNotes || []).length;
  localDB.aiPdfNotes = (localDB.aiPdfNotes || []).filter(n => n.id !== id);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM ai_pdf_notes WHERE id = $1', [id]);
    } catch (e) {
      console.error("Error deleting AI PDF note from PG, but local backup updated:", e);
    }
  }
  return (localDB.aiPdfNotes || []).length < len;
}

export async function getAiPdfNotesCount(): Promise<number> {
  if (pool) {
    try {
      const res = await pool.query('SELECT COUNT(*) FROM ai_pdf_notes');
      return parseInt(res.rows[0].count, 10);
    } catch (e) {
      console.error("Error counting AI PDF notes in PG, falling back:", e);
    }
  }
  return (localDB.aiPdfNotes || []).length;
}

export async function seedAiPdfNotes(seedData: any[]): Promise<any[]> {
  localDB.aiPdfNotes = seedData;
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM ai_pdf_notes');
      for (const note of seedData) {
        await saveAiPdfNote(note);
      }
    } catch (e) {
      console.error("Error seeding AI PDF notes in PG, but local backup saved:", e);
    }
  }
  return seedData;
}

// --- Personal Study Notes Queries ---
export async function getStudyNotes(userEmail: string): Promise<any[]> {
  const normEmail = userEmail.trim().toLowerCase();
  if (pool) {
    try {
      const res = await pool.query(
        'SELECT * FROM study_notes WHERE "userEmail" = $1 ORDER BY timestamp DESC',
        [normEmail]
      );
      const mapped = res.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        subject: row.subject,
        summaryPoints: row.summaryPoints || [],
        tags: row.tags || [],
        flashcards: row.flashcards || [],
        timestamp: row.timestamp,
        attachmentUrl: row.attachmentUrl,
        attachmentName: row.attachmentName,
        attachmentType: row.attachmentType,
        userEmail: row.userEmail
      }));
      if (mapped && mapped.length > 0) {
        if (!localDB.studyNotes) localDB.studyNotes = [];
        localDB.studyNotes = localDB.studyNotes.filter((n: any) => (n.userEmail || '').trim().toLowerCase() !== normEmail);
        localDB.studyNotes.push(...mapped);
        saveLocalDB();
      }
      return mapped;
    } catch (e) {
      console.error("Error getting study notes from PG, falling back to local cache:", e);
    }
  }
  let notes = localDB.studyNotes || [];
  return notes.filter((n: any) => (n.userEmail || '').trim().toLowerCase() === normEmail);
}

export async function saveStudyNote(note: any): Promise<any> {
  const email = (note.userEmail || '').trim().toLowerCase();
  if (!localDB.studyNotes) localDB.studyNotes = [];
  const idx = localDB.studyNotes.findIndex((n: any) => n.id === note.id);
  if (idx > -1) {
    localDB.studyNotes[idx] = note;
  } else {
    localDB.studyNotes.push(note);
  }
  saveLocalDB();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO study_notes (
          id, title, content, subject, "userEmail", "summaryPoints", tags, flashcards, timestamp, "attachmentUrl", "attachmentName", "attachmentType"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          subject = EXCLUDED.subject,
          "summaryPoints" = EXCLUDED."summaryPoints",
          tags = EXCLUDED.tags,
          flashcards = EXCLUDED.flashcards,
          timestamp = EXCLUDED.timestamp,
          "attachmentUrl" = EXCLUDED."attachmentUrl",
          "attachmentName" = EXCLUDED."attachmentName",
          "attachmentType" = EXCLUDED."attachmentType",
          "userEmail" = EXCLUDED."userEmail"
      `, [
        note.id,
        note.title || '',
        note.content || '',
        note.subject || '',
        email,
        JSON.stringify(note.summaryPoints || []),
        JSON.stringify(note.tags || []),
        JSON.stringify(note.flashcards || []),
        note.timestamp || new Date().toISOString(),
        note.attachmentUrl || null,
        note.attachmentName || null,
        note.attachmentType || 'none'
      ]);
    } catch (e) {
      console.error("Error saving study note to PG, but local backup saved:", e);
    }
  }
  return note;
}

export async function deleteStudyNote(id: string): Promise<boolean> {
  const len = (localDB.studyNotes || []).length;
  localDB.studyNotes = (localDB.studyNotes || []).filter((n: any) => n.id !== id);
  saveLocalDB();

  if (pool) {
    try {
      await pool.query('DELETE FROM study_notes WHERE id = $1', [id]);
    } catch (e) {
      console.error("Error deleting study note from PG, but local backup updated:", e);
    }
  }
  return (localDB.studyNotes || []).length < len;
}

export async function getAppVersion(): Promise<any> {
  if (pool) {
    try {
      const res = await pool.query("SELECT value FROM system_settings WHERE key = $1", ["app_version"]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
    } catch (e) {
      console.error("Error fetching app version from PG, falling back:", e);
    }
  }
  if (!localDB.systemSettings) {
    localDB.systemSettings = {};
  }
  if (!localDB.systemSettings.app_version) {
    localDB.systemSettings.app_version = {
      latestVersion: "2.6.2",
      changelogEn: "Initial Release of Study Hub Portal with dynamic interactive animations.",
      changelogBn: "ইন্টারেক্টিভ অ্যানিমেশন সহ স্টাডি হাব পোর্টালের প্রথম রিলিজ।"
    };
  }
  return localDB.systemSettings.app_version;
}

export async function saveAppVersion(versionInfo: any): Promise<any> {
  if (pool) {
    try {
      await pool.query(`
        INSERT INTO system_settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, ["app_version", JSON.stringify(versionInfo)]);
      return versionInfo;
    } catch (e) {
      console.error("Error saving app version to PG, falling back:", e);
    }
  }
  if (!localDB.systemSettings) {
    localDB.systemSettings = {};
  }
  localDB.systemSettings.app_version = versionInfo;
  saveLocalDB();
  return versionInfo;
}

// --- Video Lectures Database Queries ---
export async function getVideoLectures(): Promise<any[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM video_lectures ORDER BY timestamp DESC');
      return res.rows;
    } catch (e) {
      console.error("Error fetching video lectures from PG:", e);
    }
  }
  return localDB.videoLectures || [];
}

export async function saveVideoLecture(video: any): Promise<any> {
  if (pool) {
    try {
      await pool.query(`
        INSERT INTO video_lectures (id, title, description, "videoUrl", "uploadedBy", timestamp, subject, comments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          "videoUrl" = EXCLUDED."videoUrl",
          "uploadedBy" = EXCLUDED."uploadedBy",
          timestamp = EXCLUDED.timestamp,
          subject = EXCLUDED.subject,
          comments = EXCLUDED.comments
      `, [
        video.id,
        video.title || '',
        video.description || '',
        video.videoUrl || '',
        video.uploadedBy || '',
        video.timestamp || new Date().toISOString(),
        video.subject || '',
        JSON.stringify(video.comments || [])
      ]);
      return video;
    } catch (e) {
      console.error("Error saving video lecture to PG:", e);
    }
  }
  if (!localDB.videoLectures) localDB.videoLectures = [];
  const idx = localDB.videoLectures.findIndex((v: any) => v.id === video.id);
  if (idx > -1) {
    localDB.videoLectures[idx] = video;
  } else {
    localDB.videoLectures.push(video);
  }
  saveLocalDB();
  return video;
}

export async function deleteVideoLecture(id: string): Promise<boolean> {
  if (pool) {
    try {
      await pool.query('DELETE FROM video_lectures WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("Error deleting video lecture from PG:", e);
    }
  }
  const len = (localDB.videoLectures || []).length;
  localDB.videoLectures = (localDB.videoLectures || []).filter((v: any) => v.id !== id);
  saveLocalDB();
  return (localDB.videoLectures || []).length < len;
}

// --- Notifications Database Queries ---
export async function getNotifications(userEmail?: string): Promise<any[]> {
  if (pool) {
    try {
      let query = 'SELECT * FROM notifications';
      let params: any[] = [];
      if (userEmail) {
        query += ' WHERE "userEmail" IS NULL OR "userEmail" = $1';
        params.push(userEmail.trim().toLowerCase());
      } else {
        query += ' WHERE "userEmail" IS NULL';
      }
      query += ' ORDER BY timestamp DESC';
      const res = await pool.query(query, params);
      return res.rows;
    } catch (e) {
      console.error("Error fetching notifications from PG:", e);
      return [];
    }
  }
  const all = localDB.notifications || [];
  if (userEmail) {
    const norm = userEmail.trim().toLowerCase();
    return all.filter((n: any) => !n.userEmail || n.userEmail.trim().toLowerCase() === norm)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  return all.filter((n: any) => !n.userEmail)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function createNotification(notification: any): Promise<any> {
  if (!notification.id) {
    notification.id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  if (!notification.timestamp) {
    notification.timestamp = new Date().toISOString();
  }
  if (notification.isRead === undefined) {
    notification.isRead = false;
  }

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO notifications (id, title, message, type, timestamp, "isRead", "userEmail")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          message = EXCLUDED.message,
          type = EXCLUDED.type,
          timestamp = EXCLUDED.timestamp,
          "isRead" = EXCLUDED."isRead",
          "userEmail" = EXCLUDED."userEmail"
      `, [
        notification.id,
        notification.title || '',
        notification.message || '',
        notification.type || 'info',
        notification.timestamp,
        notification.isRead,
        notification.userEmail ? notification.userEmail.trim().toLowerCase() : null
      ]);
      return notification;
    } catch (e) {
      console.error("Error creating notification in PG:", e);
    }
  }
  if (!localDB.notifications) localDB.notifications = [];
  const idx = localDB.notifications.findIndex((n: any) => n.id === notification.id);
  if (idx > -1) {
    localDB.notifications[idx] = notification;
  } else {
    localDB.notifications.push(notification);
  }
  saveLocalDB();
  return notification;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (pool) {
    try {
      await pool.query('UPDATE notifications SET "isRead" = TRUE WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("Error marking notification as read in PG:", e);
    }
  }
  if (!localDB.notifications) localDB.notifications = [];
  const notif = localDB.notifications.find((n: any) => n.id === id);
  if (notif) {
    notif.isRead = true;
    saveLocalDB();
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userEmail?: string): Promise<boolean> {
  if (pool) {
    try {
      let query = 'UPDATE notifications SET "isRead" = TRUE';
      let params: any[] = [];
      if (userEmail) {
        query += ' WHERE "userEmail" IS NULL OR "userEmail" = $1';
        params.push(userEmail.trim().toLowerCase());
      } else {
        query += ' WHERE "userEmail" IS NULL';
      }
      await pool.query(query, params);
      return true;
    } catch (e) {
      console.error("Error marking all notifications as read in PG:", e);
    }
  }
  if (!localDB.notifications) localDB.notifications = [];
  localDB.notifications.forEach((n: any) => {
    if (!userEmail || !n.userEmail || n.userEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
      n.isRead = true;
    }
  });
  saveLocalDB();
  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  if (pool) {
    try {
      await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
      return true;
    } catch (e) {
      console.error("Error deleting notification from PG:", e);
    }
  }
  const len = (localDB.notifications || []).length;
  localDB.notifications = (localDB.notifications || []).filter((n: any) => n.id !== id);
  saveLocalDB();
  return (localDB.notifications || []).length < len;
}



export async function getSettings(): Promise<any> {
  if (pool) {
    try {
      const res = await pool.query("SELECT value FROM system_settings WHERE key = 'maintenanceMode'");
      if (res.rows.length > 0) {
        return { maintenanceMode: res.rows[0].value === true || res.rows[0].value === 'true' };
      }
      return { maintenanceMode: false };
    } catch (e) {
      console.error("Error fetching settings from PG", e);
    }
  }
  return localDB.settings || { maintenanceMode: false };
}

export async function updateSettings(newSettings: any): Promise<void> {
  localDB.settings = { ...(localDB.settings || {}), ...newSettings };
  saveLocalDB();
  if (pool) {
    try {
      if (newSettings.maintenanceMode !== undefined) {
         await pool.query(
           "INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
           ["maintenanceMode", JSON.stringify(newSettings.maintenanceMode)]
         );
      }
    } catch (e) {
      console.error("Error updating settings in PG", e);
    }
  }
}

export async function cleanDemoMessages() {
  localDB.chatMessages = localDB.chatMessages.filter(m => m.studentEmail !== 'demo@studyhub.com');
  saveLocalDB();
  if (pool) {
    try {
      await pool.query("DELETE FROM chat_messages WHERE \"studentEmail\" = 'demo@studyhub.com'");
    } catch(e) {}
  }
  return localDB.chatMessages.length;
}
