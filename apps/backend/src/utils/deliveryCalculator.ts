// src/utils/deliveryCalculator.ts
import { Product, StoreSetting } from '@prisma/client';

export const calculateDeliveryDate = (product: Product, settings: StoreSetting): string => {
    let leadTime = product.fulfillmentLeadTimeDays ?? settings.fulfillmentLeadTimeDays;
    const cutoffTime = product.orderCutoffTime || settings.orderCutoffTime;
    const workingDays = product.workingDays.length > 0 ? product.workingDays : settings.workingDays;
    const holidays = settings.holidayDates.map(d => d.toISOString().split('T')[0]); // Faqat sana qismini olamiz

    const now = new Date();
    const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);

    let currentDate = new Date();

    // Agar buyurtma cutoff'dan keyin berilsa, ertangi kundan boshlab hisoblaymiz
    if (now.getHours() > cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() >= cutoffMinute)) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // leadTime 0 bo'lsa, o'sha kunni tekshiramiz
    if (leadTime === 0) {
        while (!workingDays.includes(currentDate.getDay() === 0 ? 7 : currentDate.getDay()) || holidays.includes(currentDate.toISOString().split('T')[0])) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // Ish kunlarini hisobga olib, kerakli kunlarni o'tkazamiz
    while (leadTime > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (workingDays.includes(currentDate.getDay() === 0 ? 7 : currentDate.getDay()) && !holidays.includes(currentDate.toISOString().split('T')[0])) {
            leadTime--;
        }
    }

    // Foydalanuvchiga tushunarli formatda qaytaramiz
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (currentDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
        return `Bugun, ${cutoffTime} gacha`;
    }
    if (currentDate.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
        return "Ertaga";
    }

    return `${currentDate.getDate()}-${currentDate.toLocaleString('default', { month: 'long' })}`;
};