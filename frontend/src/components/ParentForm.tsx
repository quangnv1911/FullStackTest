import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { parentsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { Parent, CreateParentForm } from '@/types'

interface ParentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parent?: Parent | null
  onSuccess: () => void
}

export default function ParentForm({ open, onOpenChange, parent, onSuccess }: ParentFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateParentForm>({
    name: parent?.name || '',
    phone: parent?.phone || '',
    email: parent?.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      if (parent) {
        // Update existing parent
        await parentsApi.update(parent._id, formData)
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin phụ huynh thành công'
        })
      } else {
        // Create new parent
        await parentsApi.create(formData)
        toast({
          title: 'Thành công', 
          description: 'Tạo phụ huynh mới thành công'
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
      phone: '',
      email: ''
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  // Update form when parent prop changes
  useState(() => {
    if (parent) {
      setFormData({
        name: parent.name,
        phone: parent.phone,
        email: parent.email
      })
    } else {
      resetForm()
    }
  }, [parent])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {parent ? 'Sửa thông tin phụ huynh' : 'Thêm phụ huynh mới'}
          </DialogTitle>
          <DialogDescription>
            {parent 
              ? 'Cập nhật thông tin phụ huynh dưới đây'
              : 'Điền thông tin để tạo phụ huynh mới'
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
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập email"
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
              {loading ? 'Đang xử lý...' : (parent ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 