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
import { classesApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Class, CreateClassForm } from '@/types'

interface ClassFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData?: Class | null
  onSuccess: () => void
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' }
]

const SUBJECTS = [
  'Toán học',
  'Tiếng Anh', 
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
  'Văn học',
  'Tin học',
  'Âm nhạc',
  'Mỹ thuật',
  'Thể dục'
]

export default function ClassForm({ open, onOpenChange, classData, onSuccess }: ClassFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateClassForm>({
    name: classData?.name || '',
    subject: classData?.subject || '',
    day_of_week: classData?.day_of_week || 'monday',
    time_slot: classData?.time_slot || '',
    teacher_name: classData?.teacher_name || '',
    max_students: classData?.max_students || 10
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.subject.trim() || !formData.time_slot.trim() || !formData.teacher_name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }

    // Validate time slot format
    const timeSlotRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeSlotRegex.test(formData.time_slot)) {
      toast({
        title: 'Lỗi',
        description: 'Khung giờ không đúng định dạng. Vui lòng nhập theo định dạng HH:MM-HH:MM (ví dụ: 09:00-10:30)',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      if (classData) {
        // Update existing class
        await classesApi.update(classData._id, formData)
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin lớp học thành công'
        })
      } else {
        // Create new class
        await classesApi.create(formData)
        toast({
          title: 'Thành công', 
          description: 'Tạo lớp học mới thành công'
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
    setFormData({
      name: '',
      subject: '',
      day_of_week: 'monday',
      time_slot: '',
      teacher_name: '',
      max_students: 10
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  // Update form when classData prop changes
  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        subject: classData.subject,
        day_of_week: classData.day_of_week,
        time_slot: classData.time_slot,
        teacher_name: classData.teacher_name,
        max_students: classData.max_students
      })
    } else {
      resetForm()
    }
  }, [classData])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {classData ? 'Sửa thông tin lớp học' : 'Thêm lớp học mới'}
          </DialogTitle>
          <DialogDescription>
            {classData 
              ? 'Cập nhật thông tin lớp học dưới đây'
              : 'Điền thông tin để tạo lớp học mới'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên lớp học *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Toán học cơ bản"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Môn học *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="day_of_week">Ngày trong tuần *</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time_slot">Khung giờ *</Label>
                <Input
                  id="time_slot"
                  value={formData.time_slot}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_slot: e.target.value }))}
                  placeholder="09:00-10:30"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="teacher_name">Tên giáo viên *</Label>
              <Input
                id="teacher_name"
                value={formData.teacher_name}
                onChange={(e) => setFormData(prev => ({ ...prev, teacher_name: e.target.value }))}
                placeholder="Nhập tên giáo viên"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="max_students">Số học sinh tối đa *</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                max="50"
                value={formData.max_students}
                onChange={(e) => setFormData(prev => ({ ...prev, max_students: parseInt(e.target.value) || 10 }))}
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
              {loading ? 'Đang xử lý...' : (classData ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 