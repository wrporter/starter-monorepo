CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(40) NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_email_index" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contacts_first_name_index" ON "contacts" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "contacts_last_name_index" ON "contacts" USING btree ("last_name");