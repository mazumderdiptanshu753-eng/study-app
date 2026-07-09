const { Pool } = require('pg');
require('dotenv').config();

async function wipe() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await pool.query(`
      TRUNCATE TABLE 
        users, chat_messages, forum_posts, live_classes, activity_logs, 
        govt_job_notes, ai_pdf_notes, study_notes, system_settings, 
        video_lectures, notifications 
      CASCADE;
    `);
    console.log("Database wiped.");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
wipe();
