import { defineConfig } from "drizzle-kit";

const landingDatabaseUrl = process.env.LANDING_DATABASE_URL;

if (!landingDatabaseUrl) {
  throw new Error("LANDING_DATABASE_URL must be set; ensure the landing database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: landingDatabaseUrl,
  },
});
