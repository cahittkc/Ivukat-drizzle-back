import {z} from "zod"

export const customerTypeEnum = z.enum([
    'person',
    'company'
]);

export const newCustomerSchema = z.object({
    userId : z.string(),
    firstName : z.string().min(3, "Ad en az 3 karakter olmalı").max(40, "Ad en fazla 40 karakter olabilir").nullable().optional(),
    middleName : z.string().min(3, "Ortadaki ad en az 3 karakter olmalı").max(40, "Ortadaki ad en fazla 40 karakter olabilir").nullable().optional(),
    lastName : z.string().min(3, "Soyad en az 3 karakter olmalı").max(40, "Soyad en fazla 40 karakter olabilir").nullable().optional(),
    companyName : z.string().min(3, "Kurum adı en az 3 karakter olmalı").max(255, "Kurum adı en fazla 40 karakter olabilir").nullable().optional(),
    customerType : customerTypeEnum,
    identityNumber : z.string().regex(/^\d{11}$/, 'Tc kimlik numarası 11 haneli rakamlardan oluşmalıdır').nullable().optional(),
    taxNumber : z.string().regex(/^\d{10}$/, 'Vergi numarası 10 haneli rakamlardan oluşmalıdır').nullable().optional(),
    caseNumber: z.array(z.string()).optional(),
    normalizeName : z.string().optional(),
    normalizeCompanyName : z.string().optional()
  })


  export type NewCustomerDto = z.infer<typeof newCustomerSchema>;