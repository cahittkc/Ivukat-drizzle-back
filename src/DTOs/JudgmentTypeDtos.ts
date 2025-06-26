import { z } from "zod";


export const addJugmentSchema = z.object({
    name: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı").max(255, "Name en fazla 40 karakter olabilir"),
    uyapId : z.string().max(40, "Uyap id en fazla 40 karakter olabilir"),
   
  }).strict();



  export type AddJudgmentDto = z.infer<typeof addJugmentSchema>; 