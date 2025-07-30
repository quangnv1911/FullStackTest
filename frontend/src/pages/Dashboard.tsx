import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { parentsApi, studentsApi, classesApi, subscriptionsApi } from '@/lib/api'
import { Users, GraduationCap, BookOpen, CreditCard } from 'lucide-react'
import ToastTest from '@/components/ToastTest'

interface DashboardStats {
  totalParents: number
  totalStudents: number
  totalClasses: number
  totalSubscriptions: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalParents: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalSubscriptions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [parentsRes, studentsRes, classesRes, subscriptionsRes] = await Promise.all([
          parentsApi.getAll(),
          studentsApi.getAll(),
          classesApi.getAll(),
          subscriptionsApi.getAll()
        ])

        setStats({
          totalParents: parentsRes.data.count || parentsRes.data.data.length,
          totalStudents: studentsRes.data.count || studentsRes.data.data.length,
          totalClasses: classesRes.data.count || classesRes.data.data.length,
          totalSubscriptions: subscriptionsRes.data.count || subscriptionsRes.data.data.length
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Tổng phụ huynh',
      value: stats.totalParents,
      icon: Users,
      description: 'Số lượng phụ huynh đã đăng ký'
    },
    {
      title: 'Tổng học sinh',
      value: stats.totalStudents,
      icon: GraduationCap,
      description: 'Số lượng học sinh đang học'
    },
    {
      title: 'Tổng lớp học',
      value: stats.totalClasses,
      icon: BookOpen,
      description: 'Số lượng lớp học đang mở'
    },
    {
      title: 'Tổng gói học',
      value: stats.totalSubscriptions,
      icon: CreditCard,
      description: 'Số lượng gói học đã bán'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button>Tải lại dữ liệu</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chức năng theo dõi hoạt động sẽ được cập nhật trong phiên bản tiếp theo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tỷ lệ phụ huynh/học sinh:</span>
                <span className="font-medium">
                  {stats.totalStudents > 0 ? (stats.totalParents / stats.totalStudents).toFixed(2) : '0'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Trung bình học sinh/lớp:</span>
                <span className="font-medium">
                  {stats.totalClasses > 0 ? (stats.totalStudents / stats.totalClasses).toFixed(1) : '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     
    </div>
  )
} 