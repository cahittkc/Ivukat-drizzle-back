import { eq, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { judgment_types } from "../db/judgmentType";
import { AddJudgmentDto } from "../DTOs/JudgmentTypeDtos";


type JudgmentType = InferSelectModel<typeof judgment_types>;


export class JudgmentTypeRepository {
    private db;
    
    constructor(dbInstance: any) {
        this.db = dbInstance;
    }
    
    async create(data: AddJudgmentDto): Promise<JudgmentType> {
        const result = await this.db.insert(judgment_types).values(data).returning();
        return result[0];
    }

    async getAll() : Promise<JudgmentType[]> {
        const result = await this.db.select().from(judgment_types);
        return result;
    }

    async delete(id: number): Promise<JudgmentType> {
        const result = await this.db
            .delete(judgment_types)
            .where(eq(judgment_types.id, id))
            .returning();
        return result[0];
    }
}


