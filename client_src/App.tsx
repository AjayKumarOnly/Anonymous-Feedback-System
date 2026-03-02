import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CipherLayout } from './components/layout/CipherLayout'
import { StudentFeedbackPage } from './components/student/StudentFeedbackPage'
import { StaffLoginPage } from './components/staff/StaffLoginPage'
import { StaffDashboardPage } from './components/staff/StaffDashboardPage'
import { StaffGroupPage } from './components/staff/StaffGroupPage'
import { StudentLoginPage } from './components/student/StudentLoginPage'
import { StudentDashboardPage } from './components/student/StudentDashboardPage'
import { StudentGroupPage } from './components/student/StudentGroupPage'
import { useAuth } from './components/staff/auth-context'

const TeacherRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || user?.role !== 'teacher') {
    return <Navigate to="/teacher/login" replace />
  }
  return <>{children}</>
}

const StudentRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/student/login" replace />
  }
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <CipherLayout>
      <Routes>
        {/* Landing redirects to student login by default */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />

        {/* Teacher Routes */}
        <Route path="/teacher/login" element={<StaffLoginPage />} />
        <Route
          path="/teacher/dashboard"
          element={
            <TeacherRoute>
              <StaffDashboardPage />
            </TeacherRoute>
          }
        />
        <Route
          path="/teacher/group/:groupId"
          element={
            <TeacherRoute>
              <StaffGroupPage />
            </TeacherRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboardPage />
            </StudentRoute>
          }
        />
        <Route
          path="/student/group/:groupId"
          element={
            <StudentRoute>
              <StudentGroupPage />
            </StudentRoute>
          }
        />

        {/* Legacy feedback route, updated to just be under student */}
        <Route path="/feedback/:topicId" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/feedback/:topicId" element={<StudentFeedbackPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CipherLayout>
  )
}

export default App
