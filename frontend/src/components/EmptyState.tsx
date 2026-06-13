import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface EmptyStateProps {
  onCreateTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTask }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      textAlign="center"
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        No tasks found
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        You don't have any tasks yet. Create your first task to get started.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateTask}
      >
        Create your first task
      </Button>
    </Box>
  );
};
