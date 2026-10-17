import type { Banner } from "./schema/banners";
import type { Game } from "./schema/games";
import type { Promotion } from "./schema/promotions";

const now = new Date();

export const seedGames: Game[] = [
  {
    id: 1,
    name: "Spin Odyssey",
    category: "Arcade",
    provider: "GalaxyPlay",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    badge: "Trending",
    players: 4320,
    featured: true,
    active: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Card Royale Deluxe",
    category: "Card games",
    provider: "Apex Gaming",
    imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80",
    badge: "Hot",
    players: 3150,
    featured: true,
    active: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Neon Blitz",
    category: "Arcade",
    provider: "RetroLab",
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
    badge: "Popular",
    players: 2890,
    featured: true,
    active: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: "Mystic Rummy",
    category: "Card games",
    provider: "DeckMasters",
    imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&auto=format&fit=crop&q=80",
    badge: "Top rated",
    players: 5120,
    featured: true,
    active: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    name: "Chess Masters Arena",
    category: "Board games",
    provider: "ThinkFast",
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format&fit=crop&q=80",
    badge: "Classic",
    players: 1420,
    featured: false,
    active: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    name: "Gem Cascade",
    category: "Puzzle",
    provider: "MindWorks",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    badge: "New",
    players: 2180,
    featured: false,
    active: true,
    sortOrder: 6,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    name: "Pixel Dash",
    category: "Casual",
    provider: "MiniGames Co",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80",
    badge: "Fast play",
    players: 980,
    featured: false,
    active: true,
    sortOrder: 7,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    name: "Dice Storm",
    category: "Board games",
    provider: "RollCraft",
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=600&auto=format&fit=crop&q=80",
    badge: "Multiplayer",
    players: 1740,
    featured: false,
    active: true,
    sortOrder: 8,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    name: "Quantum Solitaire",
    category: "Card games",
    provider: "Apex Gaming",
    imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80",
    badge: "Daily pick",
    players: 1890,
    featured: false,
    active: true,
    sortOrder: 9,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    name: "Cosmic Pinball",
    category: "Arcade",
    provider: "GalaxyPlay",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    badge: "Arcade classic",
    players: 3410,
    featured: false,
    active: true,
    sortOrder: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 11,
    name: "Ludo Legend",
    category: "Board games",
    provider: "Tabletop Pro",
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80",
    badge: "Party pick",
    players: 2950,
    featured: false,
    active: true,
    sortOrder: 11,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 12,
    name: "Word Weaver",
    category: "Puzzle",
    provider: "Lexicon Studios",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    badge: "Brain teaser",
    players: 1250,
    featured: false,
    active: true,
    sortOrder: 12,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedBanners: Banner[] = [
  {
    id: 1,
    title: "Welcome to A-Z Arena",
    subtitle: "Your premier arcade for quick rounds, clever moves, and friendly competition with demo credits.",
    imageUrl: "",
    ctaLabel: "Explore games",
    active: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "Matchday Fixtures are Live",
    subtitle: "Follow top cricket and soccer fixtures with sample editorial predictions. Completely for fun.",
    imageUrl: "",
    ctaLabel: "View fixtures",
    active: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "Rummy Practice Table",
    subtitle: "Deal a practice hand, master card groupings, and test your tactics with zero stakes.",
    imageUrl: "",
    ctaLabel: "Practice rummy",
    active: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedPromotions: Promotion[] = [
  {
    id: 1,
    title: "Daily Arena Demo Pass",
    description: "Claim 1,000 free demo credits every day to practice on your favorite arcade machines and card tables.",
    badge: "Daily Bonus",
    active: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "Weekend Matchday Challenge",
    description: "Make friendly matchday predictions and climb the community leaderboard for bragging rights.",
    badge: "Special Event",
    active: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "Rummy Master Practice Perks",
    description: "Join open rummy tables with custom card backings and instant hand-replay tools.",
    badge: "Practice Perks",
    active: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
];

export class InMemoryStore {
  games: Game[] = [...seedGames];
  banners: Banner[] = [...seedBanners];
  promotions: Promotion[] = [...seedPromotions];
  private nextId = 100;

  getCollection(table: unknown): any[] {
    const tableName = (table as any)?.[Symbol.for("drizzle:Name")] || (table as any)?._?.name || (table as any)?.name;
    if (tableName === "games" || String(table).includes("games")) return this.games;
    if (tableName === "banners" || String(table).includes("banners")) return this.banners;
    if (tableName === "promotions" || String(table).includes("promotions")) return this.promotions;
    return this.games;
  }

  createMockDb(): any {
    const store = this;

    return {
      select(fields?: any) {
        let selectedTable: any = null;
        let whereFn: any = null;
        let isCountQuery = false;

        if (fields && typeof fields === "object" && "value" in fields) {
          isCountQuery = true;
        }

        const builder = {
          from(table: any) {
            selectedTable = table;
            return builder;
          },
          where(condition: any) {
            whereFn = condition;
            return builder;
          },
          orderBy(..._order: any[]) {
            return builder;
          },
          then(resolve: (val: any) => void, _reject?: any) {
            const collection = store.getCollection(selectedTable);
            let result = [...collection];

            if (whereFn) {
              // Basic active filter check
              if (whereFn?.toString().includes("false")) {
                result = result.filter((item) => item.active === false);
              } else if (whereFn?.toString().includes("true") || whereFn?.value === true) {
                result = result.filter((item) => item.active === true);
              }
            }

            if (isCountQuery) {
              resolve([{ value: result.length }]);
              return;
            }

            // sort by sortOrder
            result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
            resolve(result);
          },
        };

        return builder;
      },

      insert(table: any) {
        return {
          values(val: any) {
            const newItem = {
              id: store.nextId++,
              ...val,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            const collection = store.getCollection(table);
            collection.push(newItem);

            return {
              returning(_fields?: any) {
                return {
                  then(resolve: (val: any) => void) {
                    resolve([newItem]);
                  },
                };
              },
            };
          },
        };
      },

      update(table: any) {
        return {
          set(val: any) {
            return {
              where(condition: any) {
                return {
                  returning(_fields?: any) {
                    return {
                      then(resolve: (val: any) => void) {
                        const collection = store.getCollection(table);
                        // Extract id from condition if possible
                        const targetId = condition?.value ?? condition?.right?.value ?? condition?.id;
                        const idx = collection.findIndex((item) => !targetId || item.id === targetId || item.id === Number(targetId));
                        if (idx !== -1) {
                          collection[idx] = { ...collection[idx], ...val, updatedAt: new Date() };
                          resolve([collection[idx]]);
                        } else if (collection.length > 0) {
                          collection[0] = { ...collection[0], ...val, updatedAt: new Date() };
                          resolve([collection[0]]);
                        } else {
                          resolve([]);
                        }
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },

      delete(table: any) {
        return {
          where(condition: any) {
            return {
              returning(fields?: any) {
                return {
                  then(resolve: (val: any) => void) {
                    const collection = store.getCollection(table);
                    const targetId = condition?.value ?? condition?.right?.value ?? condition?.id;
                    const idx = collection.findIndex((item) => !targetId || item.id === targetId || item.id === Number(targetId));
                    if (idx !== -1) {
                      const deleted = collection.splice(idx, 1)[0];
                      resolve([deleted]);
                    } else if (collection.length > 0) {
                      const deleted = collection.splice(0, 1)[0];
                      resolve([deleted]);
                    } else {
                      resolve([]);
                    }
                  },
                };
              },
            };
          },
        };
      },
    };
  }
}
