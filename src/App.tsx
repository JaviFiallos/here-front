import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;