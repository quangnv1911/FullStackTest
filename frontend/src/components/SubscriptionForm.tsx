import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { subscriptionsApi, studentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Subscription, CreateSubscriptionForm, Student } from '@/types'

interface SubscriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription?: Subscription | null
  onSuccess: () => void
}

const PACKAGE_OPTIONS = [
  { name: 'Gói học 1 tháng', sessions: 8 },
  { name: 'Gói học 3 tháng', sessions: 24 },
  { name: 'Gói học 6 tháng', sessions: 48 },
  { name: 'Gói học 1 năm', sessions: 96 }
]

export default function SubscriptionForm({ open, onOpenChange, subscription, onSuccess }: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateSubscriptionForm>({
    student_id: typeof subscription?.student_id === 'string' ? subscription.student_id : subscription?.student_id?._id || '',
    package_name: subscription?.package_name || '',
    start_date: subscription?.start_date ? subscription.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
    end_date: subscription?.end_date ? subscription.end_date.split('T')[0] : '',
    total_sessions: subscription?.total_sessions || 8
  })

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentsApi.getAll()
        setStudents(response.data.data)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }
    
    if (open) {
      fetchStudents()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.student_id || !formData.package_name.trim() || !formData.start_date || !formData.end_date || !formData.total_sessions) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }

    // Validate dates
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    if (endDate <= startDate) {
      toast({
        title: 'Lỗi',
        description: 'Ngày kết thúc phải sau ngày bắt đầu',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      if (subscription) {
        // Update existing subscription
        await subscriptionsApi.update(subscription._id, formData)
        toast({
          title: 'Thành công',
          description: 'Cập nhật gói học thành công'
        })
      } else {
        // Create new subscription
        await subscriptionsApi.create(formData)
        toast({
          title: 'Thành công', 
          description: 'Tạo gói học mới thành công'
        })
      }
      
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Có lỗi xảy ra',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0]
    setFormData({
      student_id: '',
      package_name: '',
      start_date: today,
      end_date: '',
      total_sessions: 8
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const handlePackageSelect = (packageName: string) => {
    const selectedPackage = PACKAGE_OPTIONS.find(pkg => pkg.name === packageName)
    if (selectedPackage) {
      // Auto-calculate end date based on package (roughly 2 sessions per week)
      const startDate = new Date(formData.start_date)
      const weeksNeeded = Math.ceil(selectedPackage.sessions / 2)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + (weeksNeeded * 7))
      
      setFormData(prev => ({
        ...prev,
        package_name: packageName,
        total_sessions: selectedPackage.sessions,
        end_date: endDate.toISOString().split('T')[0]
      }))
    }
  }

  // Update form when subscription prop changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        student_id: typeof subscription.student_id === 'string' ? subscription.student_id : subscription.student_id._id,
        package_name: subscription.package_name,
        start_date: subscription.start_date.split('T')[0],
        end_date: subscription.end_date.split('T')[0],
        total_sessions: subscription.total_sessions
      })
    } else {
      resetForm()
    }
  }, [subscription])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Sửa thông tin gói học' : 'Tạo gói học mới'}
          </DialogTitle>
          <DialogDescription>
            {subscription 
              ? 'Cập nhật thông tin gói học dưới đây'
              : 'Điền thông tin để tạo gói học mới'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student_id">Học sinh *</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học sinh" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name} - {student.current_grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="package_name">Tên gói học *</Label>
              <Select
                value={formData.package_name}
                onValueChange={handlePackageSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn gói học" />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_OPTIONS.map((pkg) => (
                    <SelectItem key={pkg.name} value={pkg.name}>
                      {pkg.name} ({pkg.sessions} buổi)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Ngày bắt đầu *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end_date">Ngày kết thúc *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="total_sessions">Tổng số buổi học *</Label>
              <Input
                id="total_sessions"
                type="number"
                min="1"
                max="200"
                value={formData.total_sessions}
                onChange={(e) => setFormData(prev => ({ ...prev, total_sessions: parseInt(e.target.value) || 8 }))}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (subscription ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 