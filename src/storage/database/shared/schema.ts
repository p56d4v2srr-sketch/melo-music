import { pgTable, uniqueIndex, index, foreignKey, varchar, timestamp, serial, integer, text, boolean, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const gen_random_uuid = () => sql`gen_random_uuid()`



export const follows = pgTable("follows", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	followerId: varchar("follower_id", { length: 36 }).notNull(),
	followingId: varchar("following_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("follows_follower_following_idx").using("btree", table.followerId.asc().nullsLast().op("text_ops"), table.followingId.asc().nullsLast().op("text_ops")),
	index("follows_following_id_idx").using("btree", table.followingId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.id],
			name: "follows_follower_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [users.id],
			name: "follows_following_id_users_id_fk"
		}),
]);

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const hotSearch = pgTable("hot_search", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	keyword: varchar({ length: 100 }).notNull(),
	category: varchar({ length: 20 }).default('song').notNull(),
	score: integer().default(0).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("hot_search_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("hot_search_score_idx").using("btree", table.score.asc().nullsLast().op("int4_ops")),
]);

export const collects = pgTable("collects", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("collects_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	uniqueIndex("collects_user_song_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.songId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collects_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "collects_song_id_songs_id_fk"
		}),
]);

export const likes = pgTable("likes", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("likes_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	uniqueIndex("likes_user_song_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.songId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "likes_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "likes_song_id_songs_id_fk"
		}),
]);

export const plays = pgTable("plays", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	playedAt: timestamp("played_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	duration: integer().default(0).notNull(),
}, (table) => [
	index("plays_played_at_idx").using("btree", table.playedAt.asc().nullsLast().op("timestamptz_ops")),
	index("plays_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	index("plays_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "plays_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "plays_song_id_songs_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	email: varchar({ length: 255 }),
	nickname: varchar({ length: 100 }).notNull(),
	avatar: varchar({ length: 500 }),
	bio: text(),
	slogan: varchar({ length: 200 }),
	isAiArtist: boolean("is_ai_artist").default(false).notNull(),
	followerCount: integer("follower_count").default(0).notNull(),
	followingCount: integer("following_count").default(0).notNull(),
	songCount: integer("song_count").default(0).notNull(),
	totalPlayCount: integer("total_play_count").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_is_ai_artist_idx").using("btree", table.isAiArtist.asc().nullsLast().op("bool_ops")),
]);

export const artists = pgTable("artists", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }),
	name: varchar({ length: 100 }).notNull(),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	slogan: varchar({ length: 200 }),
	bio: text(),
	gender: varchar({ length: 20 }),
	ageGroup: varchar("age_group", { length: 20 }),
	personalityTags: jsonb("personality_tags"),
	styleTags: jsonb("style_tags"),
	singingTechniques: jsonb("singing_techniques"),
	languagePreference: varchar("language_preference", { length: 20 }),
	debutDate: varchar("debut_date", { length: 20 }),
	region: varchar({ length: 50 }),
	isAiGenerated: boolean("is_ai_generated").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("artists_is_ai_generated_idx").using("btree", table.isAiGenerated.asc().nullsLast().op("bool_ops")),
	index("artists_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "artists_user_id_users_id_fk"
		}),
]);

export const aiAnalysis = pgTable("ai_analysis", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	lyricsAnalysis: text("lyrics_analysis"),
	songAnalysis: text("song_analysis"),
	ratings: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("ai_analysis_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "ai_analysis_song_id_songs_id_fk"
		}),
]);

export const comments = pgTable("comments", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	parentId: varchar("parent_id", { length: 36 }),
	content: text().notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	isPinned: boolean("is_pinned").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("comments_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("comments_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("comments_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	index("comments_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "comments_song_id_songs_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_users_id_fk"
		}),
]);

export const notifications = pgTable("notifications", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	fromUserId: varchar("from_user_id", { length: 36 }),
	targetId: varchar("target_id", { length: 36 }),
	content: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notifications_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notifications_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.fromUserId],
			foreignColumns: [users.id],
			name: "notifications_from_user_id_users_id_fk"
		}),
]);

