import React from 'react';
import { Paper, Box, Typography, Alert, Chip, Divider } from '@mui/material';
import { AnalyticsData } from '../services/api';

interface AnalyticsPanelProps {
  data: AnalyticsData | null;
  unavailable: boolean;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data, unavailable }) => {
  if (unavailable) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Analytics unavailable — Python service may not be running.
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Task Analytics
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        {/* Summary stats */}
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">{data.total_tasks}</Typography>
          <Typography variant="caption" color="textSecondary">Total</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">{data.completion_percentage}%</Typography>
          <Typography variant="caption" color="textSecondary">Completed</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Status breakdown */}
        <Box>
          <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>By Status</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {Object.entries(data.tasks_by_status).map(([status, count]) => (
              <Chip
                key={status}
                label={`${status}: ${count}`}
                size="small"
                variant="outlined"
                color={
                  status === 'completed' ? 'success' :
                  status === 'in-progress' ? 'warning' : 'default'
                }
              />
            ))}
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Priority breakdown */}
        <Box>
          <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>By Priority</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {Object.entries(data.tasks_by_priority).map(([priority, count]) => (
              <Chip
                key={priority}
                label={`${priority}: ${count}`}
                size="small"
                variant="outlined"
                color={
                  priority === 'high' ? 'error' :
                  priority === 'medium' ? 'warning' : 'info'
                }
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
