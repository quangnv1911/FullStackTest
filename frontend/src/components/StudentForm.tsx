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
import { studentsApi, parentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Student, CreateStudentForm, Parent } from '@/types'

interface StudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: Student | null
  onSuccess: () => void
}

export default function StudentForm({ open, onOpenChange, student, onSuccess }: StudentFormProps) {
  const [loading, setLoading] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateStudentForm>({
    name: student?.name || '',
    dob: student?.dob ? student.dob.split('T')[0] : '',
    gender: student?.gender || 'male',
    current_grade: student?.current_grade || '',
    parent_id: typeof student?.parent_id === 'string' ? student.parent_id : student?.parent_id?._id || ''
  })

  // Fetch parents for dropdown
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await parentsApi.getAll()
        setParents(response.data.data)
      } catch (error) {
        console.error('Error fetching parents:', error)
      }
    }
    
    if (open) {
      fetchParents()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.dob || !formData.current_grade.trim() || !formData.parent_id) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      if (student) {
        // Update existing student
        await studentsApi.update(student._id, formData)
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin học sinh thành công'
        })
      } else {
        // Create new student
        await studentsApi.create(formData)
        toast({
          title: 'Thành công', 
          description: 'Tạo học sinh mới thành công'
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
      dob: '',
      gender: 'male',
      current_grade: '',
      parent_id: ''
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  // Update form when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        dob: student.dob.split('T')[0],
        gender: student.gender,
        current_grade: student.current_grade,
        parent_id: typeof student.parent_id === 'string' ? student.parent_id : student.parent_id._id
      })
    } else {
      resetForm()
    }
  }, [student])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
          </DialogTitle>
          <DialogDescription>
            {student 
              ? 'Cập nhật thông tin học sinh dưới đây'
              : 'Điền thông tin để tạo học sinh mới'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập họ và tên học sinh"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dob">Ngày sinh *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gender">Giới tính *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'male' | 'female' | 'other') => 
                  setFormData(prev => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="current_grade">Lớp học hiện tại *</Label>
              <Input
                id="current_grade"
                value={formData.current_grade}
                onChange={(e) => setFormData(prev => ({ ...prev, current_grade: e.target.value }))}
                placeholder="Ví dụ: Lớp 8, Grade 6"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="parent_id">Phụ huynh *</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phụ huynh" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent._id} value={parent._id}>
                      {parent.name} - {parent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {loading ? 'Đang xử lý...' : (student ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 