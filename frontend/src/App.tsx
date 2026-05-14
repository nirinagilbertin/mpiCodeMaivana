import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppRouter } from "./router";

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