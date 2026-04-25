'use client'

import RAGChat from '@/components/rag-chat'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AIAssistantPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    if (!isAuthenticated) {
        return null
    }

    return <RAGChat />
}
