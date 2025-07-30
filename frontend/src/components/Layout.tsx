import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card } from './ui/card'
import { 
  Home, 
  Users, 
  GraduationCap, 
  Calendar, 
  CreditCard,
  BookOpen 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Phụ huynh', href: '/parents', icon: Users },
  { name: 'Học sinh', href: '/students', icon: GraduationCap },
  { name: 'Lớp học', href: '/classes', icon: BookOpen },
  { name: 'Gói học', href: '/subscriptions', icon: CreditCard },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">Teenup</h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">Student Management System</p>
          </div>
          
          <nav className="mt-6 px-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
} 