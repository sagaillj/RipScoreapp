import { 
  users, type User, type InsertUser,
  teams, type Team, type InsertTeam,
  meets, type Meet, type InsertMeet,
  divers, type Diver, type InsertDiver,
  dives, type Dive, type InsertDive,
  scores, type Score, type InsertScore,
  meetParticipants, type MeetParticipant, type InsertMeetParticipant,
  meetJudges, type MeetJudge, type InsertMeetJudge,
  seasons, type Season, type InsertSeason,
  seasonCycles, type SeasonCycle, type InsertSeasonCycle,
  seasonMeets, type SeasonMeet, type InsertSeasonMeet,
  practiceSchedules, type PracticeSchedule, type InsertPracticeSchedule,
  meetItineraries, type MeetItinerary, type InsertMeetItinerary
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

// Storage interface for all our data access
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Team methods
  getTeam(id: number): Promise<Team | undefined>;
  getTeams(): Promise<Team[]>;
  getTeamsByCoach(coachId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<void>;

  // Meet methods
  getMeet(id: number): Promise<Meet | undefined>;
  getMeets(): Promise<Meet[]>;
  createMeet(meet: InsertMeet): Promise<Meet>;
  updateMeetStatus(id: number, status: string): Promise<Meet | undefined>;

  // Diver methods
  getDiver(id: number): Promise<Diver | undefined>;
  getDivers(): Promise<Diver[]>;
  getDiversByTeam(teamId: number): Promise<Diver[]>;
  createDiver(diver: InsertDiver): Promise<Diver>;
  updateDiver(id: number, diver: Partial<Diver>): Promise<Diver | undefined>;
  deleteDiver(id: number): Promise<void>;

  // Dive methods
  getDive(id: number): Promise<Dive | undefined>;
  getDivesByMeet(meetId: number): Promise<Dive[]>;
  getDivesByDiver(diverId: number): Promise<Dive[]>;
  createDive(dive: InsertDive): Promise<Dive>;
  markDiveCompleted(id: number): Promise<Dive | undefined>;

  // Score methods
  getScore(id: number): Promise<Score | undefined>;
  getScoresByDive(diveId: number): Promise<Score[]>;
  getScoresByJudge(judgeId: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;

  // Meet Participant methods
  getMeetParticipants(meetId: number): Promise<MeetParticipant[]>;
  addParticipantToMeet(participant: InsertMeetParticipant): Promise<MeetParticipant>;
  removeParticipantFromMeet(meetId: number, diverId: number): Promise<void>;

  // Meet Judge methods
  getMeetJudges(meetId: number): Promise<MeetJudge[]>;
  addJudgeToMeet(judge: InsertMeetJudge): Promise<MeetJudge>;
  removeJudgeFromMeet(meetId: number, judgeId: number): Promise<void>;

  // Season methods
  getSeason(id: number): Promise<Season | undefined>;
  getSeasonsByTeam(teamId: number): Promise<Season[]>;
  createSeason(season: InsertSeason): Promise<Season>;
  updateSeasonStatus(id: number, status: string): Promise<Season | undefined>;

  // Season Cycle methods
  getSeasonCycle(id: number): Promise<SeasonCycle | undefined>;
  getSeasonCyclesBySeasonId(seasonId: number): Promise<SeasonCycle[]>;
  createSeasonCycle(cycle: InsertSeasonCycle): Promise<SeasonCycle>;

  // Season Meet methods
  getSeasonMeet(id: number): Promise<SeasonMeet | undefined>;
  getSeasonMeetsBySeasonId(seasonId: number): Promise<SeasonMeet[]>;
  createSeasonMeet(seasonMeet: InsertSeasonMeet): Promise<SeasonMeet>;

  // Practice Schedule methods
  getPracticeSchedule(id: number): Promise<PracticeSchedule | undefined>;
  getPracticeSchedulesBySeasonId(seasonId: number): Promise<PracticeSchedule[]>;
  createPracticeSchedule(schedule: InsertPracticeSchedule): Promise<PracticeSchedule>;

  // Meet Itinerary methods
  getMeetItinerary(id: number): Promise<MeetItinerary | undefined>;
  getMeetItinerariesBySeasonId(seasonId: number): Promise<MeetItinerary[]>;
  createMeetItinerary(itinerary: InsertMeetItinerary): Promise<MeetItinerary>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Team methods
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeamsByCoach(coachId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.coachId, coachId));
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async updateTeam(id: number, team: Partial<Team>): Promise<Team | undefined> {
    const [updatedTeam] = await db
      .update(teams)
      .set(team)
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }
  
  async deleteTeam(id: number): Promise<void> {
    // First delete related divers
    await db.delete(divers).where(eq(divers.teamId, id));
    
    // Then delete the team
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Meet methods
  async getMeet(id: number): Promise<Meet | undefined> {
    const [meet] = await db.select().from(meets).where(eq(meets.id, id));
    return meet;
  }

  async getMeets(): Promise<Meet[]> {
    return await db.select().from(meets).orderBy(desc(meets.date));
  }

  async createMeet(meet: InsertMeet): Promise<Meet> {
    const [newMeet] = await db.insert(meets).values(meet).returning();
    return newMeet;
  }

  async updateMeetStatus(id: number, status: string): Promise<Meet | undefined> {
    const [updatedMeet] = await db
      .update(meets)
      .set({ status })
      .where(eq(meets.id, id))
      .returning();
    return updatedMeet;
  }

  // Diver methods
  async getDiver(id: number): Promise<Diver | undefined> {
    const [diver] = await db.select().from(divers).where(eq(divers.id, id));
    return diver;
  }

  async getDivers(): Promise<Diver[]> {
    return await db.select().from(divers);
  }

  async getDiversByTeam(teamId: number): Promise<Diver[]> {
    return await db.select().from(divers).where(eq(divers.teamId, teamId));
  }

  async createDiver(diver: InsertDiver): Promise<Diver> {
    const [newDiver] = await db.insert(divers).values(diver).returning();
    return newDiver;
  }

  async updateDiver(id: number, diver: Partial<Diver>): Promise<Diver | undefined> {
    const [updatedDiver] = await db
      .update(divers)
      .set(diver)
      .where(eq(divers.id, id))
      .returning();
    return updatedDiver;
  }

  async deleteDiver(id: number): Promise<void> {
    await db
      .delete(divers)
      .where(eq(divers.id, id));
  }

  // Dive methods
  async getDive(id: number): Promise<Dive | undefined> {
    const [dive] = await db.select().from(dives).where(eq(dives.id, id));
    return dive;
  }

  async getDivesByMeet(meetId: number): Promise<Dive[]> {
    return await db
      .select()
      .from(dives)
      .where(eq(dives.meetId, meetId))
      .orderBy(dives.number);
  }

  async getDivesByDiver(diverId: number): Promise<Dive[]> {
    return await db
      .select()
      .from(dives)
      .where(eq(dives.diverId, diverId))
      .orderBy(dives.number);
  }

  async createDive(dive: InsertDive): Promise<Dive> {
    const [newDive] = await db.insert(dives).values(dive).returning();
    return newDive;
  }

  async markDiveCompleted(id: number): Promise<Dive | undefined> {
    const [updatedDive] = await db
      .update(dives)
      .set({ completed: true })
      .where(eq(dives.id, id))
      .returning();
    return updatedDive;
  }

  // Score methods
  async getScore(id: number): Promise<Score | undefined> {
    const [score] = await db.select().from(scores).where(eq(scores.id, id));
    return score;
  }

  async getScoresByDive(diveId: number): Promise<Score[]> {
    return await db.select().from(scores).where(eq(scores.diveId, diveId));
  }

  async getScoresByJudge(judgeId: number): Promise<Score[]> {
    return await db.select().from(scores).where(eq(scores.judgeId, judgeId));
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }

  // Meet Participant methods
  async getMeetParticipants(meetId: number): Promise<MeetParticipant[]> {
    return await db
      .select()
      .from(meetParticipants)
      .where(eq(meetParticipants.meetId, meetId));
  }

  async addParticipantToMeet(participant: InsertMeetParticipant): Promise<MeetParticipant> {
    const [newParticipant] = await db
      .insert(meetParticipants)
      .values(participant)
      .returning();
    return newParticipant;
  }

  async removeParticipantFromMeet(meetId: number, diverId: number): Promise<void> {
    await db
      .delete(meetParticipants)
      .where(
        and(
          eq(meetParticipants.meetId, meetId),
          eq(meetParticipants.diverId, diverId)
        )
      );
  }

  // Meet Judge methods
  async getMeetJudges(meetId: number): Promise<MeetJudge[]> {
    return await db
      .select()
      .from(meetJudges)
      .where(eq(meetJudges.meetId, meetId));
  }

  async addJudgeToMeet(judge: InsertMeetJudge): Promise<MeetJudge> {
    const [newJudge] = await db
      .insert(meetJudges)
      .values(judge)
      .returning();
    return newJudge;
  }

  async removeJudgeFromMeet(meetId: number, judgeId: number): Promise<void> {
    await db
      .delete(meetJudges)
      .where(
        and(
          eq(meetJudges.meetId, meetId),
          eq(meetJudges.judgeId, judgeId)
        )
      );
  }

  // Season methods
  async getSeason(id: number): Promise<Season | undefined> {
    const [season] = await db.select().from(seasons).where(eq(seasons.id, id));
    return season;
  }

  async getSeasonsByTeam(teamId: number): Promise<Season[]> {
    return db.select().from(seasons).where(eq(seasons.teamId, teamId)).orderBy(desc(seasons.createdAt));
  }

  async createSeason(season: InsertSeason): Promise<Season> {
    const [newSeason] = await db.insert(seasons).values(season).returning();
    return newSeason;
  }

  async updateSeasonStatus(id: number, status: string): Promise<Season | undefined> {
    const [updatedSeason] = await db
      .update(seasons)
      .set({ status })
      .where(eq(seasons.id, id))
      .returning();
    return updatedSeason;
  }

  // Season Cycle methods
  async getSeasonCycle(id: number): Promise<SeasonCycle | undefined> {
    const [cycle] = await db.select().from(seasonCycles).where(eq(seasonCycles.id, id));
    return cycle;
  }

  async getSeasonCyclesBySeasonId(seasonId: number): Promise<SeasonCycle[]> {
    return db
      .select()
      .from(seasonCycles)
      .where(eq(seasonCycles.seasonId, seasonId))
      .orderBy(seasonCycles.startDate);
  }

  async createSeasonCycle(cycle: InsertSeasonCycle): Promise<SeasonCycle> {
    const [newCycle] = await db.insert(seasonCycles).values(cycle).returning();
    return newCycle;
  }

  // Season Meet methods
  async getSeasonMeet(id: number): Promise<SeasonMeet | undefined> {
    const [seasonMeet] = await db.select().from(seasonMeets).where(eq(seasonMeets.id, id));
    return seasonMeet;
  }

  async getSeasonMeetsBySeasonId(seasonId: number): Promise<SeasonMeet[]> {
    return db
      .select()
      .from(seasonMeets)
      .where(eq(seasonMeets.seasonId, seasonId))
      .orderBy(seasonMeets.startTime);
  }

  async createSeasonMeet(seasonMeet: InsertSeasonMeet): Promise<SeasonMeet> {
    const [newSeasonMeet] = await db.insert(seasonMeets).values(seasonMeet).returning();
    return newSeasonMeet;
  }

  // Practice Schedule methods
  async getPracticeSchedule(id: number): Promise<PracticeSchedule | undefined> {
    const [schedule] = await db.select().from(practiceSchedules).where(eq(practiceSchedules.id, id));
    return schedule;
  }

  async getPracticeSchedulesBySeasonId(seasonId: number): Promise<PracticeSchedule[]> {
    // Use a basic query instead to avoid TypeScript issues with orderBy
    const practices = await db
      .select()
      .from(practiceSchedules)
      .where(eq(practiceSchedules.seasonId, seasonId));
    
    // Sort manually
    return practices.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async createPracticeSchedule(schedule: InsertPracticeSchedule): Promise<PracticeSchedule> {
    const [newSchedule] = await db.insert(practiceSchedules).values(schedule).returning();
    return newSchedule;
  }

  // Meet Itinerary methods
  async getMeetItinerary(id: number): Promise<MeetItinerary | undefined> {
    const [itinerary] = await db.select().from(meetItineraries).where(eq(meetItineraries.id, id));
    return itinerary;
  }

  async getMeetItinerariesBySeasonId(seasonId: number): Promise<MeetItinerary[]> {
    return db
      .select()
      .from(meetItineraries)
      .where(eq(meetItineraries.seasonId, seasonId))
      .orderBy(meetItineraries.name);
  }

  async createMeetItinerary(itinerary: InsertMeetItinerary): Promise<MeetItinerary> {
    const [newItinerary] = await db.insert(meetItineraries).values(itinerary).returning();
    return newItinerary;
  }
}

// Export an instance of the storage
export const storage = new DatabaseStorage();
