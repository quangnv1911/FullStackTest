import { useState, useCallback, useEffect } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

// Simple global state for toasts
let globalToasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

const notifyListeners = () => {
  console.log('📢 Notifying listeners:', listeners.length, 'with toasts:', globalToasts.length)
  listeners.forEach(listener => listener([...globalToasts]))
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts)

  // Subscribe to global toast changes
  useEffect(() => {
    console.log('🔗 Subscribing to toast changes, current listeners:', listeners.length)
    listeners.push(setToasts)
    console.log('✅ Subscribed, total listeners:', listeners.length)
    
    // Cleanup function
    return () => {
      console.log('🧹 Unsubscribing from toast changes')
      listeners = listeners.filter(listener => listener !== setToasts)
      console.log('✅ Unsubscribed, remaining listeners:', listeners.length)
    }
  }, [])

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
    const newToast = { id, title, description, variant }
    
    console.log('🔥 Creating toast:', newToast)
    
    globalToasts = [...globalToasts, newToast]
    console.log('📝 Updated globalToasts:', globalToasts)
    
    notifyListeners()
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      globalToasts = globalToasts.filter(t => t.id !== id)
      notifyListeners()
    }, 5000)
  }, [])

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter(t => t.id !== id)
    notifyListeners()
  }, [])

  return {
    toast,
    dismiss,
    toasts
  }
} 