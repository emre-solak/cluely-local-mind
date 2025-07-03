
const express = require('express');
const router = express.Router();

// Search embeddings for relevant context
router.post('/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    const db = req.app.locals.db;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // TODO: Implement actual vector similarity search
    // For now, return a simple text-based search
    const results = db.prepare(`
      SELECT de.*, d.original_name, d.filename
      FROM document_embeddings de
      JOIN documents d ON de.document_id = d.id
      WHERE de.chunk_text LIKE ?
      ORDER BY de.created_at DESC
      LIMIT ?
    `).all(`%${query}%`, limit);
    
    // Add mock relevance scores
    const resultsWithScore = results.map(result => ({
      ...result,
      relevance_score: Math.random() * 0.3 + 0.7 // Mock score between 0.7-1.0
    }));
    
    res.json(resultsWithScore);
  } catch (error) {
    console.error('Error searching embeddings:', error);
    res.status(500).json({ error: 'Failed to search embeddings' });
  }
});

// Get embedding statistics
router.get('/stats', (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(DISTINCT d.id) as total_documents,
        COUNT(de.id) as total_chunks,
        AVG(LENGTH(de.chunk_text)) as avg_chunk_length,
        SUM(d.file_size) as total_file_size
      FROM documents d
      LEFT JOIN document_embeddings de ON d.id = de.document_id
    `).get();
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching embedding stats:', error);
    res.status(500).json({ error: 'Failed to fetch embedding stats' });
  }
});

module.exports = router;
