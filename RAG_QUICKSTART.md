# 🚀 Quick Start Guide: RAG Feature

## What is this?

This feature allows students to **ask questions and get AI-powered answers from uploaded PDF study materials** with exact page number citations and content previews.

For example:
- **Question**: "What is DBMS?"
- **Answer**: AI provides an answer based on your uploaded PDFs, citing specific pages like "According to Database Management Systems (Page 15)..."

## Setup Steps

### 1. Ensure Database is Ready
The database schema has already been updated with the necessary tables:
- `resources` - stores uploaded PDFs
- `document_chunks` - stores extracted text with page numbers

### 2. Process Existing PDFs

Run this command to process all uploaded PDFs:

```bash
npm run process-pdfs
```

This will:
- Extract text from each PDF page by page
- Break text into chunks (~500 tokens each)
- Store chunks in database with page tracking
- Mark PDFs as "processed"

### 3. Access the AI Assistant

Navigate to: **`/ai-assistant`** in your application

You'll see:
- A chat interface
- A toggle switch: **"Use Internal Resources"**
- When enabled, AI will search your uploaded PDFs for answers

## How to Use

### For Students

1. **Upload PDFs** (if not already uploaded)
   - Go to resources section
   - Upload your study materials (notes, textbooks, etc.)

2. **Ask Questions**
   - Go to `/ai-assistant`
   - Enable "Use Internal Resources" toggle
   - Type your question (e.g., "What is DBMS?")
   - Press Enter or click Send

3. **Review Answer with Sources**
   - AI provides an answer
   - Sources are listed below with:
     - Document name
     - Page number
     - Content preview
     - Expandable full content

### For Developers

#### Process a Single PDF via API

```javascript
const response = await fetch('/api/resources/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    resourceId: 'your-resource-id'
  })
})
```

#### Ask a Question via API

```javascript
const response = await fetch('/api/ai/rag-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    question: 'What is DBMS?',
    useInternalResources: true,
    subject: 'Computer Science',  // optional
    semester: 5                    // optional
  })
})

const data = await response.json()
console.log(data.response)  // AI answer
console.log(data.sources)   // Array of sources with page numbers
```

## Example Workflow

### Scenario: Student Studying for DBMS Exam

1. **Upload Study Materials**
   ```
   - DBMS_Textbook.pdf
   - DBMS_Notes.pdf
   - Previous_Year_Papers.pdf
   ```

2. **Process PDFs** (one-time)
   ```bash
   npm run process-pdfs
   ```

3. **Study Session**
   - Open `/ai-assistant`
   - Enable "Use Internal Resources"
   - Ask: "What is normalization?"
   - Get answer with citations from uploaded materials
   - Ask: "Explain 3NF with example"
   - Get answer from specific pages

4. **Benefits**
   - ✅ Instant answers from your own study materials
   - ✅ Exact page references for deeper study
   - ✅ No need to search through multiple PDFs manually
   - ✅ AI understands context from your materials

## Features

### ✨ Current Features
- 📚 PDF text extraction with page tracking
- 🔍 Intelligent keyword-based search
- 🤖 Gemini AI-powered answer generation
- 📖 Source citations with page numbers
- 👁️ Content previews (expandable)
- 🔄 Toggle for using internal resources
- ⚡ Batch PDF processing

### 🎯 Use Cases
1. **Quick Revision**: Ask questions to quickly review concepts
2. **Doubt Clearing**: Get explanations from your study materials
3. **Exam Prep**: Find specific topics across multiple documents
4. **Assignment Help**: Get information with proper citations
5. **Research**: Quickly locate information in large documents

## Tips for Best Results

### 1. Ask Clear Questions
❌ Bad: "tell me about it"
✅ Good: "What is database normalization?"

### 2. Use Specific Terms
❌ Bad: "that thing in chapter 3"
✅ Good: "What is the ACID property in DBMS?"

### 3. Process PDFs After Upload
Always run `npm run process-pdfs` after uploading new study materials

### 4. Check Resource Status
```bash
npx tsx scripts/check-resources.ts
```

This shows:
- Total resources
- Processed vs unprocessed
- Number of document chunks
- Sample resources

## Troubleshooting

### No Sources Found?

**Possible Reasons:**
1. PDFs not processed yet
   - **Solution**: Run `npm run process-pdfs`

2. Query doesn't match content
   - **Solution**: Try different keywords or broader terms

3. Wrong filters applied
   - **Solution**: Remove subject/semester filters or adjust them

### PDF Processing Failed?

**Check:**
1. File exists in `uploads/resources/` folder
2. PDF is not corrupted
3. Database connection is working
4. Check console logs for specific errors

### Gemini API Errors?

**Verify:**
1. `GEMINI_API_KEY` is set in `.env`
2. API key is valid and active
3. You haven't exceeded API quota
4. Network connection is stable

## Architecture

```
User Question
     ↓
[RAG Chat Component]
     ↓
[/api/ai/rag-chat]
     ↓
[Search Document Chunks] → Find relevant content with page numbers
     ↓
[Build Context] → Combine chunks into context
     ↓
[Gemini AI] → Generate answer with citations
     ↓
[Response with Sources]
     ↓
User sees answer + page references
```

## Performance Notes

- **Search Speed**: Keyword search is fast (~100ms)
- **AI Response**: Depends on Gemini API (~1-3 seconds)
- **Chunk Size**: 500 tokens (~2000 characters) per chunk
- **Max Sources**: Top 5 most relevant chunks returned

## Future Enhancements

🔮 **Planned Features:**
- Vector embeddings for semantic search
- PDF preview with highlighted sections
- Multi-language support
- Voice input/output
- Export Q&A sessions
- Analytics dashboard

## Support

For issues or questions:
1. Check this guide
2. Review `RAG_FEATURE.md` for technical details
3. Check console logs for errors
4. Verify environment variables

---

**Happy Learning! 📚✨**
