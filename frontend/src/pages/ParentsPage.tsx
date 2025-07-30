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
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import ParentForm from '@/components/ParentForm'
import { parentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Parent } from '@/types'

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const { toast } = useToast()

  const fetchParents = async () => {
    try {
      setLoading(true)
      const response = await parentsApi.getAll()
      setParents(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phụ huynh',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParents()
  }, [])

  const handleCreateNew = () => {
    setSelectedParent(null)
    setFormOpen(true)
  }

  const handleEdit = (parent: Parent) => {
    setSelectedParent(parent)
    setFormOpen(true)
  }

  const handleDelete = async (parent: Parent) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phụ huynh "${parent.name}"?`)) {
      return
    }

    try {
      await parentsApi.delete(parent._id)
      toast({
        title: 'Thành công',
        description: 'Xóa phụ huynh thành công'
      })
      fetchParents()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.error || 'Không thể xóa phụ huynh',
        variant: 'destructive'
      })
    }
  }

  const handleFormSuccess = () => {
    fetchParents()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Phụ huynh</h1>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách phụ huynh</CardTitle>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Phụ huynh</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin phụ huynh học sinh
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phụ huynh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng phụ huynh
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parents.length}</div>
            <p className="text-xs text-muted-foreground">
              Số lượng phụ huynh đã đăng ký
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phụ huynh</CardTitle>
        </CardHeader>
        <CardContent>
          {parents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có phụ huynh nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu bằng cách thêm phụ huynh đầu tiên
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm phụ huynh
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số con</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent._id}>
                    <TableCell className="font-medium">
                      {parent.name}
                    </TableCell>
                    <TableCell>{parent.phone}</TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>
                      {parent.children?.length || 0} con
                    </TableCell>
                    <TableCell>
                      {new Date(parent.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(parent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(parent)}
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

      <ParentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        parent={selectedParent}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
} 