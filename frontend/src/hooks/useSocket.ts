import { useEffect, useRef, useCallback } from "react";
import { initSocket, getSocket, disconnectSocket } from "../services/socket";
import { USE_MOCKS } from "../services/api";

type SocketCallback = (...args: unknown[]) => void;

export function useSocket(token?: string) {
  const listenersRef = useRef<Map<string, SocketCallback>>(new Map());

  useEffect(() => {
    if (!USE_MOCKS && token) {
      initSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  const on = useCallback((event: string, callback: SocketCallback) => {
    if (USE_MOCKS) return;

    const socket = getSocket();
    if (socket) {
      socket.on(event, callback);
      listenersRef.current.set(event, callback);
    }
  }, []);

  const off = useCallback((event: string) => {
    if (USE_MOCKS) return;

    const socket = getSocket();
    const callback = listenersRef.current.get(event);
    if (socket && callback) {
      socket.off(event, callback);
      listenersRef.current.delete(event);
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (USE_MOCKS) {
      console.log(`[Mock Socket] emit "${event}"`, data);
      return;
    }

    const socket = getSocket();
    socket?.emit(event, data);
  }, []);

  return { on, off, emit };
}