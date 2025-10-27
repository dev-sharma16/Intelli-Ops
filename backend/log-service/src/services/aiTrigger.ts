import axios from 'axios';
export const aiTrigger = async (log: any) => {
  try {
    await axios.post(
      `${process.env.AI_SERVICE_URL}/analyse`,
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
          'x-service-key': process.env.SERVICE_SECRET,
        },
      }
    );
  } catch (err: any) {
    console.error('Failed to trigger alert:', err.message);
  }
};
