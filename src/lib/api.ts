
const API_BASE = 'http://localhost:3001/api';

// Chat API
export const chatApi = {
  sendMessage: async (message: string, context?: any[]) => {
    const response = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  getChatHistory: async () => {
    const response = await fetch(`${API_BASE}/chat/history`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  clearChatHistory: async () => {
    const response = await fetch(`${API_BASE}/chat/history`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Documents API
export const documentsApi = {
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${API_BASE}/documents`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  deleteDocument: async (id: string) => {
    const response = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Embeddings API
export const embeddingsApi = {
  search: async (query: string, limit = 5) => {
    const response = await fetch(`${API_BASE}/embeddings/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE}/embeddings/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Integrations API
export const integrationsApi = {
  // Ollama integration
  testOllamaConnection: async (url: string) => {
    try {
      const response = await fetch(`${url}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  getOllamaModels: async (url: string) => {
    const response = await fetch(`${url}/api/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch Ollama models');
    }
    return response.json();
  },

  // ChromaDB integration
  testChromaConnection: async (url: string) => {
    try {
      const response = await fetch(`${url}/api/v1/heartbeat`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  getChromaCollections: async (url: string) => {
    const response = await fetch(`${url}/api/v1/collections`);
    if (!response.ok) {
      throw new Error('Failed to fetch ChromaDB collections');
    }
    return response.json();
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
