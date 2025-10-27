import { Queue } from 'bullmq';

export const aiQueue = new Queue('aiQueue', {
  connection: {
    url : process.env.REDIS_URI as string,
  }
});
