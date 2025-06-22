import { eq } from "drizzle-orm";
import { users } from "../db/user";
import { InferModel } from "drizzle-orm";
import { RegisterDto } from "../DTOs/authDto";

type User = InferModel<typeof users>;

export class UserRepository {
  private db;
  constructor(dbInstance: any) {
    this.db = dbInstance;
  }

  async findAll(): Promise<User[]> {
    return this.db.select(
        {
            id: users.id,
            username: users.username,
            email: users.email,
            isVerified: users.isVerified,
        }
    ).from(users);
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await this.db.select(
        {
            id: users.id,
            username: users.username,
            email: users.email,
            isVerified: users.isVerified,
        }
    ).from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async findByUsername(username : string): Promise<User | undefined> {
    const result = await this.db.select(
        {
            id: users.id,
            username: users.username,
            password: users.password,
            email: users.email,
            isVerified: users.isVerified,
        }
    ).from(users).where(eq(users.username,username)).limit(1);
    return result[0]
  }


  async findByEmail(email : string): Promise<User | undefined> {
    const result = await this.db.select(
        {
            id: users.id,
            username: users.username,
            email: users.email,
            isVerified: users.isVerified,
        }
    ).from(users).where(eq(users.email,email)).limit(1);
    return result[0]
  }

  async create(data: RegisterDto): Promise<User[]> {
    const result = await  this.db.insert(users).values(data).returning();
    return result[0];
  }

  async update(id: string, data: { name?: string; email?: string; password?: string }): Promise<User[]> {
    return this.db.update(users).set(data).where(eq(users.id, id)).returning();
  }
}
