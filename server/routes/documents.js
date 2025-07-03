
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Get all documents
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const documents = db.prepare(`
      SELECT d.*,
             COUNT(de.id) as chunk_count
      FROM documents d
      LEFT JOIN document_embeddings de ON d.id = de.document_id
      GROUP BY d.id
      ORDER BY d.uploaded_at DESC
    `).all();
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Upload document
router.post('/upload', (req, res) => {
  const upload = req.app.locals.upload;
  
  upload.single('document')(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: 'File upload failed' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
      const db = req.app.locals.db;
      const documentId = uuidv4();
      
      const stmt = db.prepare(`
        INSERT INTO documents (id, filename, original_name, file_path, file_size, mime_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        documentId,
        req.file.filename,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype
      );
      
      const newDocument = db.prepare('SELECT * FROM documents WHERE id = ?').get(documentId);
      
      // TODO: Queue document for processing (text extraction and embedding generation)
      console.log(`📄 Document uploaded: ${req.file.originalname} (${documentId})`);
      
      res.json(newDocument);
    } catch (error) {
      console.error('Error saving document:', error);
      res.status(500).json({ error: 'Failed to save document' });
    }
  });
});

// Get document content
router.get('/:documentId/content', async (req, res) => {
  try {
    const { documentId } = req.params;
    const db = req.app.locals.db;
    
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(documentId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // For now, return basic file info
    // TODO: Implement text extraction based on file type
    res.json({
      document,
      content: 'Text extraction will be implemented with document processing pipeline'
    });
  } catch (error) {
    console.error('Error fetching document content:', error);
    res.status(500).json({ error: 'Failed to fetch document content' });
  }
});

// Delete document
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const db = req.app.locals.db;
    
    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(documentId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete file from filesystem
    try {
      await fs.unlink(document.file_path);
    } catch (fileError) {
      console.warn('Could not delete file:', fileError.message);
    }
    
    // Delete from database (cascades to embeddings)
    const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
    stmt.run(documentId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Get document embeddings/chunks
router.get('/:documentId/embeddings', (req, res) => {
  try {
    const { documentId } = req.params;
    const db = req.app.locals.db;
    
    const embeddings = db.prepare(`
      SELECT id, chunk_text, chunk_index, created_at
      FROM document_embeddings
      WHERE document_id = ?
      ORDER BY chunk_index ASC
    `).all(documentId);
    
    res.json(embeddings);
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    res.status(500).json({ error: 'Failed to fetch embeddings' });
  }
});

module.exports = router;
