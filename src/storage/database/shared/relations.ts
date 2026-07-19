import { relations } from "drizzle-orm/relations";
import { users, follows, collects, songs, likes, plays, artists, aiAnalysis, comments, notifications, mvs } from "./schema";

export const followsRelations = relations(follows, ({one}) => ({
	user_followerId: one(users, {
		fields: [follows.followerId],
		references: [users.id],
		relationName: "follows_followerId_users_id"
	}),
	user_followingId: one(users, {
		fields: [follows.followingId],
		references: [users.id],
		relationName: "follows_followingId_users_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	follows_followerId: many(follows, {
		relationName: "follows_followerId_users_id"
	}),
	follows_followingId: many(follows, {
		relationName: "follows_followingId_users_id"
	}),
	collects: many(collects),
	likes: many(likes),
	plays: many(plays),
	artists: many(artists),
	comments: many(comments),
	notifications_userId: many(notifications, {
		relationName: "notifications_userId_users_id"
	}),
	notifications_fromUserId: many(notifications, {
		relationName: "notifications_fromUserId_users_id"
	}),
	songs: many(songs),
}));

export const collectsRelations = relations(collects, ({one}) => ({
	user: one(users, {
		fields: [collects.userId],
		references: [users.id]
	}),
	song: one(songs, {
		fields: [collects.songId],
		references: [songs.id]
	}),
}));

export const songsRelations = relations(songs, ({one, many}) => ({
	collects: many(collects),
	likes: many(likes),
	plays: many(plays),
	aiAnalyses: many(aiAnalysis),
	comments: many(comments),
	mvs: many(mvs),
	user: one(users, {
		fields: [songs.artistId],
		references: [users.id]
	}),
}));

export const likesRelations = relations(likes, ({one}) => ({
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
	song: one(songs, {
		fields: [likes.songId],
		references: [songs.id]
	}),
}));

export const playsRelations = relations(plays, ({one}) => ({
	user: one(users, {
		fields: [plays.userId],
		references: [users.id]
	}),
	song: one(songs, {
		fields: [plays.songId],
		references: [songs.id]
	}),
}));

export const artistsRelations = relations(artists, ({one}) => ({
	user: one(users, {
		fields: [artists.userId],
		references: [users.id]
	}),
}));

export const aiAnalysisRelations = relations(aiAnalysis, ({one}) => ({
	song: one(songs, {
		fields: [aiAnalysis.songId],
		references: [songs.id]
	}),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	song: one(songs, {
		fields: [comments.songId],
		references: [songs.id]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user_userId: one(users, {
		fields: [notifications.userId],
		references: [users.id],
		relationName: "notifications_userId_users_id"
	}),
	user_fromUserId: one(users, {
		fields: [notifications.fromUserId],
		references: [users.id],
		relationName: "notifications_fromUserId_users_id"
	}),
}));

export const mvsRelations = relations(mvs, ({one}) => ({
	song: one(songs, {
		fields: [mvs.songId],
		references: [songs.id]
	}),
}));