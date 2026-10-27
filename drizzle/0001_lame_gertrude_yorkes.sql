CREATE TABLE `admin_audit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`action` varchar(40) NOT NULL,
	`entity` varchar(40) NOT NULL,
	`entityId` int,
	`summary` varchar(300) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_audit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`actorUserId` int NOT NULL,
	`deltaQuantity` int NOT NULL,
	`note` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `managed_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module` enum('projects','testimonials','services','partners','finance','team','stock') NOT NULL,
	`title` varchar(180) NOT NULL,
	`category` varchar(120),
	`description` text,
	`status` varchar(24) NOT NULL DEFAULT 'draft',
	`amountCents` int,
	`direction` varchar(16),
	`quantity` int,
	`minimumQuantity` int,
	`unit` varchar(32),
	`url` varchar(2048),
	`sortOrder` int NOT NULL DEFAULT 0,
	`data` json NOT NULL,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`archivedAt` timestamp,
	CONSTRAINT `managed_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`contentType` varchar(120) NOT NULL,
	`byteSize` int NOT NULL,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `quote_attachments_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `quote_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`actorUserId` int NOT NULL,
	`fromStatus` varchar(24) NOT NULL,
	`toStatus` varchar(24) NOT NULL,
	`note` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_upload_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`tokenHash` varchar(64) NOT NULL,
	`uploadCount` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_upload_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `quote_upload_tickets_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(24) NOT NULL,
	`projectType` varchar(120) NOT NULL,
	`objective` varchar(500) NOT NULL,
	`city` varchar(160) NOT NULL,
	`measurements` varchar(500),
	`desiredTimeline` varchar(120),
	`budgetRange` varchar(120),
	`message` text,
	`fullName` varchar(180) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`email` varchar(320) NOT NULL,
	`privacyAcceptedAt` timestamp NOT NULL,
	`status` enum('new','contacted','converted','lost') NOT NULL DEFAULT 'new',
	`estimatedValueCents` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotes_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(80) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
ALTER TABLE `admin_audit` ADD CONSTRAINT `admin_audit_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_movements` ADD CONSTRAINT `inventory_movements_recordId_managed_records_id_fk` FOREIGN KEY (`recordId`) REFERENCES `managed_records`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_movements` ADD CONSTRAINT `inventory_movements_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `managed_records` ADD CONSTRAINT `managed_records_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_attachments` ADD CONSTRAINT `quote_attachments_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_status_history` ADD CONSTRAINT `quote_status_history_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_status_history` ADD CONSTRAINT `quote_status_history_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_upload_tickets` ADD CONSTRAINT `quote_upload_tickets_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_updatedBy_users_id_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `admin_audit_created_idx` ON `admin_audit` (`createdAt`);--> statement-breakpoint
CREATE INDEX `managed_records_module_status_idx` ON `managed_records` (`module`,`status`,`archivedAt`);--> statement-breakpoint
CREATE INDEX `managed_records_finance_idx` ON `managed_records` (`module`,`direction`,`createdAt`);--> statement-breakpoint
CREATE INDEX `quote_attachments_quote_idx` ON `quote_attachments` (`quoteId`,`deletedAt`);--> statement-breakpoint
CREATE INDEX `quote_upload_tickets_expiry_idx` ON `quote_upload_tickets` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `quotes_status_created_idx` ON `quotes` (`status`,`createdAt`);