"use client"

import AIAssistant from '@/app/student/ai-assistant/page'

export default function AIPage() {
  // This route simply re-uses the existing student AI assistant UI so the assistant
  // is available at /ai for authenticated users. The component already guards
  // access via the AuthContext.
  return <AIAssistant />
}
