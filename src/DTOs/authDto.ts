import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı").max(40, "Kullanıcı adı en fazla 40 karakter olabilir"),
  email: z.string().email("Geçerli bir email giriniz").max(40, "Email en fazla 40 karakter olabilir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı").max(255, "Şifre en fazla 255 karakter olabilir"),
}).strict();



export type RegisterDto = z.infer<typeof registerSchema>;
