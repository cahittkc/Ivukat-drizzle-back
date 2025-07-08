import { InferSelectModel } from "drizzle-orm"
import { hearing } from "../db/hearing"
import { hearing_parties } from "../db/hearingParties"
import { eq, and, gte, lte } from "drizzle-orm"

type SelectHearing = InferSelectModel<typeof hearing>
type SelectHearingParties = InferSelectModel<typeof hearing_parties>

export class HearingRepository {
    private db 

    constructor(dbInstance : any){
        this.db = dbInstance
    }

    async getHearingAndParties(userId : string) {
        try {
            // LEFT JOIN ile hearing'leri ve parties'leri çek
            const hearingsWithParties = await this.db
                .select({
                    // Hearing bilgileri
                    esasNo: hearing.esasNo,
                    hearingId: hearing.hearingId,
                    courtId: hearing.courtId,
                    judgmentUnitUyapId: hearing.judgmentUnitUyapId,
                    caseTypeDescription: hearing.caseTypeDescription,
                    courtNameDescription: hearing.courtNameDescription,
                    hearingDate: hearing.hearingDate,
                    hearingDescription: hearing.hearingDescription,
                    hearingResultDescription: hearing.hearingResultDescription,
                    // Party bilgileri (null olabilir)
                    partyId: hearing_parties.id,
                    partyName: hearing_parties.name,
                    partyLastName: hearing_parties.lastName,
                    partyAttribution: hearing_parties.attribution
                })
                .from(hearing)
                .leftJoin(hearing_parties, eq(hearing.hearingId, hearing_parties.hearingId))
                .where(eq(hearing.userId, userId))
                .orderBy(hearing.hearingDate, hearing.hearingId);

            // Sonuçları grupla - her hearing için parties'leri topla
            const groupedHearings = hearingsWithParties.reduce((acc, row) => {
                const hearingKey = row.hearingId;
                
                if (!acc[hearingKey]) {
                    // İlk kez bu hearing'i görüyoruz, yeni hearing objesi oluştur
                    acc[hearingKey] = {
                        id: row.id,
                        userId: row.userId,
                        esasNo: row.esasNo,
                        hearingId: row.hearingId,
                        courtId: row.courtId,
                        judgmentUnitUyapId: row.judgmentUnitUyapId,
                        caseTypeDescription: row.caseTypeDescription,
                        courtNameDescription: row.courtNameDescription,
                        hearingDate: row.hearingDate,
                        hearingDescription: row.hearingDescription,
                        hearingResultDescription: row.hearingResultDescription,
                        parties: []
                    };
                }

                // Eğer party varsa (partyId null değilse) parties array'ine ekle
                if (row.partyId) {
                    acc[hearingKey].parties.push({
                        name: row.partyName,
                        lastName: row.partyLastName,
                        attribution: row.partyAttribution
                    });
                }

                return acc;
            }, {} as Record<number, any>);

            // Object.values ile array'e çevir
            return Object.values(groupedHearings);

        } catch (error) {
            console.error('Error fetching hearings with parties:', error);
            throw error;
        }
    }

    // Sadece hearing'leri çekmek için (parties olmadan)
    async getHearings(data: { userId: string; startDate: string; endDate: string }) {
        try {
            let query = this.db
                .select()
                .from(hearing)
                .where(
                    and(
                      eq(hearing.userId, data.userId),
                      gte(hearing.hearingDate, new Date(data.startDate)),
                      lte(hearing.hearingDate, new Date(data.endDate))
                    )
                  );

            
            return await query.orderBy(hearing.hearingDate, hearing.hearingId);
        } catch (error) {
            console.error('Error fetching hearings:', error);
            throw error;
        }
    }

    // Belirli bir hearing'in parties'lerini çekmek için
    async getPartiesByHearingId(hearingId: number) {
        try {
            return await this.db
                .select()
                .from(hearing_parties)
                .where(eq(hearing_parties.hearingId, hearingId));
        } catch (error) {
            console.error('Error fetching parties for hearing:', error);
            throw error;
        }
    }
}