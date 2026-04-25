# RAG (Retrieval-Augmented Generation) Feature

## Overview
This feature allows users to ask questions and get AI-powered answers sourced from uploaded PDF documents with page number citations and content previews.

## Key Components

### 1. Database Schema
- **`resources`** table: Stores uploaded PDF files with a `processed` flag
- **`document_chunks`** table: Stores extracted text chunks from PDFs with page numbers

### 2. Backend Services

#### PDF Processor (`src/lib/pdf-processor.ts`)
- Extracts text from PDFs page by page
- Chunks text into manageable pieces (~500 tokens each)
- Stores chunks in database with page tracking
- Provides search functionality to find relevant chunks

#### API Endpoints

**`/api/resources/process`** (POST)
- Processes a single PDF resource
- Extracts and stores chunks in database
- Marks resource as processed

**`/api/ai/rag-chat`** (POST)
- Main RAG endpoint for question answering
- Searches document chunks for relevant content
- Uses Gemini API to generate answers with citations
- Returns sources with page numbers and previews

### 3. Frontend Components

#### RAG Chat Component (`src/components/rag-chat.tsx`)
- Interactive chat interface
- Toggle to enable/disable "Use Internal Resources"
- Displays AI responses with source citations
- Shows page numbers and content previews
- Expandable source snippets

## Usage

### Processing PDFs

#### Process All PDFs (Batch)
```bash
npm run process-pdfs
```

#### Process Single PDF (API)
```javascript
POST /api/resources/process
{
  "resourceId": "resource_id_here"
}
```

### Asking Questions

```javascript
POST /api/ai/rag-chat
{
  "question": "What is DBMS?",
  "useInternalResources": true,
  "subject": "Computer Science",  // optional
  "semester": 5                    // optional
}
```

### Response Format
```json
{
  "response": "AI generated answer with citations...",
  "sources": [
    {
      "id": "chunk_id",
      "resourceId": "resource_id",
      "resourceTitle": "Database Management Systems",
      "fileName": "dbms_notes.pdf",
      "pageNumber": 15,
      "preview": "First 200 characters of the content...",
      "fullContent": "Complete chunk content",
      "relevanceScore": 5.2
    }
  ],
  "usedInternalResources": true
}
```

## Features

### ✅ Implemented
- PDF text extraction with page tracking
- Text chunking for optimal retrieval
- Keyword-based search
- Gemini AI integration for answer generation
- Source citations with page numbers
- Content previews
- Toggle for using internal resources
- Batch PDF processing script

### 🚀 Future Enhancements
- **Vector Embeddings**: Use embeddings for semantic search instead of keyword matching
- **Caching**: Cache frequently asked questions
- **Multi-file Upload**: Process multiple PDFs at once
- **Advanced Filters**: Filter by subject, semester, unit
- **Highlighting**: Highlight relevant sections in PDF preview
- **Export**: Export Q&A sessions
- **Analytics**: Track most asked questions and popular resources

## Technical Details

### Search Algorithm
Currently uses keyword-based matching:
1. Tokenize query into terms
2. Search for terms in document chunks
3. Score chunks based on:
   - Number of keyword occurrences
   - Percentage of query terms found
4. Return top 5 most relevant chunks

### Token Estimation
- Rough approximation: 1 token ≈ 4 characters
- Default chunk size: 500 tokens (~2000 characters)

### Gemini API Configuration
- Model: `gemini-2.0-flash` (or configured model)
- Temperature: 0.7
- Max tokens: 1500

## Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_database_url_here
```

## Best Practices

1. **Process PDFs after upload**: Always process PDFs immediately after upload for best user experience
2. **Monitor token usage**: Keep track of Gemini API token usage
3. **Optimize chunk size**: Adjust chunk size based on your content type
4. **Regular cleanup**: Remove old/unused document chunks to save database space
5. **Error handling**: Always handle PDF processing errors gracefully

## Troubleshooting

### PDFs not being processed
- Check file path is correct
- Ensure PDF is not corrupted
- Check database connection
- Verify `processed` flag in database

### No sources found
- Ensure PDFs have been processed (`processed = true`)
- Check if query terms match content
- Try broader search terms
- Verify resource filters (subject, semester)

### Gemini API errors
- Check API key is valid
- Verify API quota/limits
- Check network connectivity
- Review error logs
