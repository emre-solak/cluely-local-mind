
function initializeDatabase(db) {
  console.log('🗄️ Initializing database...');

  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create chats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      tokens INTEGER,
      processing_time REAL,
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
    )
  `);

  // Create documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed BOOLEAN DEFAULT FALSE,
      processing_error TEXT
    )
  `);

  // Create document_embeddings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_embeddings (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      chunk_text TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      embedding_vector TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    )
  `);

  // Create message_context table (for storing which documents were used)
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_context (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      relevance_score REAL NOT NULL,
      chunk_text TEXT NOT NULL,
      FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
      FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    )
  `);

  // Create live_copilot_sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS live_copilot_sessions (
      id TEXT PRIMARY KEY,
      mode TEXT NOT NULL CHECK (mode IN ('live', 'periodic', 'off')),
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      total_suggestions INTEGER DEFAULT 0
    )
  `);

  // Create live_suggestions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS live_suggestions (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      suggestion_text TEXT NOT NULL,
      suggestion_type TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES live_copilot_sessions (id) ON DELETE CASCADE
    )
  `);

  // Create transcript_entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transcript_entries (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      speaker TEXT NOT NULL CHECK (speaker IN ('user', 'other')),
      text TEXT NOT NULL,
      confidence REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES live_copilot_sessions (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages (chat_id);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages (timestamp);
    CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings (document_id);
    CREATE INDEX IF NOT EXISTS idx_message_context_message_id ON message_context (message_id);
    CREATE INDEX IF NOT EXISTS idx_live_suggestions_session_id ON live_suggestions (session_id);
    CREATE INDEX IF NOT EXISTS idx_transcript_entries_session_id ON transcript_entries (session_id);
  `);

  console.log('✅ Database initialized successfully');
}

module.exports = { initializeDatabase };
