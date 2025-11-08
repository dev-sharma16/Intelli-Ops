import axios from 'axios';

export const alertTrigger = async (log: any) => {
  try {
    await axios.post(`${process.env.ALERT_SERVICE_URL}/create`, 
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
