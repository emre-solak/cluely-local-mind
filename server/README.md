
# Local AI Assistant Backend

A local-first backend server for the AI Assistant application, providing offline functionality with complete data control.

## Features

- **Local SQLite Database** - All data stored locally
- **File Upload & Processing** - Support for various document formats
- **Vector Embeddings** - Document chunking and similarity search
- **Live Copilot** - Real-time conversation monitoring and suggestions
- **Chat Management** - Persistent conversation history
- **RESTful API** - Clean API for frontend integration

## Quick Start

1. **Setup Environment**
   ```bash
   cd server
   npm install
   npm run init
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access API**
   - Server: `http://localhost:3001`
   - Health Check: `http://localhost:3001/api/health`

## API Endpoints

### Chat Management
- `GET /api/chat` - List all chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId/messages` - Get chat messages
- `POST /api/chat/:chatId/messages` - Send message
- `DELETE /api/chat/:chatId` - Delete chat

### Document Management
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id/content` - Get document content
- `DELETE /api/documents/:id` - Delete document

### Live Copilot
- `POST /api/live-copilot/mode/:mode` - Set observation mode
- `GET /api/live-copilot/session` - Get current session
- `POST /api/live-copilot/transcript` - Add transcript entry
- `POST /api/live-copilot/suggestion` - Add AI suggestion

### Vector Search
- `POST /api/embeddings/search` - Search for relevant context
- `GET /api/embeddings/stats` - Get embedding statistics

## Database Schema

The backend uses SQLite with the following main tables:
- `chats` - Conversation threads
- `messages` - Individual messages with metadata
- `documents` - Uploaded files and metadata
- `document_embeddings` - Text chunks with vector embeddings
- `live_copilot_sessions` - Live monitoring sessions
- `transcript_entries` - Real-time conversation transcripts

## Next Steps

1. **Install LLM Integration**: Configure Ollama for local AI processing
2. **Add Vector Database**: Integrate ChromaDB for advanced similarity search
3. **Document Processing**: Implement text extraction for various file formats
4. **Real-time Features**: Add WebSocket support for live updates
