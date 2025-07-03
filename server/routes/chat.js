
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all chats
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const chats = db.prepare(`
      SELECT c.*, 
             COUNT(m.id) as message_count,
             MAX(m.timestamp) as last_message_at
      FROM chats c
      LEFT JOIN messages m ON c.id = m.chat_id
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `).all();
    
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Create new chat
router.post('/', (req, res) => {
  try {
    const { title } = req.body;
    const chatId = uuidv4();
    const db = req.app.locals.db;
    
    const stmt = db.prepare('INSERT INTO chats (id, title) VALUES (?, ?)');
    stmt.run(chatId, title || 'New Chat');
    
    const newChat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    res.json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get chat messages
router.get('/:chatId/messages', (req, res) => {
  try {
    const { chatId } = req.params;
    const db = req.app.locals.db;
    
    const messages = db.prepare(`
      SELECT m.*, 
             GROUP_CONCAT(
               json_object(
                 'filename', d.original_name,
                 'content', mc.chunk_text,
                 'relevance', mc.relevance_score
               )
             ) as context_json
      FROM messages m
      LEFT JOIN message_context mc ON m.id = mc.message_id
      LEFT JOIN documents d ON mc.document_id = d.id
      WHERE m.chat_id = ?
      GROUP BY m.id
      ORDER BY m.timestamp ASC
    `).all(chatId);
    
    // Parse context JSON
    const parsedMessages = messages.map(msg => ({
      ...msg,
      context: msg.context_json ? JSON.parse(`[${msg.context_json}]`) : []
    }));
    
    res.json(parsedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message and get AI response
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const db = req.app.locals.db;
    
    // Save user message
    const userMessageId = uuidv4();
    const userStmt = db.prepare('INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)');
    userStmt.run(userMessageId, chatId, 'user', content);
    
    // Update chat timestamp
    const updateChatStmt = db.prepare('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updateChatStmt.run(chatId);
    
    // TODO: Implement actual LLM integration with Ollama
    // For now, return a placeholder response
    const assistantMessageId = uuidv4();
    const assistantContent = `I understand you're asking about "${content}". This is a placeholder response. Once Ollama is configured, I'll be able to provide intelligent responses using your local LLM and retrieved document context.`;
    
    const assistantStmt = db.prepare('INSERT INTO messages (id, chat_id, role, content, tokens, processing_time) VALUES (?, ?, ?, ?, ?, ?)');
    assistantStmt.run(assistantMessageId, chatId, 'assistant', assistantContent, 150, 0.8);
    
    // Get the saved messages
    const userMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(userMessageId);
    const assistantMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(assistantMessageId);
    
    res.json({
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Delete chat
router.delete('/:chatId', (req, res) => {
  try {
    const { chatId } = req.params;
    const db = req.app.locals.db;
    
    const stmt = db.prepare('DELETE FROM chats WHERE id = ?');
    const result = stmt.run(chatId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;
