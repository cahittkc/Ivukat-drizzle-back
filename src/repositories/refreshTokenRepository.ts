import { eq, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { refresh_tokens } from "../db/refresh_token";

// SELECT işlemleri için (veritabanından okuma)
type RefreshToken = InferSelectModel<typeof refresh_tokens>;

// INSERT işlemleri için (veritabanına yazma)
type NewRefreshToken = InferInsertModel<typeof refresh_tokens>;

export class RefreshTokenRepository {
    private db;
    
    constructor(dbInstance: any) {
        this.db = dbInstance;
    }
    
    async create(data: NewRefreshToken): Promise<RefreshToken> {
        const result = await this.db.insert(refresh_tokens).values(data).returning();
        return result[0];
    }
    
    async findBySessionId(sessionId: string): Promise<RefreshToken | undefined> {
        const result = await this.db.select().from(refresh_tokens)
            .where(eq(refresh_tokens.sessionId, sessionId)).limit(1);
        return result[0];
    }
    
    async invalidateSession(sessionId: string): Promise<void> {
        await this.db.update(refresh_tokens)
            .set({ isValid: false })
            .where(eq(refresh_tokens.sessionId, sessionId));
    }
}


