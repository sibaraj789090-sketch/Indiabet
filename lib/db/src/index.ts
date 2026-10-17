import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { InMemoryStore } from "./mock";

const { Pool } = pg;

let pool: any = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[AI Studio] Database connection error — switching to in-memory store:", err);
    const store = new InMemoryStore();
    db = store.createMockDb();
  }
} else {
  console.info("[AI Studio] DATABASE_URL not set — using in-memory store with seeded catalog");
  const store = new InMemoryStore();
  db = store.createMockDb();
}

export { pool, db };
export * from "./schema";
