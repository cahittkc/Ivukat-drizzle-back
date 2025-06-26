import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı").max(40, "Kullanıcı adı en fazla 40 karakter olabilir"),
  firstName : z.string().min(2, "Ad en az 2 karakter olmalı").max(40, "Ad en fazla 40 karakter olabilir"),
  middleName : z.string().min(2, "Ortadaki ad en az 2 karakter olmalı").max(40, "Ortadaki ad en fazla 40 karakter olabilir").nullable(),
  lastName : z.string().min(2, "Soyad en az 2 karakter olmalı").max(40, "Soyad en fazla 40 karakter olabilir"),
  email: z.string().email("Geçerli bir email giriniz").max(40, "Email en fazla 40 karakter olabilir"),
  isVerified : z.boolean().default(false),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı").max(255, "Şifre en fazla 255 karakter olabilir"),
}).strict();



export const loginSchema = z.object({
  username: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı").max(40, "Kullanıcı adı en fazla 40 karakter olabilir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı").max(255, "Şifre en fazla 255 karakter olabilir"),
}).strict();



export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
