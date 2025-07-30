import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Play, CreditCard, Clock, CheckCircle } from 'lucide-react'
import SubscriptionForm from '@/components/SubscriptionForm'
import { subscriptionsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Subscription, Student } from '@/types'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const { toast } = useToast()

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await subscriptionsApi.getAll()
      setSubscriptions(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách gói học',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const handleCreateNew = () => {
    setSelectedSubscription(null)
    setFormOpen(true)
  }

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setFormOpen(true)
  }

  const handleDelete = async (subscription: Subscription) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa gói học "${subscription.package_name}"?`)) {
      return
    }

    try {
      await subscriptionsApi.delete(subscription._id)
      toast({
        title: 'Thành công',
        description: 'Xóa gói học thành công'
      })
      fetchSubscriptions()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Không thể xóa gói học',
        variant: 'destructive'
      })
    }
  }

  const handleUseSession = async (subscription: Subscription) => {
    if (!confirm(`Bạn có chắc chắn muốn sử dụng 1 buổi học của gói "${subscription.package_name}"?`)) {
      return
    }

    try {
      await subscriptionsApi.useSession(subscription._id)
      toast({
        title: 'Thành công',
        description: 'Đã sử dụng 1 buổi học'
      })
      fetchSubscriptions()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Không thể sử dụng buổi học',
        variant: 'destructive'
      })
    }
  }

  const handleFormSuccess = () => {
    fetchSubscriptions()
  }

  const getStudentName = (student: string | Student) => {
    if (typeof student === 'string') return 'N/A'
    return student.name
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động'
      case 'expired': return 'Đã hết hạn'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'expired': return 'text-red-600 bg-red-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const expiredSubscriptions = subscriptions.filter(s => s.status === 'expired')
  const totalUsedSessions = subscriptions.reduce((total, s) => total + s.used_sessions, 0)
  const totalSessions = subscriptions.reduce((total, s) => total + s.total_sessions, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Gói học</h1>
        <Card>
          <CardHeader>
            <CardTitle>Đang tải...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Gói học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý gói học và theo dõi buổi học đã sử dụng
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo gói học
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng gói học
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Số lượng gói học đã tạo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Gói học đang hoạt động
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã hết hạn
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Gói học đã hết hạn
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Buổi học đã dùng
            </CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsedSessions}/{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Tổng buổi học đã sử dụng
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói học</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có gói học nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu bằng cách tạo gói học đầu tiên
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo gói học
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Tên gói</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Buổi học</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell className="font-medium">
                      {getStudentName(subscription.student_id)}
                    </TableCell>
                    <TableCell>{subscription.package_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {getStatusText(subscription.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {subscription.used_sessions}/{subscription.total_sessions}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(subscription.start_date).toLocaleDateString('vi-VN')}</div>
                        <div className="text-gray-500">đến {new Date(subscription.end_date).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{subscription.total_sessions - subscription.used_sessions} buổi</div>
                        <div className="text-gray-500">
                          {getDaysRemaining(subscription.end_date) > 0 
                            ? `${getDaysRemaining(subscription.end_date)} ngày`
                            : 'Đã hết hạn'
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {subscription.status === 'active' && subscription.used_sessions < subscription.total_sessions && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUseSession(subscription)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(subscription)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(subscription)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SubscriptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        subscription={selectedSubscription}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
} 