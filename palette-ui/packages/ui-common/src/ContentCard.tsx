import { Card, CardContent, type CardProps } from '@mui/material';
import type { ReactNode } from 'react';

export interface ContentCardProps extends CardProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function ContentCard({ children, noPadding = false, ...cardProps }: ContentCardProps) {
  return (
    <Card variant="outlined" {...cardProps}>
      {noPadding ? children : <CardContent>{children}</CardContent>}
    </Card>
  );
}
