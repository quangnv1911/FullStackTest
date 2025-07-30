import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ParentsPage from './pages/ParentsPage'
import StudentsPage from './pages/StudentsPage'
import ClassesPage from './pages/ClassesPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="parents" element={<ParentsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App 