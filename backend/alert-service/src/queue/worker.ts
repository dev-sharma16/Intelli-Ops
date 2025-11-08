import { Worker } from 'bullmq';
import axios from 'axios';

const redisUrl = process.env.REDIS_URI;
if (!redisUrl) {
  console.error('❌ REDIS_URI environment variable is not set. Worker cannot start.');
  process.exit(1);
}

console.log('🚀 Starting alert worker, connecting to Redis:', redisUrl);
const alertWorker = new Worker(
  'alertQueue',
  async (job) => {
    console.log(`📥 Received job for sending alert: ${job.name}`);
    // todo : change the alert service url with production one
    const alertServiceURL = process.env.ALERT_SERVICE_URL || 'http://localhost:3002';
    // const alertServiceURL = "http://localhost:3002/api/alert"

    try {
      console.log('job is listened...!');
      const response = await axios.post(
        `${alertServiceURL}/create`,
        job.data,
        {
          headers: {
            'x-service-key': process.env.SERVICE_SECRET,
          },
        }
      );
      console.log('✅ Alert processed and sended for job :', job.id);
    } catch (err: any) {
      console.error('❌ Failed to call alert controller:', err.message);
      if (err.response) {
        console.error('Response data:', err.response.data);
      }
    }
  },
  {
    connection: { url: redisUrl },
  }
);

alertWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

alertWorker.on('active', (job) => {
  console.log(`🔄 Job ${job.id} is now being processed.`);
});

alertWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});
