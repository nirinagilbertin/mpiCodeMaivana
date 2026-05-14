import { useEffect, useCallback } from "react";
import { initSocket, disconnectSocket } from "../services/socket";

type SocketCallback = (...args: unknown[]) => void;

export function useSocket(_token?: string) {
  useEffect(() => {
    initSocket(_token);
    return () => {
      disconnectSocket();
    };
  }, [_token]);

  const on = useCallback((_event: string, _callback: SocketCallback) => {
    // Socket disabled in frontend for now
  }, []);

  const off = useCallback((_event: string) => {
    // Socket disabled in frontend for now
  }, []);

  const emit = useCallback((_event: string, _data?: unknown) => {
    // Socket disabled in frontend for now
  }, []);

  return { on, off, emit };
}
