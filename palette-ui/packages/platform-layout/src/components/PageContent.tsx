import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { LAYOUT_CONSTANTS } from '../constants';

export interface PageContentProps {
  children: ReactNode;
  maxWidth?: number | false;
}

export function PageContent({ children, maxWidth = false }: PageContentProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: `${LAYOUT_CONSTANTS.CONTENT_PADDING}px`,
        overflow: 'auto',
        ...(maxWidth && { maxWidth, mx: 'auto', width: '100%' }),
      }}
    >
      {children}
    </Box>
  );
}
