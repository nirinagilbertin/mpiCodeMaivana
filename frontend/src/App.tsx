import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppRouter } from "./router";
import { supabase } from './lib/supabase';

supabase.from('reports').select('*').then(({ data, error }) => {
  console.log('✅ Connexion Supabase OK :', data);
  console.log('❌ Erreur :', error);
});

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;