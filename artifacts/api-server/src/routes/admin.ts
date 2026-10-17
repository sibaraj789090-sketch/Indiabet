import { asc, count, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateBannerBody,
  CreateBannerResponse,
  CreateGameBody,
  CreateGameResponse,
  CreatePromotionBody,
  CreatePromotionResponse,
  DeleteBannerParams,
  DeleteGameParams,
  DeletePromotionParams,
  GetAdminOverviewResponse,
  ListAdminBannersResponse,
  ListAdminGamesResponse,
  ListAdminPromotionsResponse,
  UpdateBannerBody,
  UpdateBannerParams,
  UpdateBannerResponse,
  UpdateGameBody,
  UpdateGameParams,
  UpdateGameResponse,
  UpdatePromotionBody,
  UpdatePromotionParams,
  UpdatePromotionResponse,
} from "@workspace/api-zod";
import {
  bannersTable,
  db,
  gamesTable,
  promotionsTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/admin/overview", async (_req, res): Promise<void> => {
  const [
    [games],
    [activeGames],
    [promotions],
    [activePromotions],
    [banners],
    [activeBanners],
  ] = await Promise.all([
    db.select({ value: count() }).from(gamesTable),
    db.select({ value: count() }).from(gamesTable).where(eq(gamesTable.active, true)),
    db.select({ value: count() }).from(promotionsTable),
    db.select({ value: count() }).from(promotionsTable).where(eq(promotionsTable.active, true)),
    db.select({ value: count() }).from(bannersTable),
    db.select({ value: count() }).from(bannersTable).where(eq(bannersTable.active, true)),
  ]);

  res.json(
    GetAdminOverviewResponse.parse({
      totalGames: games.value,
      activeGames: activeGames.value,
      totalPromotions: promotions.value,
      activePromotions: activePromotions.value,
      totalBanners: banners.value,
      activeBanners: activeBanners.value,
    }),
  );
});

router.get("/admin/games", async (_req, res): Promise<void> => {
  const games = await db
    .select()
    .from(gamesTable)
    .orderBy(asc(gamesTable.sortOrder), asc(gamesTable.id));
  res.json(ListAdminGamesResponse.parse(games));
});

router.post("/admin/games", async (req, res): Promise<void> => {
  const parsed = CreateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [game] = await db
    .insert(gamesTable)
    .values({
      name: parsed.data.name,
      category: parsed.data.category,
      provider: parsed.data.provider,
      imageUrl: parsed.data.imageUrl,
      badge: parsed.data.badge ?? null,
      players: parsed.data.players ?? 0,
      featured: parsed.data.featured ?? false,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(CreateGameResponse.parse(game));
});

router.patch("/admin/games/:id", async (req, res): Promise<void> => {
  const params = UpdateGameParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [game] = await db
    .update(gamesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(gamesTable.id, params.data.id))
    .returning();

  if (!game) {
    res.status(404).json({ error: "Game not found." });
    return;
  }

  res.json(UpdateGameResponse.parse(game));
});

router.delete("/admin/games/:id", async (req, res): Promise<void> => {
  const params = DeleteGameParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [game] = await db
    .delete(gamesTable)
    .where(eq(gamesTable.id, params.data.id))
    .returning({ id: gamesTable.id });

  if (!game) {
    res.status(404).json({ error: "Game not found." });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/promotions", async (_req, res): Promise<void> => {
  const promotions = await db
    .select()
    .from(promotionsTable)
    .orderBy(asc(promotionsTable.sortOrder), asc(promotionsTable.id));
  res.json(ListAdminPromotionsResponse.parse(promotions));
});

router.post("/admin/promotions", async (req, res): Promise<void> => {
  const parsed = CreatePromotionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [promotion] = await db
    .insert(promotionsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      badge: parsed.data.badge,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(CreatePromotionResponse.parse(promotion));
});

router.patch("/admin/promotions/:id", async (req, res): Promise<void> => {
  const params = UpdatePromotionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePromotionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [promotion] = await db
    .update(promotionsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(promotionsTable.id, params.data.id))
    .returning();

  if (!promotion) {
    res.status(404).json({ error: "Promotion not found." });
    return;
  }

  res.json(UpdatePromotionResponse.parse(promotion));
});

router.delete("/admin/promotions/:id", async (req, res): Promise<void> => {
  const params = DeletePromotionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [promotion] = await db
    .delete(promotionsTable)
    .where(eq(promotionsTable.id, params.data.id))
    .returning({ id: promotionsTable.id });

  if (!promotion) {
    res.status(404).json({ error: "Promotion not found." });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/banners", async (_req, res): Promise<void> => {
  const banners = await db
    .select()
    .from(bannersTable)
    .orderBy(asc(bannersTable.sortOrder), asc(bannersTable.id));
  res.json(ListAdminBannersResponse.parse(banners));
});

router.post("/admin/banners", async (req, res): Promise<void> => {
  const parsed = CreateBannerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [banner] = await db
    .insert(bannersTable)
    .values({
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      imageUrl: parsed.data.imageUrl,
      ctaLabel: parsed.data.ctaLabel,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(CreateBannerResponse.parse(banner));
});

router.patch("/admin/banners/:id", async (req, res): Promise<void> => {
  const params = UpdateBannerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBannerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [banner] = await db
    .update(bannersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(bannersTable.id, params.data.id))
    .returning();

  if (!banner) {
    res.status(404).json({ error: "Banner not found." });
    return;
  }

  res.json(UpdateBannerResponse.parse(banner));
});

router.delete("/admin/banners/:id", async (req, res): Promise<void> => {
  const params = DeleteBannerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [banner] = await db
    .delete(bannersTable)
    .where(eq(bannersTable.id, params.data.id))
    .returning({ id: bannersTable.id });

  if (!banner) {
    res.status(404).json({ error: "Banner not found." });
    return;
  }

  res.sendStatus(204);
});

export default router;
