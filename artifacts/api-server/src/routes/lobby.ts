import { and, asc, eq, ilike, or } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  ListBannersResponse,
  ListFixturesResponse,
  ListGamesQueryParams,
  ListGamesResponse,
  ListPromotionsResponse,
} from "@workspace/api-zod";
import { bannersTable, db, gamesTable, promotionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/games", async (req, res): Promise<void> => {
  const query = ListGamesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const filters = [eq(gamesTable.active, true)];
  if (query.data.category) {
    filters.push(eq(gamesTable.category, query.data.category));
  }

  const search = query.data.q?.trim();
  if (search) {
    const searchFilter = or(
      ilike(gamesTable.name, `%${search}%`),
      ilike(gamesTable.provider, `%${search}%`),
    );
    if (searchFilter) filters.push(searchFilter);
  }

  const games = await db
    .select()
    .from(gamesTable)
    .where(and(...filters))
    .orderBy(asc(gamesTable.sortOrder), asc(gamesTable.id));

  res.json(ListGamesResponse.parse(games));
});

router.get("/promotions", async (_req, res): Promise<void> => {
  const promotions = await db
    .select()
    .from(promotionsTable)
    .where(eq(promotionsTable.active, true))
    .orderBy(asc(promotionsTable.sortOrder), asc(promotionsTable.id));

  res.json(ListPromotionsResponse.parse(promotions));
});

router.get("/banners", async (_req, res): Promise<void> => {
  const banners = await db
    .select()
    .from(bannersTable)
    .where(eq(bannersTable.active, true))
    .orderBy(asc(bannersTable.sortOrder), asc(bannersTable.id));

  res.json(ListBannersResponse.parse(banners));
});

router.get("/sports/fixtures", async (_req, res): Promise<void> => {
  const fixtures = [
    {
      id: "fixture-ind-wi",
      league: "T20 International",
      homeTeam: "India",
      awayTeam: "West Indies",
      startTime: "2026-10-20T19:00:00+05:30",
      status: "Scheduled",
    },
    {
      id: "fixture-mr-hb",
      league: "T20 Spring Challenge",
      homeTeam: "Melbourne Renegades Women",
      awayTeam: "Hobart Hurricanes Women",
      startTime: "2026-10-21T04:30:00+05:30",
      status: "Scheduled",
    },
    {
      id: "fixture-bh-as",
      league: "T20 Spring Challenge",
      homeTeam: "Brisbane Heat Women",
      awayTeam: "Adelaide Strikers Women",
      startTime: "2026-10-21T09:00:00+05:30",
      status: "Scheduled",
    },
  ];

  res.json(ListFixturesResponse.parse(fixtures));
});

export default router;
