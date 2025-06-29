import { InferSelectModel, InferInsertModel, eq } from "drizzle-orm";
import { judgment_units } from "../db/judgmentUnits";
import { AddJudgmentUNitDTO } from "../DTOs/JudgmentTypeDtos";

type JudgmentUnit = InferSelectModel<typeof judgment_units>;
type JudgmentUnitCreate = InferInsertModel<typeof judgment_units>;

export class JudgmentUnitRepository {
    private db;
    
    constructor(dbInstance: any) {
        this.db = dbInstance;
    }

    async create(data: AddJudgmentUNitDTO): Promise<JudgmentUnit> {
        const result = await this.db.insert(judgment_units).values(data).returning();
        return result[0];
    }


    async getJudgmentUnitByJudgmentTypeUyapId(id : string){
        const result = await this.db.select({
            uyapId : judgment_units.uyapId,
            name : judgment_units.name
        }).from(judgment_units).where(eq(judgment_units.judgmentTypeUyapId,id))
        return result;
    }
}