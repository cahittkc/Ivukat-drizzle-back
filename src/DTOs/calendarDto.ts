import {z} from "zod"

export const calendarTypeEnum = z.enum([
    'meeting',
    'conference',
    'hearing',
    'settlement',
    'other',
]);

export const newCalendarSchema = z.object({
    userId: z.string().uuid(),
    title: z.string().min(3, 'Başlık alanı minimum 3 karakter olmalıdır').max(20, 'Başlık alanı en fazla 20 karakter olmalıdır'),
    description: z.string().nullable(),
    date: z.coerce.date(),
    type: calendarTypeEnum,
}).strict()


export type NewCalendarDto = z.infer<typeof newCalendarSchema>;