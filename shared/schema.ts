import { pgTable, text, serial, integer, timestamp, numeric, primaryKey, varchar, boolean, date, time, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from 'drizzle-orm';

// User table - for coaches, divers, and judges
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("diver"), // 'coach', 'diver', 'judge'
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  coachId: integer("coach_id").references(() => users.id),
  mascot: text("mascot"),
  division: text("division"),
  address: text("address"),
  primaryColor: text("primary_color").default('#E11D48'),
  secondaryColor: text("secondary_color").default('#7C3AED'),
  bannerUrl: text("banner_url"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meets table for competitions
export const meets = pgTable("meets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("upcoming"), // 'upcoming', 'active', 'completed'
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Divers table
export const divers = pgTable("divers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: integer("age"),
  gender: text("gender"),
  gradYear: integer("grad_year"),
  avgScore: text("avg_score"),
  email: text("email"),
  isCaptain: boolean("is_captain").default(false),
  status: text("status").default("active"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dives table
export const dives = pgTable("dives", {
  id: serial("id").primaryKey(),
  meetId: integer("meet_id").references(() => meets.id),
  diverId: integer("diver_id").references(() => divers.id),
  number: integer("number").notNull(), // Order of dive in a meet
  name: text("name").notNull(),
  difficulty: numeric("difficulty", { precision: 3, scale: 1 }).notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scores table for judging
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  diveId: integer("dive_id").references(() => dives.id),
  judgeId: integer("judge_id").references(() => users.id),
  score: numeric("score", { precision: 3, scale: 1 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meet Participants - which divers are in which meets
export const meetParticipants = pgTable("meet_participants", {
  meetId: integer("meet_id").references(() => meets.id),
  diverId: integer("diver_id").references(() => divers.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  pk: primaryKey(t.meetId, t.diverId),
}));

// Meet Judges - which judges are assigned to which meets
export const meetJudges = pgTable("meet_judges", {
  meetId: integer("meet_id").references(() => meets.id),
  judgeId: integer("judge_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  pk: primaryKey(t.meetId, t.judgeId),
}));

// Seasons table
export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'archived'
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Season Cycles table
export const seasonCycles = pgTable("season_cycles", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(),
  type: text("type").notNull(), // 'preseason', 'regular', 'postseason', 'offseason'
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Season Meets table (extends the existing meets table with season-specific info)
export const seasonMeets = pgTable("season_meets", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(),
  meetId: integer("meet_id").references(() => meets.id).notNull(),
  opponent: text("opponent"),
  isHome: boolean("is_home").default(true),
  cycleType: text("cycle_type").notNull(), // 'preseason', 'regular', 'postseason'
  startTime: time("start_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice Schedule table
export const practiceSchedules = pgTable("practice_schedules", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'weightroom', 'dryland', 'diving', 'mental', 'other'
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meet Itineraries table
export const meetItineraries = pgTable("meet_itineraries", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false),
  details: json("details"), // Structured details like packing lists, schedules, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  divers: many(divers),
  teams: many(teams),
  scores: many(scores),
  meetJudges: many(meetJudges),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  coach: one(users, {
    fields: [teams.coachId],
    references: [users.id],
  }),
  divers: many(divers),
  seasons: many(seasons),
}));

export const meetsRelations = relations(meets, ({ one, many }) => ({
  creator: one(users, {
    fields: [meets.createdBy],
    references: [users.id],
  }),
  participants: many(meetParticipants),
  judges: many(meetJudges),
  dives: many(dives),
}));

export const diversRelations = relations(divers, ({ one, many }) => ({
  user: one(users, {
    fields: [divers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [divers.teamId],
    references: [teams.id],
  }),
  meets: many(meetParticipants),
  dives: many(dives),
}));

export const divesRelations = relations(dives, ({ one, many }) => ({
  meet: one(meets, {
    fields: [dives.meetId],
    references: [meets.id],
  }),
  diver: one(divers, {
    fields: [dives.diverId],
    references: [divers.id],
  }),
  scores: many(scores),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  dive: one(dives, {
    fields: [scores.diveId],
    references: [dives.id],
  }),
  judge: one(users, {
    fields: [scores.judgeId],
    references: [users.id],
  }),
}));

export const meetParticipantsRelations = relations(meetParticipants, ({ one }) => ({
  meet: one(meets, {
    fields: [meetParticipants.meetId],
    references: [meets.id],
  }),
  diver: one(divers, {
    fields: [meetParticipants.diverId],
    references: [divers.id],
  }),
}));

export const meetJudgesRelations = relations(meetJudges, ({ one }) => ({
  meet: one(meets, {
    fields: [meetJudges.meetId],
    references: [meets.id],
  }),
  judge: one(users, {
    fields: [meetJudges.judgeId],
    references: [users.id],
  }),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  team: one(teams, {
    fields: [seasons.teamId],
    references: [teams.id],
  }),
  creator: one(users, {
    fields: [seasons.createdBy],
    references: [users.id],
  }),
  cycles: many(seasonCycles),
  meets: many(seasonMeets),
  practiceSchedules: many(practiceSchedules),
  meetItineraries: many(meetItineraries),
}));

export const seasonCyclesRelations = relations(seasonCycles, ({ one }) => ({
  season: one(seasons, {
    fields: [seasonCycles.seasonId],
    references: [seasons.id],
  }),
}));

export const seasonMeetsRelations = relations(seasonMeets, ({ one }) => ({
  season: one(seasons, {
    fields: [seasonMeets.seasonId],
    references: [seasons.id],
  }),
  meet: one(meets, {
    fields: [seasonMeets.meetId],
    references: [meets.id],
  }),
}));

export const practiceSchedulesRelations = relations(practiceSchedules, ({ one }) => ({
  season: one(seasons, {
    fields: [practiceSchedules.seasonId],
    references: [seasons.id],
  }),
}));

export const meetItinerariesRelations = relations(meetItineraries, ({ one }) => ({
  season: one(seasons, {
    fields: [meetItineraries.seasonId],
    references: [seasons.id],
  }),
}));

// Create schemas for inserting data
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  code: true,
  coachId: true,
  mascot: true,
  division: true,
  address: true,
  primaryColor: true,
  secondaryColor: true,
  bannerUrl: true,
  logoUrl: true,
});

export const insertMeetSchema = createInsertSchema(meets).pick({
  name: true,
  location: true,
  date: true,
  status: true,
  createdBy: true,
});

export const insertDiverSchema = createInsertSchema(divers).pick({
  userId: true,
  teamId: true,
  firstName: true,
  lastName: true,
  age: true,
  gender: true,
  gradYear: true,
  avgScore: true,
  email: true,
  isCaptain: true,
  status: true,
  imageUrl: true,
});

export const insertDiveSchema = createInsertSchema(dives).pick({
  meetId: true,
  diverId: true,
  number: true,
  name: true,
  difficulty: true,
  completed: true,
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  diveId: true,
  judgeId: true,
  score: true,
});

export const insertMeetParticipantSchema = createInsertSchema(meetParticipants).pick({
  meetId: true,
  diverId: true,
});

export const insertMeetJudgeSchema = createInsertSchema(meetJudges).pick({
  meetId: true,
  judgeId: true,
});

export const insertSeasonSchema = createInsertSchema(seasons).pick({
  teamId: true,
  name: true,
  startYear: true,
  endYear: true,
  status: true,
  createdBy: true,
});

export const insertSeasonCycleSchema = createInsertSchema(seasonCycles).pick({
  seasonId: true,
  type: true,
  startDate: true,
  endDate: true,
});

export const insertSeasonMeetSchema = createInsertSchema(seasonMeets).pick({
  seasonId: true,
  meetId: true,
  opponent: true,
  isHome: true,
  cycleType: true,
  startTime: true,
});

export const insertPracticeScheduleSchema = createInsertSchema(practiceSchedules).pick({
  seasonId: true,
  name: true,
  type: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  location: true,
  notes: true,
});

export const insertMeetItinerarySchema = createInsertSchema(meetItineraries).pick({
  seasonId: true,
  name: true,
  isDefault: true,
  details: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertMeet = z.infer<typeof insertMeetSchema>;
export type Meet = typeof meets.$inferSelect;

export type InsertDiver = z.infer<typeof insertDiverSchema>;
export type Diver = typeof divers.$inferSelect;

export type InsertDive = z.infer<typeof insertDiveSchema>;
export type Dive = typeof dives.$inferSelect;

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;

export type InsertMeetParticipant = z.infer<typeof insertMeetParticipantSchema>;
export type MeetParticipant = typeof meetParticipants.$inferSelect;

export type InsertMeetJudge = z.infer<typeof insertMeetJudgeSchema>;
export type MeetJudge = typeof meetJudges.$inferSelect;

export type InsertSeason = z.infer<typeof insertSeasonSchema>;
export type Season = typeof seasons.$inferSelect;

export type InsertSeasonCycle = z.infer<typeof insertSeasonCycleSchema>;
export type SeasonCycle = typeof seasonCycles.$inferSelect;

export type InsertSeasonMeet = z.infer<typeof insertSeasonMeetSchema>;
export type SeasonMeet = typeof seasonMeets.$inferSelect;

export type InsertPracticeSchedule = z.infer<typeof insertPracticeScheduleSchema>;
export type PracticeSchedule = typeof practiceSchedules.$inferSelect;

export type InsertMeetItinerary = z.infer<typeof insertMeetItinerarySchema>;
export type MeetItinerary = typeof meetItineraries.$inferSelect;
