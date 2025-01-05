CREATE TABLE IF NOT EXISTS "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(40) NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_index" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_index" ON "contacts" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_index" ON "contacts" USING btree ("last_name");