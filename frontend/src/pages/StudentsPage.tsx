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
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import StudentForm from '@/components/StudentForm'
import { studentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Student, Parent } from '@/types'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const { toast } = useToast()

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentsApi.getAll()
      setStudents(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách học sinh',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleCreateNew = () => {
    setSelectedStudent(null)
    setFormOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setFormOpen(true)
  }

  const handleDelete = async (student: Student) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa học sinh "${student.name}"?`)) {
      return
    }

    try {
      await studentsApi.delete(student._id)
      toast({
        title: 'Thành công',
        description: 'Xóa học sinh thành công'
      })
      fetchStudents()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Không thể xóa học sinh',
        variant: 'destructive'
      })
    }
  }

  const handleFormSuccess = () => {
    fetchStudents()
  }

  const getParentName = (parent: string | Parent) => {
    if (typeof parent === 'string') return 'N/A'
    return parent.name
  }

  const getAge = (dob: string) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Nam'
      case 'female': return 'Nữ'
      default: return 'Khác'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Học sinh</h1>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách học sinh</CardTitle>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Học sinh</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin học sinh trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm học sinh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng học sinh
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Số lượng học sinh đang học
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Học sinh nam
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.gender === 'male').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nam giới
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Học sinh nữ
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.gender === 'female').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nữ giới
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có học sinh nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu bằng cách thêm học sinh đầu tiên
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm học sinh
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên học sinh</TableHead>
                  <TableHead>Tuổi</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Phụ huynh</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{getAge(student.dob)} tuổi</TableCell>
                    <TableCell>{getGenderText(student.gender)}</TableCell>
                    <TableCell>{student.current_grade}</TableCell>
                    <TableCell>{getParentName(student.parent_id)}</TableCell>
                    <TableCell>
                      {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student)}
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

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        student={selectedStudent}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
} 