import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import {
  getGetAdminOverviewQueryKey,
  getHealthCheckQueryKey,
  getListAdminBannersQueryKey,
  getListAdminGamesQueryKey,
  getListAdminPromotionsQueryKey,
  getListBannersQueryKey,
  getListFixturesQueryKey,
  getListGamesQueryKey,
  getListPromotionsQueryKey,
  useCreateBanner,
  useCreateGame,
  useCreatePromotion,
  useDeleteBanner,
  useDeleteGame,
  useDeletePromotion,
  useGetAdminOverview,
  useHealthCheck,
  useListAdminBanners,
  useListAdminGames,
  useListAdminPromotions,
  useListBanners,
  useListFixtures,
  useListGames,
  useListPromotions,
  useUpdateBanner,
  useUpdateGame,
  useUpdatePromotion,
  type Banner,
  type BannerInput,
  type BannerUpdate,
  type Fixture,
  type Game,
  type GameInput,
  type GameUpdate,
  type Promotion,
  type PromotionInput,
  type PromotionUpdate,
} from '@workspace/api-client-react';
import {
  Activity, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, CircleAlert, Compass, Dices, Gamepad2,
  Gift, Image, LayoutDashboard, LoaderCircle, Pencil, Plus, Search, ShieldCheck, Sparkles,
  Trophy, Users, X, Trash2,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkPubKey = rawClerkKey ? publishableKeyFromHost(window.location.hostname, rawClerkKey) : '';
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const appearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#f7d44b', colorForeground: '#f4eddf', colorMutedForeground: '#aeb3c1',
    colorDanger: '#ef747a', colorBackground: '#202537', colorInput: '#171c2a',
    colorInputForeground: '#f4eddf', colorNeutral: '#41485b', fontFamily: 'Outfit, sans-serif',
    borderRadius: '14px',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#202537] rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#f4eddf] font-bold',
    headerSubtitle: 'text-[#aeb3c1]',
    socialButtonsBlockButtonText: 'text-[#e9e7df]',
    formFieldLabel: 'text-[#d8d9df]',
    footerActionLink: 'text-[#f7d44b]',
    footerActionText: 'text-[#aeb3c1]',
    dividerText: 'text-[#aeb3c1]',
    identityPreviewEditButton: 'text-[#f7d44b]',
    formFieldSuccessText: 'text-[#90d7b4]',
    alertText: 'text-[#f4eddf]',
    logoBox: 'rounded-xl',
    logoImage: 'rounded-lg',
    socialButtonsBlockButton: 'border-[#41485b] bg-[#292f42]',
    formButtonPrimary: 'text-[#171923] bg-[#f7d44b]',
    formFieldInput: 'text-[#f4eddf] bg-[#171c2a] border-[#41485b]',
    footerAction: 'border-[#343a4d]',
    dividerLine: 'bg-[#41485b]',
    alert: 'bg-[#342830] border-[#71434a]',
    otpCodeFieldInput: 'text-[#f4eddf] bg-[#171c2a]',
    formFieldRow: 'text-[#d8d9df]',
    main: 'text-[#f4eddf]',
  },
};

function Brand() {
  return <Link href="/" className="brand"><span className="brand-mark">A</span><span>A–Z ARENA</span></Link>;
}

const navItems = [
  { href: '/', label: 'Explore', Icon: Compass },
  { href: '/casino', label: 'Games', Icon: Gamepad2 },
  { href: '/sports', label: 'Sports', Icon: Trophy },
  { href: '/rummy', label: 'Rummy', Icon: Dices },
  { href: '/promotions', label: 'Rewards', Icon: Gift },
];

function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="arena-shell">
      <header className="topbar">
        <Brand />
        <nav className="topnav" aria-label="Main navigation">
          {navItems.map(({ href, label }) => <Link key={href} href={href} className={location === href ? 'active' : ''}>{label}</Link>)}
          <Link href="/admin" className={location.startsWith('/admin') ? 'active' : ''}>Admin</Link>
          <Link href="/sign-in" className="brand-link" data-testid="button-sign-in">Sign in</Link>
        </nav>
      </header>
      {children}
      <footer className="footer">
        <strong>A-Z Arena</strong> · Play for the joy of it. Every game uses demo credits only.
        <br />No deposits, cash prizes, or withdrawals. Take a pause whenever you need one.
      </footer>
      <nav className="mobile-nav" aria-label="Quick navigation">
        {navItems.map(({ href, label, Icon }) => <Link key={href} href={href} className={location === href ? 'active' : ''}><Icon /><span>{label}</span></Link>)}
      </nav>
    </div>
  );
}

function LoadingState({ label = 'Finding your next favorite' }: { label?: string }) {
  return <div className="loading-state" aria-live="polite"><div className="loading-bars"><i /><i /><i /></div><p>{label}</p></div>;
}

