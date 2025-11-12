# Gemini API Integration for LearnWave

## Overview

This document outlines the integration of Google's Gemini API into the LearnWave platform, providing users with an alternative AI provider alongside the existing ZAI SDK.

## Features Implemented

### 1. AI Configuration Manager (`/src/lib/ai-config.ts`)

- **Multi-provider support**: Seamlessly switch between ZAI and Gemini APIs
- **Fallback mechanism**: Automatically falls back to alternative providers if one fails
- **Type-safe implementation**: Full TypeScript support with proper interfaces
- **Singleton pattern**: Ensures consistent configuration across the application

### 2. Enhanced API Routes

#### Chat API (`/api/ai/chat`)
- Supports provider selection via request body
- Returns provider information in response
- Maintains conversation history

#### Quiz Generation API (`/api/ai/generate-quiz`)
- Provider-aware quiz generation
- Consistent response format across providers
- Fallback to mock questions on API failure

#### New API Endpoints
- `/api/ai/providers` - Get available AI providers
- `/api/ai/summarize` - Summarize notes using selected provider
- `/api/ai/explain` - Explain concepts using selected provider

### 3. UI Enhancements

#### AI Assistant Page (`/student/ai-assistant`)
- **Provider selector**: Dropdown to choose between ZAI and Gemini
- **Provider badges**: Visual indicators showing which provider generated each response
- **Real-time switching**: Change providers without page reload

#### Quiz Generator Page (`/student/quiz`)
- **Provider selection**: Choose AI provider for quiz generation
- **Consistent UI**: Maintains existing design patterns

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# Gemini API Key
GEMINI_API_KEY="your_gemini_api_key_here"

# AI Configuration
AI_DEFAULT_PROVIDER="zai"
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your environment variables

## Usage Examples

### Basic Chat with Provider Selection

```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Explain binary search",
    provider: "gemini", // or "zai"
    conversationHistory: []
  })
})
```

### Quiz Generation with Provider

```javascript
const response = await fetch('/api/ai/generate-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: "Data Structures",
    topic: "Binary Search",
    difficulty: "medium",
    questionCount: 5,
    provider: "gemini"
  })
})
```

### Getting Available Providers

```javascript
const response = await fetch('/api/ai/providers')
const { providers, currentProvider } = await response.json()
```

## Architecture

### Provider Interface

```typescript
interface AIProvider {
  name: string
  type: 'gemini' | 'zai'
  generateResponse(messages: any[], options?: any): Promise<string>
}
```

### AI Manager

The `AIManager` class provides:
- Provider registration and management
- Automatic fallback handling
- Centralized configuration

### Error Handling

- Graceful fallback to alternative providers
- Consistent error responses
- Fallback content for critical features

## Benefits

### For Users
- **Choice**: Select preferred AI provider
- **Reliability**: Automatic fallback ensures service availability
- **Performance**: Compare response quality between providers

### For Developers
- **Flexibility**: Easy to add new providers
- **Maintainability**: Centralized AI configuration
- **Scalability**: Provider-agnostic architecture

## Testing

### Manual Testing Steps

1. **Provider Switching**
   - Navigate to AI Assistant page
   - Switch between providers using the dropdown
   - Verify responses show correct provider badges

2. **Quiz Generation**
   - Go to Quiz Generator page
   - Select different providers
   - Generate quizzes and verify quality

3. **Fallback Testing**
   - Temporarily disable one provider
   - Verify automatic fallback to alternative
   - Check error handling

### API Testing

```bash
# Test providers endpoint
curl http://localhost:3000/api/ai/providers

# Test chat with Gemini
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","provider":"gemini"}'
```

## Future Enhancements

### Planned Features
- **Provider comparison**: Side-by-side response comparison
- **Custom models**: Support for fine-tuned models
- **Cost tracking**: Monitor API usage per provider
- **Response caching**: Cache responses for repeated queries

### Additional Providers
- OpenAI GPT models
- Anthropic Claude
- Local model support (Ollama)
- Custom API endpoints

## Troubleshooting

### Common Issues

1. **Gemini API Key Not Working**
   - Verify API key is correct
   - Check if billing is enabled
   - Ensure API key has proper permissions

2. **Provider Not Showing**
   - Check environment variables
   - Restart development server
   - Verify API key configuration

3. **Fallback Not Working**
   - Check console for errors
   - Verify all providers are configured
   - Test individual provider endpoints

### Debug Mode

Enable debug logging by setting:

```env
DEBUG_AI=true
```

## Security Considerations

- API keys are stored in environment variables
- Provider selection is validated on backend
- Rate limiting implemented per provider
- No API keys exposed to client-side

## Performance Optimization

- Connection pooling for API requests
- Response caching where appropriate
- Lazy loading of provider configurations
- Timeout handling for slow providers

## Conclusion

The Gemini API integration successfully enhances the LearnWave platform by providing users with choice and reliability. The modular architecture ensures easy maintenance and future expansion capabilities.

For questions or support, refer to the development team or check the API documentation.