export const mvs = pgTable("mvs", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	songId: varchar("song_id", { length: 36 }).notNull(),
	storyboard: jsonb(),
	style: varchar({ length: 50 }).default('realistic').notNull(),
	aspectRatio: varchar("aspect_ratio", { length: 10 }).default('9:16').notNull(),
	duration: integer().default(0).notNull(),
	coverUrl: varchar("cover_url", { length: 500 }),
	videoUrl: varchar("video_url", { length: 500 }),
	status: varchar({ length: 20 }).default('pending').notNull(),
	progress: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("mvs_song_id_idx").using("btree", table.songId.asc().nullsLast().op("text_ops")),
	index("mvs_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "mvs_song_id_songs_id_fk"
		}),
]);

export const songs = pgTable("songs", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	artistId: varchar("artist_id", { length: 36 }).notNull(),
	coverUrl: varchar("cover_url", { length: 500 }),
	audioUrl: varchar("audio_url", { length: 500 }).notNull(),
	lyrics: text(),
	styleTags: jsonb("style_tags"),
	description: text(),
	duration: integer().default(0).notNull(),
	playCount: integer("play_count").default(0).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	collectCount: integer("collect_count").default(0).notNull(),
	commentCount: integer("comment_count").default(0).notNull(),
	isPublished: boolean("is_published").default(true).notNull(),
	isOriginal: boolean("is_original").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	coverSource: varchar("cover_source", { length: 16 }).default('ai'),
	language: varchar({ length: 16 }).default('zh'),
	vocalType: varchar("vocal_type", { length: 16 }).default('female'),
	mood: varchar({ length: 32 }),
	isPublic: boolean("is_public").default(true).notNull(),
}, (table) => [
	index("songs_artist_id_idx").using("btree", table.artistId.asc().nullsLast().op("text_ops")),
	index("songs_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("songs_is_public_idx").using("btree", table.isPublic.asc().nullsLast().op("bool_ops")),
	index("songs_is_published_idx").using("btree", table.isPublished.asc().nullsLast().op("bool_ops")),
	index("songs_language_idx").using("btree", table.language.asc().nullsLast().op("text_ops")),
	index("songs_like_count_idx").using("btree", table.likeCount.asc().nullsLast().op("int4_ops")),
	index("songs_mood_idx").using("btree", table.mood.asc().nullsLast().op("text_ops")),
	index("songs_play_count_idx").using("btree", table.playCount.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [users.id],
			name: "songs_artist_id_users_id_fk"
		}),
]);

// Drafts table for storing user's draft songs
export const drafts = pgTable("drafts", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	title: varchar({ length: 200 }).default('未命名作品').notNull(),
	description: text(),
	lyrics: text(),
	styles: jsonb(),
	singers: jsonb(),
	audioUrl: varchar("audio_url", { length: 500 }),
	coverUrl: varchar("cover_url", { length: 500 }),
	provider: varchar({ length: 20 }),
	modelVersion: varchar("model_version", { length: 50 }),
	status: varchar({ length: 20 }).default('draft').notNull(), // draft, generating, completed, failed
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("drafts_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("drafts_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("drafts_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "drafts_user_id_users_fk"
	}),
]);

// User profiles table to link Supabase auth with app users
export const userProfiles = pgTable("user_profiles", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	authUserId: varchar("auth_user_id", { length: 36 }).notNull(), // Supabase auth user ID
	userId: varchar("user_id", { length: 36 }), // App users table ID
	nickname: varchar({ length: 100 }),
	avatar: varchar({ length: 500 }),
	bio: text(),
	credits: integer().default(10).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("user_profiles_auth_user_id_idx").using("btree", table.authUserId.asc().nullsLast().op("text_ops")),
	index("user_profiles_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

// Messages table for private messaging between users
export const messages = pgTable("messages", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	senderId: varchar("sender_id", { length: 36 }).notNull(),
	receiverId: varchar("receiver_id", { length: 36 }).notNull(),
	content: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("messages_sender_id_idx").using("btree", table.senderId.asc().nullsLast().op("text_ops")),
	index("messages_receiver_id_idx").using("btree", table.receiverId.asc().nullsLast().op("text_ops")),
	index("messages_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
]);
