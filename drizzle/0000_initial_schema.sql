CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"salt" varchar(64) NOT NULL,
	"auth_provider" varchar(32) DEFAULT 'email' NOT NULL,
	"avatar_url" text,
	"google_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cases" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"title" text NOT NULL,
	"raw_input" text NOT NULL,
	"priority" varchar(32) NOT NULL,
	"input_sources" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users" ("google_id");
CREATE INDEX IF NOT EXISTS "cases_user_id_idx" ON "cases" ("user_id");
CREATE INDEX IF NOT EXISTS "cases_created_at_idx" ON "cases" ("created_at");
CREATE INDEX IF NOT EXISTS "cases_user_created_idx" ON "cases" ("user_id", "created_at");

