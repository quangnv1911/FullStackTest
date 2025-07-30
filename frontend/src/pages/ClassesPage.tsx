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
import { Plus, Edit, Trash2, BookOpen, Clock, Users, UserPlus, Eye } from 'lucide-react'
import ClassForm from '@/components/ClassForm'
import StudentRegistrationDialog from '@/components/StudentRegistrationDialog'
import ClassStudentsDialog from '@/components/ClassStudentsDialog'
import { classesApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Class, WeeklySchedule } from '@/types'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Thứ 2' },
  { key: 'tuesday', label: 'Thứ 3' },
  { key: 'wednesday', label: 'Thứ 4' },
  { key: 'thursday', label: 'Thứ 5' },
  { key: 'friday', label: 'Thứ 6' },
  { key: 'saturday', label: 'Thứ 7' },
  { key: 'sunday', label: 'Chủ nhật' }
]

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedClassForRegistration, setSelectedClassForRegistration] = useState<Class | null>(null)
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<Class | null>(null)
  const [view, setView] = useState<'list' | 'schedule'>('schedule') // Default to schedule view
  const { toast } = useToast()

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await classesApi.getAll()
      setClasses(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách lớp học',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchWeeklySchedule = async () => {
    try {
      const response = await classesApi.getWeeklySchedule()
      setWeeklySchedule(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch học',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchWeeklySchedule()
  }, [])

  const handleCreateNew = () => {
    setSelectedClass(null)
    setFormOpen(true)
  }

  const handleEdit = (classData: Class) => {
    setSelectedClass(classData)
    setFormOpen(true)
  }

  const handleDelete = async (classData: Class) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lớp học "${classData.name}"?`)) {
      return
    }

    try {
      await classesApi.delete(classData._id)
      toast({
        title: 'Thành công',
        description: 'Xóa lớp học thành công'
      })
      fetchClasses()
      fetchWeeklySchedule()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Không thể xóa lớp học',
        variant: 'destructive'
      })
    }
  }

  const handleRegisterStudent = (classData: Class) => {
    setSelectedClassForRegistration(classData)
    setRegistrationOpen(true)
  }

  const handleViewStudents = (classData: Class) => {
    setSelectedClassForStudents(classData)
    setStudentsDialogOpen(true)
  }

  const handleFormSuccess = () => {
    fetchClasses()
    fetchWeeklySchedule()
  }

  const handleRegistrationSuccess = () => {
    fetchClasses()
    fetchWeeklySchedule()
  }

  const getDayLabel = (day: string) => {
    const dayObj = DAYS_OF_WEEK.find(d => d.key === day)
    return dayObj?.label || day
  }

  const canRegisterMore = (classData: Class) => {
    const currentEnrollment = classData.currentEnrollment || 0
    return currentEnrollment < classData.max_students
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Lớp học</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Lớp học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý lớp học, xem lịch theo tuần và đăng ký học sinh
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'schedule' ? 'default' : 'outline'}
            onClick={() => setView('schedule')}
          >
            <Clock className="h-4 w-4 mr-2" />
            Lịch học
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Danh sách
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm lớp học
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lớp học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Số lượng lớp học đang mở
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Học sinh đăng ký
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((total, cls) => total + (cls.currentEnrollment || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số đăng ký
            </p>
          </CardContent>
        </Card>
      </div>

      {view === 'schedule' ? (
        <Card>
          <CardHeader>
            <CardTitle>Lịch học theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            {!weeklySchedule ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không thể tải lịch học
                </h3>
                <p className="text-gray-600">
                  Vui lòng thử lại sau
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.key} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-center mb-3 text-primary">
                      {day.label}
                    </h3>
                    <div className="space-y-2">
                      {weeklySchedule[day.key as keyof WeeklySchedule]?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Không có lớp
                        </p>
                      ) : (
                        weeklySchedule[day.key as keyof WeeklySchedule]?.map((classItem) => (
                          <div
                            key={classItem._id}
                            className="bg-blue-50 p-2 rounded border-l-4 border-blue-400 group"
                          >
                            <p className="font-medium text-sm">{classItem.name}</p>
                            <p className="text-xs text-gray-600">{classItem.time_slot}</p>
                            <p className="text-xs text-gray-600">{classItem.teacher_name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                {classItem.currentEnrollment || 0}/{classItem.max_students} học sinh
                              </p>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleViewStudents(classItem)}
                                  title="Xem danh sách học sinh"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {canRegisterMore(classItem) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleRegisterStudent(classItem)}
                                    title="Đăng ký học sinh"
                                  >
                                    <UserPlus className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có lớp học nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Bắt đầu bằng cách thêm lớp học đầu tiên
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm lớp học
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên lớp</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ học</TableHead>
                    <TableHead>Giáo viên</TableHead>
                    <TableHead>Học sinh</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem._id}>
                      <TableCell className="font-medium">
                        {classItem.name}
                      </TableCell>
                      <TableCell>{classItem.subject}</TableCell>
                      <TableCell>{getDayLabel(classItem.day_of_week)}</TableCell>
                      <TableCell>{classItem.time_slot}</TableCell>
                      <TableCell>{classItem.teacher_name}</TableCell>
                      <TableCell>
                        <span className={canRegisterMore(classItem) ? 'text-green-600' : 'text-red-600'}>
                          {classItem.currentEnrollment || 0}/{classItem.max_students}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewStudents(classItem)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Xem danh sách học sinh"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canRegisterMore(classItem) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegisterStudent(classItem)}
                              className="text-green-600 hover:text-green-700"
                              title="Đăng ký học sinh"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(classItem)}
                            title="Chỉnh sửa lớp học"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(classItem)}
                            className="text-destructive hover:text-destructive"
                            title="Xóa lớp học"
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
      )}

      <ClassForm
        open={formOpen}
        onOpenChange={setFormOpen}
        classData={selectedClass}
        onSuccess={handleFormSuccess}
      />

      <StudentRegistrationDialog
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        selectedClass={selectedClassForRegistration}
        onSuccess={handleRegistrationSuccess}
      />

      <ClassStudentsDialog
        open={studentsDialogOpen}
        onOpenChange={setStudentsDialogOpen}
        classId={selectedClassForStudents?._id || null}
        className={selectedClassForStudents?.name}
      />
    </div>
  )
} 