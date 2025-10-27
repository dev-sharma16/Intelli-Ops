import { Worker } from 'bullmq';
import { processLog } from '../services/ai.service';

const aiWorker = new Worker(
  'aiQueue',
  async (job) => {
    console.log('📥 Received job for analysis:', job.name);
    await processLog(job.data);
    console.log('✅ Analysis complete for job:', job.id);
  },
  {
    connection: { url: process.env.REDIS_URI },
  }
);

aiWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});
