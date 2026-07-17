import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  serial,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Keep the health check table
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

// Users table
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    nickname: varchar("nickname", { length: 100 }).notNull(),
    avatar: varchar("avatar", { length: 500 }),
    bio: text("bio"),
    slogan: varchar("slogan", { length: 200 }),
    is_ai_artist: boolean("is_ai_artist").default(false).notNull(),
    follower_count: integer("follower_count").default(0).notNull(),
    following_count: integer("following_count").default(0).notNull(),
    song_count: integer("song_count").default(0).notNull(),
    total_play_count: integer("total_play_count").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [index("users_is_ai_artist_idx").on(table.is_ai_artist)]
);

// Songs table
export const songs = pgTable(
  "songs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }).notNull(),
    artist_id: varchar("artist_id", { length: 36 }).notNull().references(() => users.id),
    cover_url: varchar("cover_url", { length: 500 }),
    audio_url: varchar("audio_url", { length: 500 }).notNull(),
    lyrics: text("lyrics"),
    style_tags: jsonb("style_tags"),
    description: text("description"),
    duration: integer("duration").default(0).notNull(),
    play_count: integer("play_count").default(0).notNull(),
    like_count: integer("like_count").default(0).notNull(),
    collect_count: integer("collect_count").default(0).notNull(),
    comment_count: integer("comment_count").default(0).notNull(),
    is_published: boolean("is_published").default(true).notNull(),
    is_original: boolean("is_original").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("songs_artist_id_idx").on(table.artist_id),
    index("songs_created_at_idx").on(table.created_at),
    index("songs_play_count_idx").on(table.play_count),
    index("songs_like_count_idx").on(table.like_count),
    index("songs_is_published_idx").on(table.is_published),
  ]
);

// Plays table (play records)
export const plays = pgTable(
  "plays",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    song_id: varchar("song_id", { length: 36 }).notNull().references(() => songs.id),
    played_at: timestamp("played_at", { withTimezone: true }).defaultNow().notNull(),
    duration: integer("duration").default(0).notNull(),
  },
  (table) => [
    index("plays_user_id_idx").on(table.user_id),
    index("plays_song_id_idx").on(table.song_id),
    index("plays_played_at_idx").on(table.played_at),
  ]
);

// Likes table
export const likes = pgTable(
  "likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    song_id: varchar("song_id", { length: 36 }).notNull().references(() => songs.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("likes_user_song_idx").on(table.user_id, table.song_id),
    index("likes_song_id_idx").on(table.song_id),
  ]
);

// Collects table (favorites)
export const collects = pgTable(
  "collects",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    song_id: varchar("song_id", { length: 36 }).notNull().references(() => songs.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collects_user_song_idx").on(table.user_id, table.song_id),
    index("collects_song_id_idx").on(table.song_id),
  ]
);

// Follows table
export const follows = pgTable(
  "follows",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    follower_id: varchar("follower_id", { length: 36 }).notNull().references(() => users.id),
    following_id: varchar("following_id", { length: 36 }).notNull().references(() => users.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("follows_follower_following_idx").on(table.follower_id, table.following_id),
    index("follows_following_id_idx").on(table.following_id),
  ]
);

// Comments table
export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    song_id: varchar("song_id", { length: 36 }).notNull().references(() => songs.id),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    parent_id: varchar("parent_id", { length: 36 }),
    content: text("content").notNull(),
    like_count: integer("like_count").default(0).notNull(),
    is_pinned: boolean("is_pinned").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("comments_song_id_idx").on(table.song_id),
    index("comments_user_id_idx").on(table.user_id),
    index("comments_parent_id_idx").on(table.parent_id),
    index("comments_created_at_idx").on(table.created_at),
  ]
);

// Hot search table
export const hotSearch = pgTable(
  "hot_search",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    keyword: varchar("keyword", { length: 100 }).notNull(),
    category: varchar("category", { length: 20 }).notNull().default("song"),
    score: integer("score").default(0).notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("hot_search_category_idx").on(table.category),
    index("hot_search_score_idx").on(table.score),
  ]
);

// AI analysis cache table
export const aiAnalysis = pgTable(
  "ai_analysis",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    song_id: varchar("song_id", { length: 36 }).notNull().references(() => songs.id),
    lyrics_analysis: text("lyrics_analysis"),
    song_analysis: text("song_analysis"),
    ratings: jsonb("ratings"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("ai_analysis_song_id_idx").on(table.song_id)]
);

// Notifications table
export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    type: varchar("type", { length: 20 }).notNull(),
    from_user_id: varchar("from_user_id", { length: 36 }).references(() => users.id),
    target_id: varchar("target_id", { length: 36 }),
    content: text("content").notNull(),
    is_read: boolean("is_read").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.user_id),
    index("notifications_is_read_idx").on(table.is_read),
    index("notifications_created_at_idx").on(table.created_at),
  ]
);
