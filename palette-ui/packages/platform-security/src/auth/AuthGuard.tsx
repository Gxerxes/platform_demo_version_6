import { Box, Button, CircularProgress, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';

export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

async function handleSignIn(login: () => Promise<void>) {
  await login();
}

export function AuthGuard({ children, fallback, loadingFallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      loadingFallback ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
          <CircularProgress />
        </Box>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      fallback ?? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Sign in required
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please sign in to access this application.
          </Typography>
          <Button variant="contained" onClick={() => void handleSignIn(login)}>
            Sign in
          </Button>
        </Box>
      )
    );
  }

  return <>{children}</>;
}
