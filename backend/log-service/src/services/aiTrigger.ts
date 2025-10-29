import axios from 'axios';
export const aiTrigger = async (logData: any) => {
  try {
    await axios.post(
      `${process.env.AI_SERVICE_URL}/analyse`,
      logData,
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
