import {z} from "zod"

export const customerTypeEnum = z.enum([
    'person',
    'corporation'
]);

export const newCustomerSchema = z.object({
    userId : z.string(),
    firstName : z.string().min(3, "Ad en az 3 karakter olmalı").max(40, "Ad en fazla 40 karakter olabilir").nullable().optional(),
    middleName : z.string().min(3, "Ortadaki ad en az 3 karakter olmalı").max(40, "Ortadaki ad en fazla 40 karakter olabilir").nullable().optional(),
    lastName : z.string().min(3, "Soyad en az 3 karakter olmalı").max(40, "Soyad en fazla 40 karakter olabilir").nullable().optional(),
    companyName : z.string().min(3, "Kurum adı en az 3 karakter olmalı").max(255, "Kurum adı en fazla 40 karakter olabilir").nullable().optional(),
    type : customerTypeEnum,
    identityNumber : z.string().min(11,'Kimlik numarası minimum 11 haneli olmalıdır').max(11, 'Kimlik numarası maksimum 11 haneli olmalıdır').nullable(),
    taxNumber : z.string().min(10,'Vergi numarası minimum 10 haneli olmalıdır').max(10, 'Vergi numarası maksimum 10 haneli olmalıdır').nullable(),
    caseNumber: z.array(z.string()),
  }).strict();


  export type NewCustomerDto = z.infer<typeof newCustomerSchema>;