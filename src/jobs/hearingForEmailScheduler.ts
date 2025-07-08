import cron from 'node-cron';
import dayjs from 'dayjs';

const job = async () => {
  console.log('⏰ Duruşma kontrolü başladı');
  // hearings tablosunu kontrol et
};

cron.schedule('0 */2 * * *', job);

// sunucu ilk başladığında bir defa çalıştır:
job();
