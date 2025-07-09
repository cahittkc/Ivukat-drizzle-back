import cron from 'node-cron';
import dayjs from 'dayjs';
import { db } from '../db';
import { hearing } from '../db/hearing';
import { users } from '../db/user';
import { sendMail } from '../services/emailService';
import { eq } from 'drizzle-orm';

const job = async () => {
  console.log('⏰ Duruşma kontrolü başladı');
  // Şu anki zamanı al
  const now = dayjs();
  // 2 saat sonrası
  const twoHoursLater = now.add(2, 'hour');

  // Duruşmaları ve kullanıcı email'lerini birlikte çek
  const hearingsWithUsers = await db
    .select({
      hearingId: hearing.hearingId,
      esasNo: hearing.esasNo,
      hearingDate: hearing.hearingDate,
      courtNameDescription: hearing.courtNameDescription,
      hearingDescription: hearing.hearingDescription,
      userEmail: users.email,
      firstName: users.firstName,
      lastName: users.lastName
    })
    .from(hearing)
    .innerJoin(users, eq(hearing.userId, users.id));

  // 2 saatten az kalanları filtrele
  const soonHearings = hearingsWithUsers.filter(h => {
    if (!h.hearingDate) return false;
    const hearingTime = dayjs(h.hearingDate);
    return hearingTime.isAfter(now) && hearingTime.isBefore(twoHoursLater);
  });

  // Sonuçları logla ve email gönder
  if (soonHearings.length > 0) {
    console.log('2 saatten az kalan duruşmalar:', soonHearings.length, 'adet');
    
    // Her duruşma için email gönder
    for (const hearing of soonHearings) {
      const hearingTime = dayjs(hearing.hearingDate);
      const timeUntilHearing = hearingTime.diff(now, 'hour', true);
      
      const subject = `${hearing.hearingDescription} - ${hearing.esasNo} - ${hearing.courtNameDescription}`;
      const html = `
        <h2>Duruşma Hatırlatması</h2>
        <p>Sayın ${hearing.firstName} ${hearing.lastName},</p>
        <p>Aşağıdaki duruşmanıza <strong>${timeUntilHearing.toFixed(1)} saat</strong> kalmıştır:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Esas No:</strong> ${hearing.esasNo}</p>
          <p><strong>Mahkeme:</strong> ${hearing.courtNameDescription}</p>
          <p><strong>Duruşma Tarihi:</strong> ${hearingTime.format('DD/MM/YYYY HH:mm')}</p>
          <p><strong>Duruşma Açıklaması:</strong> ${hearing.hearingDescription}</p>
          <p><strong>Duruşma ID:</strong> ${hearing.hearingId}</p>
        </div>
        <p style="color: #dc3545; font-weight: bold;">Lütfen duruşmanıza zamanında katılmayı unutmayın!</p>
      `;
      
      try {
        await sendMail(hearing.userEmail, subject, html);
        console.log(`✅ Email gönderildi: ${hearing.userEmail} - ${subject}`);
      } catch (error) {
        console.error(`❌ Email gönderilemedi: ${hearing.userEmail}`, error);
      }
    }
  } else {
    console.log('2 saatten az kalan duruşma yok.');
  }
};

cron.schedule('0 */2 * * *', job);

// sunucu ilk başladığında bir defa çalıştır:
job();
