import axios from 'axios';

export const triggerAlert = async (log: any) => {
  try {
    await axios.post(`${process.env.ALERT_SERVICE_URL}/alerts/create`, 
      {
        projectId: log.projectId,
        userId: log.userId,
        message: log.message,
        level: log.level,
        source: log.source,
        timestamp: log.createdAt,
      },
      {
        headers: {
          'x-service-key' : process.env.SERVICE_SECRET
        }
      }
    );
  } catch (err: any) {
    console.error('Failed to trigger alert:', err.message);
  }
};
