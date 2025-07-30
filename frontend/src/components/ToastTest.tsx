import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export default function ToastTest() {
  const { toast } = useToast()

  const testSuccessToast = () => {
    toast({
      title: 'Thành công',
      description: 'Đây là thông báo thành công!'
    })
  }

  const testErrorToast = () => {
    toast({
      title: 'Lỗi',
      description: 'Đây là thông báo lỗi!',
      variant: 'destructive'
    })
  }

  const testRegistrationSuccess = () => {
    toast({
      title: 'Thành công',
      description: 'Đã đăng ký học sinh vào lớp "Toán học cơ bản" thành công'
    })
  }

  const testRegistrationError = () => {
    toast({
      title: 'Lỗi đăng ký',  
      description: 'Student already has a class at this time slot',
      variant: 'destructive'
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Test Toast Notifications</h3>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={testSuccessToast} variant="default">
          Test Success Toast
        </Button>
        <Button onClick={testErrorToast} variant="destructive">
          Test Error Toast
        </Button>
        <Button onClick={testRegistrationSuccess} variant="outline">
          Test Registration Success
        </Button>
        <Button onClick={testRegistrationError} variant="outline">
          Test Registration Error
        </Button>
      </div>
    </div>
  )
} 