function QueryError({ onRetry, title = 'That did not load' }: { onRetry: () => void; title?: string }) {
  return <div className="error-state" role="alert"><CircleAlert size={24} /><h3>{title}</h3><p>Check your connection and give it another try.</p><button className="secondary-btn" onClick={onRetry}>Try again</button></div>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="empty-state"><Sparkles size={24} /><h3>{title}</h3><p>{copy}</p></div>;
}

const categories = ['All games', 'Arcade', 'Card games', 'Board games', 'Puzzle', 'Casual'];
const tones = ['#c8644c', '#d7a838', '#337c8b', '#8f5270', '#497255', '#64599d'];
const initials = (name: string) => name.trim().slice(0, 1).toUpperCase();

function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <>
    <article className="game-card" data-testid={`card-game-${game.id}`}>
      <div className="game-image" style={{ '--tone': tones[index % tones.length] } as CSSProperties}>
        {game.imageUrl ? <img src={game.imageUrl} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : null}
        <span className="game-fallback">{initials(game.name)}</span>
        {game.badge && <span className="game-badge">{game.badge}</span>}
      </div>
      <div className="game-meta">
        <h3>{game.name}</h3><p>{game.provider} · {game.category}</p>
        <div className="game-foot"><span><Users size={12} style={{ verticalAlign: '-2px' }} /> {game.players.toLocaleString()} playing</span><button type="button" onClick={() => setPreviewOpen(true)} data-testid={`button-play-${game.id}`}>Play demo <ArrowRight size={13} /></button></div>
      </div>
    </article>
    {previewOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPreviewOpen(false); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby={`preview-title-${game.id}`}>
        <div className="modal-head"><div><span className="eyebrow">Demo-credit arcade</span><h2 id={`preview-title-${game.id}`}>{game.name}</h2></div><button className="icon-btn" onClick={() => setPreviewOpen(false)} aria-label="Close game preview"><X size={17} /></button></div>
        <p style={{ color: '#b7bdca', lineHeight: 1.6 }}>This game is listed in the catalog, but a playable session is not connected yet. When available, sessions will use demo credits only.</p>
        <div className="notice"><ShieldCheck size={15} style={{ verticalAlign: '-3px', marginRight: 6 }} />No deposits, prizes, or withdrawals.</div>
        <div className="modal-actions"><button className="primary-btn" onClick={() => setPreviewOpen(false)}>Back to games</button></div>
      </section>
    </div>}
    </>
  );
}

function GameGrid({ games, loading, error, retry, emptyTitle = 'No games found', emptyCopy = 'Try another category or search term.' }: {
  games?: Game[]; loading: boolean; error: boolean; retry: () => void; emptyTitle?: string; emptyCopy?: string;
}) {
  if (loading) return <LoadingState />;
  if (error) return <QueryError onRetry={retry} />;
  if (!games?.length) return <EmptyState title={emptyTitle} copy={emptyCopy} />;
  return <div className="game-grid">{games.map((game, index) => <GameCard key={game.id} game={game} index={index} />)}</div>;
}

function SectionTitle({ title, detail, href }: { title: string; detail?: string; href?: string }) {
  return <div className="section-head"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{href && <Link className="section-link" href={href}>Explore all <ChevronRight size={16} /></Link>}</div>;
}

