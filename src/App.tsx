import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profiles } from './pages/Profiles';
import { ProfileDetail } from './pages/ProfileDetail';
import { Search } from './pages/Search';
import { Account } from './pages/Account';
import { Callback } from './pages/Callback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="profiles/:id" element={<ProfileDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;