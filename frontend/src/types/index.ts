export interface Parent {
  _id: string;
  name: string;
  phone: string;
  email: string;
  children?: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  _id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  current_grade: string;
  parent_id: string | Parent;
  subscriptions?: Subscription[];
  classRegistrations?: ClassRegistration[];
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  _id: string;
  name: string;
  subject: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  time_slot: string;
  teacher_name: string;
  max_students: number;
  registrations?: ClassRegistration[];
  currentEnrollment?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassRegistration {
  _id: string;
  class_id: string | Class;
  student_id: string | Student;
  registration_date: string;
  status: 'active' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  student_id: string | Student;
  package_name: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  used_sessions: number;
  remaining_sessions?: number;
  status: 'active' | 'expired' | 'cancelled';
  isUsable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface WeeklySchedule {
  monday: Class[];
  tuesday: Class[];
  wednesday: Class[];
  thursday: Class[];
  friday: Class[];
  saturday: Class[];
  sunday: Class[];
}

export interface SubscriptionStatus {
  subscription_id: string;
  student_name: string;
  package_name: string;
  status: string;
  total_sessions: number;
  used_sessions: number;
  remaining_sessions: number;
  start_date: string;
  end_date: string;
  is_usable: boolean;
  days_remaining: number;
}

// Form types
export interface CreateParentForm {
  name: string;
  phone: string;
  email: string;
}

export interface CreateStudentForm {
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  current_grade: string;
  parent_id: string;
}

export interface CreateClassForm {
  name: string;
  subject: string;
  day_of_week: string;
  time_slot: string;
  teacher_name: string;
  max_students: number;
}

export interface CreateSubscriptionForm {
  student_id: string;
  package_name: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
} 