import { CronJob } from 'cron';

export default async function job(fn) {
  return new CronJob('00 15 09 * * 0-6', fn, null, true, 'Africa/Lagos', null, true);
}