function LobbyHero() {
  const bannersQuery = useListBanners({ query: { queryKey: getListBannersQueryKey() } });
  const [activeIndex, setActiveIndex] = useState(0);
  const banners = bannersQuery.data ?? [];
  const banner = banners.length ? banners[activeIndex % banners.length] : undefined;
  const step = (direction: number) => setActiveIndex(current => (current + direction + banners.length) % banners.length);

  return <section className={`hero ${banner?.imageUrl ? 'hero-has-image' : ''}`}>
    {banner?.imageUrl && <img className="hero-background" src={banner.imageUrl} alt="" />}
    <div className="hero-copy">
      <span className="eyebrow">{banner ? 'From the arena noticeboard' : bannersQuery.isLoading ? 'Loading live highlights' : 'A little play goes a long way'}</span>
      <h1 className="display">{banner ? banner.title : <>{bannersQuery.isLoading ? 'The lobby is getting ready.' : 'Good games.'}<br />{bannersQuery.isLoading ? 'Coming right up.' : 'Good energy.'}</>}</h1>
      <p>{banner ? banner.subtitle : bannersQuery.isLoading ? 'One moment while we fetch the latest lobby banner.' : 'Your pocket-sized arcade for quick rounds, clever moves, and friendly competition. Always just for fun.'}</p>
      <Link href="/casino" className="primary-btn">{banner?.ctaLabel || 'Explore games'} <ArrowRight size={17} /></Link>
      {bannersQuery.isError && <p className="hero-api-note" role="status">Live highlights are unavailable right now. You can still explore the games.</p>}
      {banners.length > 1 && <div className="hero-controls" aria-label="Lobby banners">
        <button className="hero-arrow" onClick={() => step(-1)} aria-label="Previous banner"><ChevronLeft size={16} /></button>
        {banners.map((item, index) => <button key={item.id} aria-label={`Show banner ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} className={`hero-dot ${index === activeIndex ? 'selected' : ''}`} onClick={() => setActiveIndex(index)} />)}
        <button className="hero-arrow" onClick={() => step(1)} aria-label="Next banner"><ChevronRight size={16} /></button>
      </div>}
    </div>
    <div className="hero-art" aria-hidden="true"><div className="orbit" /><div className="orbit two" /><div className="hero-token">A</div><div className="hero-float float-one"><strong>Play your way</strong><br />No pressure. Just play.</div><div className="hero-float float-two"><Sparkles size={14} /> &nbsp;A fresh round awaits</div></div>
  </section>;
}

function HomePage() {
  const gamesQuery = useListGames();
  const promosQuery = useListPromotions();
  const games = gamesQuery.data;
  const featured = games?.filter(game => game.featured).slice(0, 4) ?? [];
  const picks = games?.slice(0, 8) ?? [];
  const promos = promosQuery.data?.slice(0, 1) ?? [];
  return <SiteShell><main className="page-wrap">
    <LobbyHero />
    <div className="notice" style={{ marginTop: 18 }}><ShieldCheck size={16} style={{ verticalAlign: '-3px', marginRight: 7 }} />Demo credits only. No deposits or cash prizes. Play for entertainment, and take breaks when you need them.</div>
    <section className="tile-section"><SectionTitle title="Featured today" detail="A few bright spots from the game room." href="/casino" />
      <GameGrid games={featured} loading={gamesQuery.isLoading} error={gamesQuery.isError} retry={() => void gamesQuery.refetch()} emptyTitle="The arcade is warming up" emptyCopy="Featured games will appear here once the catalog is ready." />
    </section>
    <section className="tile-section"><SectionTitle title="Find your kind of fun" detail="A quick browse, a long session, or somewhere in between." href="/casino" />
      <div className="category-row">{categories.slice(1).map((category, i) => <Link href={`/casino?category=${encodeURIComponent(category)}`} className="category-pill" key={category}><span>{['Quick-play', 'Strategy', 'Tabletop', 'Brain teasers', 'Easygoing'][i]}</span></Link>)}</div>
    </section>
    {promosQuery.isLoading ? <div style={{ marginTop: 30 }}><LoadingState label="Checking the noticeboard" /></div> : promosQuery.isError ? <div style={{ marginTop: 30 }}><QueryError title="Rewards are taking a break" onRetry={() => void promosQuery.refetch()} /></div> : promos[0] ? <section className="tile-section"><div className="promo-strip"><div><span className="eyebrow">On the noticeboard</span><h3>{promos[0].title}</h3><p>{promos[0].description}</p></div><Link href="/promotions" className="secondary-btn">See rewards <ArrowRight size={16} /></Link></div></section> : null}
    <section className="tile-section"><SectionTitle title="Popular right now" detail="Games the community is spending time with." href="/casino" /><GameGrid games={picks} loading={gamesQuery.isLoading} error={gamesQuery.isError} retry={() => void gamesQuery.refetch()} /></section>
  </main></SiteShell>;
}

function CasinoPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const query = useListGames({ category: category || undefined, q: search || undefined });
  return <SiteShell><main className="page-wrap">
    <span className="eyebrow">The arcade</span><h1 className="page-title display">Pick a game.<br />Make a moment.</h1>
    <p className="page-intro">Browse the game room at your own pace. Every session is played with demo credits, never real money.</p>
    <label className="searchbox"><Search size={18} color="#9298aa" /><input aria-label="Search games" data-testid="input-search-games" placeholder="Search games, providers, or styles" value={search} onChange={event => setSearch(event.target.value)} /><button className="quiet-btn" aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></button></label>
    <div className="category-row">{categories.map(name => <button key={name} className={`category-pill ${((!category && name === 'All games') || category === name) ? 'active' : ''}`} onClick={() => setCategory(name === 'All games' ? '' : name)}>{name}</button>)}</div>
    <div className="section-head"><div><h2>{category || 'All games'}</h2><p>{query.data?.length ?? '—'} games to explore</p></div></div>
    <GameGrid games={query.data} loading={query.isLoading} error={query.isError} retry={() => void query.refetch()} emptyTitle="No games match just yet" emptyCopy="Try a shorter search or choose another category." />
  </main></SiteShell>;
}

function predictionFor(fixture: Fixture) {
  const offset = fixture.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return offset % 2 ? fixture.homeTeam : fixture.awayTeam;
}

function FixturesPage() {
  const query = useListFixtures();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const fixtures = query.data;
  return <SiteShell><main className="page-wrap">
    <span className="eyebrow">The matchday board</span><h1 className="page-title display">Sport, without<br />the stakes.</h1>
    <p className="page-intro">Follow fixture times and compare a playful sample pick. These are for conversation only — no wagering, odds, or prizes.</p>
    <div className="notice"><ShieldCheck size={16} style={{ verticalAlign: '-3px', marginRight: 7 }} />Informational fixtures and sample predictions only. No betting actions are available here.</div>
    <SectionTitle title="Upcoming fixtures" detail="A simple guide to what's on." />
    {query.isLoading ? <LoadingState label="Loading the fixture board" /> : query.isError ? <QueryError onRetry={() => void query.refetch()} /> : !fixtures?.length ? <EmptyState title="No fixtures listed" copy="Check back later for the next fixture update." /> :
      <div className="fixture-list">{fixtures.map(fixture => {
        const suggested = predictionFor(fixture);
        const chosen = selections[fixture.id];
        const date = new Date(fixture.startTime);
        return <article className="fixture-card" key={fixture.id} data-testid={`fixture-${fixture.id}`}>
          <div className="fixture-league"><span>{fixture.league}</span><span>{fixture.status}</span></div>
          <div className="fixture-teams"><span>{fixture.homeTeam}</span><span className="fixture-vs">VS</span><span>{fixture.awayTeam}</span></div>
          <div className="fixture-time"><CalendarDays size={14} style={{ verticalAlign: '-3px', marginRight: 5 }} />{Number.isNaN(date.valueOf()) ? fixture.startTime : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
          <div className="prediction-row"><span>Sample prediction:</span><button className={chosen === fixture.homeTeam ? 'selected' : ''} onClick={() => setSelections(prev => ({ ...prev, [fixture.id]: fixture.homeTeam }))}>{fixture.homeTeam}</button><button className={chosen === fixture.awayTeam ? 'selected' : ''} onClick={() => setSelections(prev => ({ ...prev, [fixture.id]: fixture.awayTeam }))}>{fixture.awayTeam}</button><span>{chosen ? `Just for fun: ${chosen}` : `Editorial pick: ${suggested}`}</span></div>
        </article>;
      })}</div>}
  </main></SiteShell>;
}

function RummyPage() {
  const [round, setRound] = useState(1);
  return <SiteShell><main className="page-wrap">
    <span className="eyebrow">Practice table</span><h1 className="page-title display">Rummy, at<br />your own pace.</h1>
    <p className="page-intro">A relaxed points-only practice space. No entry fee, money, or cash-out — only a little card-table practice.</p>
    <div className="play-credit"><ShieldCheck size={15} /> PRACTICE MODE · 0 DEMO POINTS USED</div>
    <section className="rummy-board" style={{ marginTop: 20 }}>
      <div><span className="eyebrow">Round {round} · Open practice</span><h2 className="display" style={{ fontSize: 35, margin: '12px 0' }}>Your table is ready</h2><p style={{ color: '#c2cbd0', maxWidth: 430, lineHeight: 1.5 }}>Try a sample hand and get comfortable with the rhythm. This preview keeps the play points-only.</p>
        <div className="rummy-cards" aria-label="Sample hand">{['A♠', '4♦', '4♣', '8♥', '9♥'].map((card, i) => <span className="rummy-card" style={{ '--rot': `${(i - 2) * 3}deg` } as CSSProperties} key={card}>{card}</span>)}</div>
        <button className="primary-btn" onClick={() => setRound(value => value + 1)}><Dices size={17} /> Deal a practice hand</button>
      </div>
    </section>
    <section className="tile-section"><SectionTitle title="A friendly reminder" /><div className="notice"><ShieldCheck size={16} style={{ verticalAlign: '-3px', marginRight: 7 }} />Practice rounds do not award prizes and cannot be exchanged for money. Keep it light, and step away whenever it stops being fun.</div></section>
  </main></SiteShell>;
}

function PromotionsPage() {
  const query = useListPromotions();
  return <SiteShell><main className="page-wrap"><span className="eyebrow">Good things, no strings</span><h1 className="page-title display">A little extra<br />play credit.</h1>
    <p className="page-intro">Promotional play credits are for trying more games. They have no cash value and can’t be withdrawn or exchanged.</p>
    <div className="notice"><Gift size={16} style={{ verticalAlign: '-3px', marginRight: 7 }} />Rewards are demo play credits only. No deposits or cash prizes.</div>
    <section className="tile-section"><SectionTitle title="Noticeboard" detail="Current community rewards and updates." />
      {query.isLoading ? <LoadingState label="Loading the noticeboard" /> : query.isError ? <QueryError title="The noticeboard is unavailable" onRetry={() => void query.refetch()} /> : !query.data?.length ? <EmptyState title="Nothing new on the board" copy="New play-credit rewards will show up here when available." /> :
        <div className="promo-grid">{query.data.map(promo => <article className="promo-card" key={promo.id}><span className="promo-badge">{promo.badge}</span><h3>{promo.title}</h3><p>{promo.description}</p></article>)}</div>}
    </section>
  </main></SiteShell>;
}

function SignInPage() {
  if (!clerkPubKey) {
    return (
      <div className="auth-backdrop">
        <div style={{ textAlign: 'center', maxWidth: 440, padding: 32, background: '#202537', borderRadius: 16 }}>
          <Brand />
          <h2 style={{ color: '#f4eddf', fontSize: 22, margin: '20px 0 10px' }}>Authentication Setup</h2>
          <p style={{ color: '#aeb3c1', fontSize: 14, lineHeight: 1.6 }}>
            Sign-in is powered by Clerk. Provide <code>VITE_CLERK_PUBLISHABLE_KEY</code> in environment variables to enable authentication.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/" className="primary-btn" style={{ display: 'inline-flex' }}>Return to Lobby <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    );
  }
  return <div className="auth-backdrop"><div><div className="auth-brand"><Brand /><p>Your next favorite game is just around the corner.</p></div><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div></div>;
}
function SignUpPage() {
  if (!clerkPubKey) {
    return (
      <div className="auth-backdrop">
        <div style={{ textAlign: 'center', maxWidth: 440, padding: 32, background: '#202537', borderRadius: 16 }}>
          <Brand />
          <h2 style={{ color: '#f4eddf', fontSize: 22, margin: '20px 0 10px' }}>Create an Account</h2>
          <p style={{ color: '#aeb3c1', fontSize: 14, lineHeight: 1.6 }}>
            Account creation is powered by Clerk. Provide <code>VITE_CLERK_PUBLISHABLE_KEY</code> in environment variables to enable registration.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/" className="primary-btn" style={{ display: 'inline-flex' }}>Return to Lobby <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    );
  }
  return <div className="auth-backdrop"><div><div className="auth-brand"><Brand /><p>Join the arcade. Browse freely, play for fun.</p></div><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div></div>;
}

type Resource = 'games' | 'promotions' | 'banners';
type AdminMode = 'overview' | Resource;
const adminLinks: { mode: AdminMode; href: string; title: string; Icon: typeof LayoutDashboard }[] = [
  { mode: 'overview', href: '/admin', title: 'Overview', Icon: LayoutDashboard },
  { mode: 'games', href: '/admin/games', title: 'Game catalog', Icon: Gamepad2 },
  { mode: 'promotions', href: '/admin/promotions', title: 'Promotions', Icon: Gift },
  { mode: 'banners', href: '/admin/banners', title: 'Hero banners', Icon: Image },
];

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const object = error as { status?: number; response?: { status?: number }; cause?: { status?: number } };
  return object.status ?? object.response?.status ?? object.cause?.status;
}

function AdminAuthError({ status }: { status: number }) {
  if (status === 401) return <div className="admin-error"><ShieldCheck /><h2>Sign in to manage the arena</h2><p>Your admin session is missing or has expired. Sign in with your approved administrator account to continue.</p><Link href="/sign-in" className="primary-btn">Sign in <ArrowRight size={15} /></Link></div>;
  if (status === 403) return <div className="admin-error"><CircleAlert /><h2>Admin access is restricted</h2><p>You are signed in, but this account is not on the administrator allowlist. No console data has been shown.</p><Link href="/" className="secondary-btn">Return to the lobby</Link></div>;
  return <div className="admin-error"><CircleAlert /><h2>Console connection failed</h2><p>The admin API could not be reached. Retry after checking the API service.</p></div>;
}

function AdminHealth() {
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 45000 } });
  return <span className={`status-chip ${health.isError ? 'off' : ''}`} title={health.data?.status || (health.isLoading ? 'Checking API' : 'API unavailable')}><Activity size={11} style={{ verticalAlign: '-2px', marginRight: 4 }} />{health.isLoading ? 'Checking' : health.isError ? 'API offline' : 'API online'}</span>;
}

function AdminFrame({ children, mode }: { children: ReactNode; mode: AdminMode }) {
  return <SiteShell><main className="page-wrap">
    <span className="eyebrow">Arena operations</span><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><h1 className="page-title display" style={{ marginTop: 8 }}>Admin console</h1><AdminHealth /></div>
    <p className="page-intro">Manage the live catalog and announcements. Changes publish through the protected admin API.</p>
    <div className="admin-layout">
      <nav className="admin-side">{adminLinks.map(({ mode: itemMode, href, title, Icon }) => <Link href={href} className={mode === itemMode ? 'active' : ''} key={href}><Icon size={16} />{title}</Link>)}</nav>
      <section>{children}</section>
    </div>
  </main></SiteShell>;
}

function useAdminInvalidation() {
  const client = useQueryClient();
  return () => Promise.all([
    client.invalidateQueries({ queryKey: getGetAdminOverviewQueryKey() }),
    client.invalidateQueries({ queryKey: getListAdminGamesQueryKey() }),
    client.invalidateQueries({ queryKey: getListAdminPromotionsQueryKey() }),
    client.invalidateQueries({ queryKey: getListAdminBannersQueryKey() }),
    client.invalidateQueries({ queryKey: getListGamesQueryKey() }),
    client.invalidateQueries({ queryKey: getListPromotionsQueryKey() }),
    client.invalidateQueries({ queryKey: getListBannersQueryKey() }),
  ]);
}

function OverviewAdmin() {
  const overview = useGetAdminOverview({ query: { queryKey: getGetAdminOverviewQueryKey() } });
  if (overview.isLoading) return <AdminFrame mode="overview"><LoadingState label="Loading console metrics" /></AdminFrame>;
  if (overview.isError) return <AdminFrame mode="overview"><AdminAuthError status={errorStatus(overview.error) ?? 500} /><button className="secondary-btn" style={{ marginTop: 12 }} onClick={() => void overview.refetch()}>Retry request</button></AdminFrame>;
  const counts = overview.data;
  if (!counts) return <AdminFrame mode="overview"><EmptyState title="No overview returned" copy="The admin API did not provide a summary." /></AdminFrame>;
  const stats = [
    ['Games', counts.totalGames, counts.activeGames, Gamepad2],
    ['Promotions', counts.totalPromotions, counts.activePromotions, Gift],
    ['Hero banners', counts.totalBanners, counts.activeBanners, Image],
  ] as const;
  return <AdminFrame mode="overview"><SectionTitle title="Your arena at a glance" detail="A live snapshot from the admin service." />
    <div className="stats-grid">{stats.map(([label, total, active, Icon]) => <div className="stat-card" key={label}><Icon size={17} color="#f7d44b" /><span style={{ display: 'block', marginTop: 11 }}>{label}</span><strong>{total}</strong><span>{active} active</span></div>)}</div>
    <div className="notice"><Activity size={15} style={{ verticalAlign: '-3px', marginRight: 7 }} />Metrics are live from the API. Use the sections at left to update the public experience.</div>
    <div className="section-head"><div><h2>Quick links</h2><p>Jump into the parts you manage most.</p></div></div>
    <div className="category-row">{adminLinks.slice(1).map(({ href, title, Icon }) => <Link href={href} key={href} className="category-pill"><Icon size={14} style={{ verticalAlign: '-3px', marginRight: 6 }} />{title}</Link>)}</div>
  </AdminFrame>;
}

function resourceStatus(error: unknown) {
  return errorStatus(error) ?? 500;
}

function ResourceAdmin({ resource }: { resource: Resource }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Game | Promotion | Banner | null>(null);
  const [message, setMessage] = useState('');
  const invalidate = useAdminInvalidation();
  const games = useListAdminGames({ query: { queryKey: getListAdminGamesQueryKey(), enabled: resource === 'games' } });
  const promotions = useListAdminPromotions({ query: { queryKey: getListAdminPromotionsQueryKey(), enabled: resource === 'promotions' } });
  const banners = useListAdminBanners({ query: { queryKey: getListAdminBannersQueryKey(), enabled: resource === 'banners' } });
  const createGame = useCreateGame(); const updateGame = useUpdateGame(); const deleteGame = useDeleteGame();
  const createPromotion = useCreatePromotion(); const updatePromotion = useUpdatePromotion(); const deletePromotion = useDeletePromotion();
  const createBanner = useCreateBanner(); const updateBanner = useUpdateBanner(); const deleteBanner = useDeleteBanner();
  const query = resource === 'games' ? games : resource === 'promotions' ? promotions : banners;
  const rows = resource === 'games' ? games.data : resource === 'promotions' ? promotions.data : banners.data;
  const resourceName = resource === 'games' ? 'game' : resource === 'promotions' ? 'promotion' : 'banner';
  const title = resource === 'games' ? 'Game catalog' : resource === 'promotions' ? 'Promotions' : 'Hero banners';
  const pending = createGame.isPending || updateGame.isPending || deleteGame.isPending || createPromotion.isPending || updatePromotion.isPending || deletePromotion.isPending || createBanner.isPending || updateBanner.isPending || deleteBanner.isPending;

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const active = form.get('active') === 'on';
    const sortOrder = Number(form.get('sortOrder') || 0);
    const id = editing?.id;
    setMessage('');
    const finish = () => { void invalidate(); setModalOpen(false); setEditing(null); setMessage('Changes saved.'); };
    const fail = (error: unknown) => setMessage(errorStatus(error) === 401 ? 'Your admin session expired. Sign in again.' : errorStatus(error) === 403 ? 'This account is not authorized to change this item.' : 'The API could not save this change. Try again.');
    if (resource === 'games') {
      const values = { name: String(form.get('name') || ''), category: String(form.get('category') || ''), provider: String(form.get('provider') || ''), imageUrl: String(form.get('imageUrl') || ''), badge: String(form.get('badge') || '') || null, players: Number(form.get('players') || 0), featured: form.get('featured') === 'on', active, sortOrder };
      if (id) updateGame.mutate({ id, data: values as GameUpdate }, { onSuccess: finish, onError: fail });
      else createGame.mutate({ data: values as GameInput }, { onSuccess: finish, onError: fail });
    } else if (resource === 'promotions') {
      const values = { title: String(form.get('title') || ''), description: String(form.get('description') || ''), badge: String(form.get('badge') || ''), active, sortOrder };
      if (id) updatePromotion.mutate({ id, data: values as PromotionUpdate }, { onSuccess: finish, onError: fail });
      else createPromotion.mutate({ data: values as PromotionInput }, { onSuccess: finish, onError: fail });
    } else {
      const values = { title: String(form.get('title') || ''), subtitle: String(form.get('subtitle') || ''), imageUrl: String(form.get('imageUrl') || ''), ctaLabel: String(form.get('ctaLabel') || ''), active, sortOrder };
      if (id) updateBanner.mutate({ id, data: values as BannerUpdate }, { onSuccess: finish, onError: fail });
      else createBanner.mutate({ data: values as BannerInput }, { onSuccess: finish, onError: fail });
    }
  }

  function remove(item: Game | Promotion | Banner) {
    if (!window.confirm(`Delete this ${resourceName}? This cannot be undone.`)) return;
    const finish = () => { void invalidate(); setMessage(`${resourceName} deleted.`); };
    const fail = (error: unknown) => setMessage(errorStatus(error) === 401 ? 'Your admin session expired.' : errorStatus(error) === 403 ? 'This account is not authorized to delete this item.' : 'The delete request failed.');
    if (resource === 'games') deleteGame.mutate({ id: item.id }, { onSuccess: finish, onError: fail });
    else if (resource === 'promotions') deletePromotion.mutate({ id: item.id }, { onSuccess: finish, onError: fail });
    else deleteBanner.mutate({ id: item.id }, { onSuccess: finish, onError: fail });
  }
  const openEditor = (item?: Game | Promotion | Banner) => { setEditing(item ?? null); setMessage(''); setModalOpen(true); };

  return <AdminFrame mode={resource}>
    <div className="toolbar"><div><h2>{title}</h2><span style={{ color: '#999fb0', fontSize: 12 }}>{rows?.length ?? '—'} records</span></div><button className="primary-btn" onClick={() => openEditor()}><Plus size={16} />Add {resourceName}</button></div>
    {message && <div className="notice" role="status" style={{ marginBottom: 13 }}>{message}</div>}
    {query.isLoading ? <LoadingState label={`Loading ${title.toLowerCase()}`} /> : query.isError ? <><AdminAuthError status={resourceStatus(query.error)} /><button className="secondary-btn" style={{ marginTop: 12 }} onClick={() => void query.refetch()}>Retry request</button></> :
      !rows?.length ? <EmptyState title={`No ${title.toLowerCase()} yet`} copy={`Create the first ${resourceName} to start building out the public experience.`} /> :
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>{resource === 'games' ? 'Category / provider' : 'Badge / detail'}</th><th>Status</th><th>Order</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead><tbody>
          {rows.map(item => {
            const name = resource === 'games' ? (item as Game).name : (item as Promotion | Banner).title;
            const detail = resource === 'games' ? `${(item as Game).category} · ${(item as Game).provider}` : resource === 'promotions' ? (item as Promotion).badge : (item as Banner).ctaLabel;
            return <tr key={item.id} data-testid={`row-${resourceName}-${item.id}`}><td><strong>{name}</strong></td><td>{detail}</td><td><span className={`status-chip ${item.active ? '' : 'off'}`}>{item.active ? 'Active' : 'Paused'}</span></td><td>{item.sortOrder}</td><td><div className="admin-actions"><button className="icon-btn" title={`Edit ${name}`} aria-label={`Edit ${name}`} onClick={() => openEditor(item)}><Pencil size={14} /></button><button className="icon-btn" title={`Delete ${name}`} aria-label={`Delete ${name}`} onClick={() => remove(item)}><Trash2 size={14} /></button></div></td></tr>;
          })}
        </tbody></table></div>}
    {pending && <div className="notice" style={{ marginTop: 12 }}><LoaderCircle size={14} className="spin" style={{ verticalAlign: '-3px', marginRight: 6 }} />Saving your change…</div>}
    {modalOpen && <AdminEditor resource={resource} editing={editing} saving={pending} onClose={() => { setModalOpen(false); setEditing(null); }} onSubmit={save} />}
  </AdminFrame>;
}

function AdminEditor({ resource, editing, saving, onClose, onSubmit }: {
  resource: Resource; editing: Game | Promotion | Banner | null; saving: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const game = resource === 'games' ? editing as Game | null : null;
  const promo = resource === 'promotions' ? editing as Promotion | null : null;
  const banner = resource === 'banners' ? editing as Banner | null : null;
  const title = resource === 'games' ? 'Game details' : resource === 'promotions' ? 'Promotion details' : 'Banner details';
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <div className="modal-head"><div><span className="eyebrow">{editing ? 'Edit' : 'New'} {resource.slice(0, -1)}</span><h2 id="editor-title">{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close editor"><X size={17} /></button></div>
      <form onSubmit={onSubmit}><div className="form-grid">
        {resource === 'games' ? <>
          <Field label="Game name" name="name" required defaultValue={game?.name} />
          <Field label="Category" name="category" required defaultValue={game?.category} />
          <Field label="Provider" name="provider" required defaultValue={game?.provider} />
          <Field label="Badge" name="badge" defaultValue={game?.badge ?? ''} />
          <Field label="Image URL" name="imageUrl" required defaultValue={game?.imageUrl} full />
          <Field label="Players" name="players" type="number" defaultValue={game?.players ?? 0} />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={game?.sortOrder ?? 0} />
          <CheckField name="featured" defaultChecked={game?.featured} label="Featured on lobby" />
        </> : resource === 'promotions' ? <>
          <Field label="Title" name="title" required defaultValue={promo?.title} full />
          <Field label="Badge" name="badge" required defaultValue={promo?.badge} />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={promo?.sortOrder ?? 0} />
          <Field label="Description" name="description" as="textarea" defaultValue={promo?.description} full />
        </> : <>
          <Field label="Title" name="title" required defaultValue={banner?.title} full />
          <Field label="Subtitle" name="subtitle" defaultValue={banner?.subtitle} full />
          <Field label="Image URL" name="imageUrl" required defaultValue={banner?.imageUrl} full />
          <Field label="Button label" name="ctaLabel" required defaultValue={banner?.ctaLabel} />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={banner?.sortOrder ?? 0} />
        </>}
        <CheckField name="active" defaultChecked={editing?.active ?? true} label="Published and active" />
      </div>
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : `Create ${resource.slice(0, -1)}`}</button></div>
      </form>
    </section>
  </div>;
}

function Field({ label, name, defaultValue, required, type = 'text', full, as }: { label: string; name: string; defaultValue?: string | number; required?: boolean; type?: string; full?: boolean; as?: 'textarea' }) {
  return <div className={`field ${full ? 'full' : ''}`}><label htmlFor={`field-${name}`}>{label}</label>{as === 'textarea' ? <textarea id={`field-${name}`} name={name} defaultValue={defaultValue} required={required} /> : <input id={`field-${name}`} name={name} type={type} defaultValue={defaultValue} required={required} />}</div>;
}
function CheckField({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return <label className="check-row field full"><input type="checkbox" name={name} defaultChecked={defaultChecked} />{label}</label>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const prevUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserId.current !== undefined && prevUserId.current !== userId) client.clear();
      prevUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}

function ClerkRoutes() {
  const [, setLocation] = useLocation();
  const routeContent = (
    <RoutedErrorBoundary><Switch>
      <Route path="/" component={HomePage} />
      <Route path="/casino" component={CasinoPage} />
      <Route path="/sports" component={FixturesPage} />
      <Route path="/rummy" component={RummyPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/admin" component={OverviewAdmin} />
      <Route path="/admin/games" component={() => <ResourceAdmin resource="games" />} />
      <Route path="/admin/promotions" component={() => <ResourceAdmin resource="promotions" />} />
      <Route path="/admin/banners" component={() => <ResourceAdmin resource="banners" />} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route component={NotFound} />
    </Switch></RoutedErrorBoundary>
  );

  if (!clerkPubKey) {
    return routeContent;
  }

  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={appearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`}
    localization={{ signIn: { start: { title: 'Welcome back', subtitle: 'Sign in to your A–Z Arena account' } }, signUp: { start: { title: 'Join the arcade', subtitle: 'Make room for a little play' } } }}
    routerPush={to => setLocation(stripBase(to))} routerReplace={to => setLocation(stripBase(to), { replace: true })}>
    <ClerkQueryClientCacheInvalidator />
    {routeContent}
  </ClerkProvider>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={basePath}><ClerkRoutes /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
