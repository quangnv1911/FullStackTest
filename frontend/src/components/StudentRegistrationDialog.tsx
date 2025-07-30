import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { classesApi, studentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Class, Student } from '@/types'

interface StudentRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedClass?: Class | null
  onSuccess: () => void
}

export default function StudentRegistrationDialog({ 
  open, 
  onOpenChange, 
  selectedClass, 
  onSuccess 
}: StudentRegistrationDialogProps) {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const { toast } = useToast()

  // Fetch students when dialog opens
  useEffect(() => {
    const fetchStudents = async () => {
      if (!open) return
      
      try {
        const response = await studentsApi.getAll()
        setStudents(response.data.data)
      } catch (error) {
        console.error('Error fetching students:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách học sinh',
          variant: 'destructive'
        })
      }
    }

    fetchStudents()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedClass || !selectedStudentId) {
      console.log('⚠️ Validation failed, showing validation error toast')
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn học sinh',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      await classesApi.register(selectedClass._id, selectedStudentId)
      
      console.log('✅ Registration successful, showing success toast')
      toast({
        title: 'Thành công',
        description: `Đã đăng ký học sinh vào lớp "${selectedClass.name}" thành công`
      })
      
      onSuccess()
      onOpenChange(false)
      setSelectedStudentId('')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký'
      console.log('❌ Registration failed, showing error toast:', errorMessage)
      toast({
        title: 'Lỗi đăng ký',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedStudentId('')
    }
    onOpenChange(newOpen)
  }

  const getStudentDisplay = (student: Student) => {
    const parentName = typeof student.parent_id === 'object' 
      ? student.parent_id.name 
      : 'N/A'
    return `${student.name} - ${student.current_grade} (PH: ${parentName})`
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đăng ký học sinh vào lớp</DialogTitle>
          <DialogDescription>
            {selectedClass ? (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">{selectedClass.name}</div>
                <div className="text-sm text-blue-700 mt-1">
                  {selectedClass.subject} • {selectedClass.day_of_week} • {selectedClass.time_slot}
                </div>
                <div className="text-sm text-blue-600">
                  Giáo viên: {selectedClass.teacher_name} • 
                  Sức chứa: {selectedClass.currentEnrollment || 0}/{selectedClass.max_students}
                </div>
              </div>
            ) : (
              'Chọn học sinh để đăng ký vào lớp học'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="student" className="text-sm font-medium">
                Chọn học sinh *
              </label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học sinh cần đăng ký" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {getStudentDisplay(student)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {students.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Chưa có học sinh nào. Vui lòng tạo học sinh trước.
                </p>
              )}
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
            <Button 
              type="submit" 
              disabled={loading || !selectedStudentId || students.length === 0}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 