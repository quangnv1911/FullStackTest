import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { classesApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Users, User, Phone, Mail, Calendar, GraduationCap } from 'lucide-react'
import type { Class, Student, Parent, ClassRegistration } from '@/types'

interface ClassStudentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string | null
  className?: string
}

interface ClassWithStudents extends Class {
  registrations: Array<ClassRegistration & {
    student_id: Student & {
      parent_id: Parent
    }
  }>
}

export default function ClassStudentsDialog({ 
  open, 
  onOpenChange, 
  classId,
  className 
}: ClassStudentsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [classData, setClassData] = useState<ClassWithStudents | null>(null)
  const { toast } = useToast()

  // Fetch class with students when dialog opens
  useEffect(() => {
    const fetchClassStudents = async () => {
      if (!open || !classId) return
      
      console.log('🔍 Fetching students for class:', classId)
      setLoading(true)
      try {
        const response = await classesApi.getClassWithStudents(classId)
        console.log('📋 Class students response:', response.data)
        setClassData(response.data.data)
      } catch (error) {
        console.error('❌ Error fetching class students:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách học sinh',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClassStudents()
  }, [open, classId])

  const getAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    })
  }

  const getDayLabel = (day: string) => {
    const days = {
      'monday': 'Thứ 2',
      'tuesday': 'Thứ 3', 
      'wednesday': 'Thứ 4',
      'thursday': 'Thứ 5',
      'friday': 'Thứ 6',
      'saturday': 'Thứ 7',
      'sunday': 'Chủ nhật'
    }
    return days[day as keyof typeof days] || day
  }

  const activeStudents = classData?.registrations?.filter(reg => reg.status === 'active') || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách học sinh
          </DialogTitle>
          <DialogDescription>
            {classData ? (
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 text-lg">{classData.name}</div>
                <div className="text-sm text-blue-700 mt-1">
                  <span className="inline-flex items-center gap-4">
                    <span>📚 {classData.subject}</span>
                    <span>📅 {getDayLabel(classData.day_of_week)}</span>
                    <span>🕐 {classData.time_slot}</span>
                  </span>
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  👨‍🏫 {classData.teacher_name} • 
                  👥 {activeStudents.length}/{classData.max_students} học sinh
                </div>
              </div>
            ) : (
              className && `Xem danh sách học sinh trong lớp "${className}"`
            )}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : !classData ? (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin lớp học
          </div>
        ) : activeStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có học sinh nào
            </h3>
            <p className="text-gray-600">
              Lớp học này chưa có học sinh đăng ký
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Tổng học sinh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeStudents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Đang theo học
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nam/Nữ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeStudents.filter(reg => reg.student_id.gender === 'male').length}/
                    {activeStudents.filter(reg => reg.student_id.gender === 'female').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tỷ lệ giới tính
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Tuổi TB
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeStudents.length > 0 ? 
                      Math.round(activeStudents.reduce((sum, reg) => sum + getAge(reg.student_id.dob), 0) / activeStudents.length) 
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tuổi trung bình
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết học sinh</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Tuổi</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Phụ huynh</TableHead>
                      <TableHead>Liên hệ</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeStudents.map((registration) => {
                      const student = registration.student_id
                      const parent = student.parent_id
                      
                      return (
                        <TableRow key={registration._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                student.gender === 'male' ? 'bg-blue-500' : 
                                student.gender === 'female' ? 'bg-pink-500' : 'bg-gray-500'
                              }`}>
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">
                                  {student.gender === 'male' ? '👦' : student.gender === 'female' ? '👧' : '👤'} 
                                  {student.gender === 'male' ? ' Nam' : student.gender === 'female' ? ' Nữ' : ' Khác'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {getAge(student.dob)} tuổi
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {student.current_grade}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{parent.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {parent.phone}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {parent.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {formatDate(registration.registration_date)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 