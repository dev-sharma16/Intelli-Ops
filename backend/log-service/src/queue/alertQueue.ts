import { Queue } from 'bullmq';

export const alertQueue = new Queue('alertQueue', {
  connection: {
    url : process.env.REDIS_URI as string,
  }
});
