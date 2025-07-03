
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Set observation mode
router.post('/mode/:mode', (req, res) => {
  try {
    const { mode } = req.params;
    const db = req.app.locals.db;
    
    if (!['live', 'periodic', 'off'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode. Must be live, periodic, or off' });
    }
    
    // End any active sessions
    const endActiveStmt = db.prepare('UPDATE live_copilot_sessions SET ended_at = CURRENT_TIMESTAMP WHERE ended_at IS NULL');
    endActiveStmt.run();
    
    // Create new session if not turning off
    if (mode !== 'off') {
      const sessionId = uuidv4();
      const createSessionStmt = db.prepare('INSERT INTO live_copilot_sessions (id, mode) VALUES (?, ?)');
      createSessionStmt.run(sessionId, mode);
      
      res.json({ success: true, sessionId, mode });
    } else {
      res.json({ success: true, mode });
    }
  } catch (error) {
    console.error('Error setting copilot mode:', error);
    res.status(500).json({ error: 'Failed to set copilot mode' });
  }
});

// Get current session
router.get('/session', (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const activeSession = db.prepare(`
      SELECT * FROM live_copilot_sessions 
      WHERE ended_at IS NULL 
      ORDER BY started_at DESC 
      LIMIT 1
    `).get();
    
    res.json(activeSession || { mode: 'off' });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Add transcript entry
router.post('/transcript', (req, res) => {
  try {
    const { sessionId, speaker, text, confidence } = req.body;
    const db = req.app.locals.db;
    
    if (!sessionId || !speaker || !text) {
      return res.status(400).json({ error: 'sessionId, speaker, and text are required' });
    }
    
    const entryId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO transcript_entries (id, session_id, speaker, text, confidence)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(entryId, sessionId, speaker, text, confidence || null);
    
    const newEntry = db.prepare('SELECT * FROM transcript_entries WHERE id = ?').get(entryId);
    
    res.json(newEntry);
  } catch (error) {
    console.error('Error adding transcript entry:', error);
    res.status(500).json({ error: 'Failed to add transcript entry' });
  }
});

// Get recent transcript entries
router.get('/transcript/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const db = req.app.locals.db;
    
    const entries = db.prepare(`
      SELECT * FROM transcript_entries
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(sessionId, limit);
    
    res.json(entries.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// Add AI suggestion
router.post('/suggestion', (req, res) => {
  try {
    const { sessionId, suggestionText, suggestionType, confidenceScore } = req.body;
    const db = req.app.locals.db;
    
    if (!sessionId || !suggestionText) {
      return res.status(400).json({ error: 'sessionId and suggestionText are required' });
    }
    
    const suggestionId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO live_suggestions (id, session_id, suggestion_text, suggestion_type, confidence_score)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      suggestionId, 
      sessionId, 
      suggestionText, 
      suggestionType || 'general', 
      confidenceScore || 0.8
    );
    
    // Update session suggestion count
    const updateSessionStmt = db.prepare('UPDATE live_copilot_sessions SET total_suggestions = total_suggestions + 1 WHERE id = ?');
    updateSessionStmt.run(sessionId);
    
    const newSuggestion = db.prepare('SELECT * FROM live_suggestions WHERE id = ?').get(suggestionId);
    
    res.json(newSuggestion);
  } catch (error) {
    console.error('Error adding suggestion:', error);
    res.status(500).json({ error: 'Failed to add suggestion' });
  }
});

// Get session statistics
router.get('/stats/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = req.app.locals.db;
    
    const stats = db.prepare(`
      SELECT 
        s.mode,
        s.started_at,
        s.total_suggestions,
        COUNT(DISTINCT te.id) as transcript_entries,
        COUNT(DISTINCT ls.id) as suggestions_count
      FROM live_copilot_sessions s
      LEFT JOIN transcript_entries te ON s.id = te.session_id
      LEFT JOIN live_suggestions ls ON s.id = ls.session_id
      WHERE s.id = ?
      GROUP BY s.id
    `).get(sessionId);
    
    res.json(stats || {});
  } catch (error) {
    console.error('Error fetching session stats:', error);
    res.status(500).json({ error: 'Failed to fetch session stats' });
  }
});

module.exports = router;
