'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { AuthProvider } from '../hooks/useAuth';
import { SocketProvider } from './SocketProvider';
import { Toaster } from 'sonner';

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AuthProvider>
          {children}
          <Toaster theme="dark" richColors position="top-center" />
        </AuthProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}
