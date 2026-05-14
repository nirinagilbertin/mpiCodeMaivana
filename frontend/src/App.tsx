import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppRouter } from "./router";

const env = import.meta.env as unknown as {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

console.log(env.VITE_SUPABASE_URL)
console.log(env.VITE_SUPABASE_ANON_KEY)

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;