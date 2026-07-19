"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Flame,
  Gamepad2,
  Gem,
  Shield,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// Tools Grid 卡片 -> section id 映射（8 张卡片与 8 个模块锚点一一对应）
const TOOL_CARD_SECTIONS = [
  "guildrun-beginner-guide",
  "guildrun-demo-release",
  "guildrun-heroes-tier-list",
  "guildrun-best-team-builds",
  "guildrun-specializations",
  "guildrun-items-relics",
  "guildrun-difficulty-endless",
  "guildrun-updates",
];

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://guildrunwiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Guildrun Wiki",
        description:
          "Complete Guildrun Wiki covering heroes, builds, relics, items, specializations, team synergies, difficulty progression, demo tips, and weekly updates for the PvE roguelike autobattler on Steam.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Guildrun - PvE Roguelike Autobattler",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Guildrun Wiki",
        alternateName: "Guildrun",
        url: siteUrl,
        description:
          "Complete Guildrun Wiki resource hub for heroes, builds, relics, items, specializations, and team synergy guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Guildrun Wiki - PvE Roguelike Autobattler",
        },
        sameAs: [
          "https://www.playguildrun.com/",
          "https://store.steampowered.com/app/3669200/Guildrun/",
          "https://discord.gg/guildrun",
          "https://www.reddit.com/r/Guildrun/",
          "https://x.com/PlayGuildrun",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Guildrun",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Roguelike", "Strategy", "RPG", "Auto Battler"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/4425970/Guildrun_Demo/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Guildrun - Official Announcement Trailer",
        description:
          "Official Guildrun announcement trailer showcasing the PvE roguelike autobattler gameplay, hero recruitment, and synergy-based team building.",
        uploadDate: "2026-06-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/Ul2Of4SE2GM",
        url: "https://www.youtube.com/watch?v=Ul2Of4SE2GM",
      },
    ],
  };

  // Difficulty accordion state (Module 7)
  const [difficultyExpanded, setDifficultyExpanded] = useState<number | null>(
    0,
  );
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("guildrun-beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/4425970/Guildrun_Demo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section（紧随 Hero）===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="Ul2Of4SE2GM"
              title="Guildrun - Official Announcement Trailer"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards（视频区之后）===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_CARD_SECTIONS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端方形 / 桌面横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Module 1: Guildrun Beginner Guide (step-by-step) ===== */}
      <section id="guildrun-beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunBeginnerGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.guildrunBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold pt-1.5 md:pt-2">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 ml-0 md:ml-16">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2 ml-0 md:ml-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                      {step.priority}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-dashed border-border text-xs md:text-sm text-muted-foreground">
                      {step.mistake}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.guildrunBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 2: Guildrun Demo and Release Date (card-list) ===== */}
      <section id="guildrun-demo-release" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gamepad2 className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunDemoAndRelease.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunDemoAndRelease.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.guildrunDemoAndRelease.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base md:text-lg">
                      {card.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {card.status}
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                    {card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 3: Guildrun Heroes Tier List (tier-grid) ===== */}
      <section id="guildrun-heroes-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunHeroesTierList.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunHeroesTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.guildrunHeroesTierList.tiers.map(
              (tier: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex md:flex-col items-center justify-center md:justify-start gap-2 md:gap-1 md:w-24 flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[hsl(var(--nav-theme))] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-white">
                        {tier.tier}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-center text-[hsl(var(--nav-theme-light))]">
                      {tier.label}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Profile: </span>
                      {tier.profile}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Why this tier: </span>
                      {tier.reason}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.paths.map((p: string, pi: number) => (
                        <span
                          key={pi}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Ideal items: </span>
                      {tier.items}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Team fit: </span>
                      {tier.fit}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 4: Guildrun Best Team Builds (card-list) ===== */}
      <section id="guildrun-best-team-builds" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Swords className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunBestTeamBuilds.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunBestTeamBuilds.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.guildrunBestTeamBuilds.builds.map(
              (build: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-lg md:text-xl mb-3 text-[hsl(var(--nav-theme-light))]">
                    {build.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {build.roles.map((r: string, ri: number) => (
                      <span
                        key={ri}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                      >
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                        {r}
                      </span>
                    ))}
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground inline">Positioning: </dt>
                      <dd className="text-muted-foreground inline">{build.positioning}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Items: </dt>
                      <dd className="text-muted-foreground inline">{build.items}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Relics: </dt>
                      <dd className="text-muted-foreground inline">{build.relics}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Upgrade path: </dt>
                      <dd className="text-muted-foreground inline">{build.upgrade}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Alternatives: </dt>
                      <dd className="text-muted-foreground inline">{build.alternatives}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 5: Guildrun Specializations and Classes (table) ===== */}
      <section id="guildrun-specializations" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunSpecializationsAndClasses.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunSpecializationsAndClasses.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">Role</th>
                  <th className="text-left p-4 font-semibold">Battlefield Job</th>
                  <th className="text-left p-4 font-semibold">Specialization Focus</th>
                  <th className="text-left p-4 font-semibold">Multiclass Value</th>
                  <th className="text-left p-4 font-semibold">Upgrade Priority</th>
                  <th className="text-left p-4 font-semibold">Respec Use</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.guildrunSpecializationsAndClasses.classes.map(
                  (c: any, index: number) => (
                    <tr
                      key={index}
                      className={`border-t border-border ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="p-4 font-bold text-[hsl(var(--nav-theme-light))] align-top">{c.role}</td>
                      <td className="p-4 text-muted-foreground align-top">{c.job}</td>
                      <td className="p-4 text-muted-foreground align-top">{c.focus}</td>
                      <td className="p-4 text-muted-foreground align-top">{c.multiclass}</td>
                      <td className="p-4 text-muted-foreground align-top">{c.upgrade}</td>
                      <td className="p-4 text-muted-foreground align-top">{c.respec}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* 移动卡片 */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.guildrunSpecializationsAndClasses.classes.map(
              (c: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">{c.role}</h3>
                  <dl className="space-y-1.5 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground inline">Job: </dt>
                      <dd className="text-muted-foreground inline">{c.job}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Focus: </dt>
                      <dd className="text-muted-foreground inline">{c.focus}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Multiclass: </dt>
                      <dd className="text-muted-foreground inline">{c.multiclass}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Upgrade: </dt>
                      <dd className="text-muted-foreground inline">{c.upgrade}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground inline">Respec: </dt>
                      <dd className="text-muted-foreground inline">{c.respec}</dd>
                    </div>
                  </dl>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 6: Guildrun Items and Relics Tier List (tier-grid) ===== */}
      <section id="guildrun-items-relics" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gem className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunItemsAndRelicsTierList.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunItemsAndRelicsTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.guildrunItemsAndRelicsTierList.tiers.map(
              (tier: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 sm:w-40 sm:flex-shrink-0">
                    <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme))] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">{tier.tier}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base leading-tight">{tier.category}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Power: {tier.power} · Flex: {tier.flexibility}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Best with: </span>
                      {tier.bestWith}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Reason: </span>
                      {tier.reason}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Module 7: Guildrun Difficulty Levels and Endless Mode (accordion) ===== */}
      <section id="guildrun-difficulty-endless" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Flame className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunDifficultyAndEndless.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunDifficultyAndEndless.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.guildrunDifficultyAndEndless.levels.map(
              (level: any, index: number) => {
                const isOpen = difficultyExpanded === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setDifficultyExpanded(isOpen ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-sm md:text-base">
                          {level.name}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 md:px-5 pb-5 pl-4 md:pl-[4.25rem] space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Unlock: </span>
                          {level.unlock}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Challenge: </span>
                          {level.challenge}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Preparation: </span>
                          {level.preparation}
                        </p>
                        {level.goal && (
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">Goal: </span>
                            {level.goal}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 8: Guildrun Updates and Patch Notes (timeline) ===== */}
      <section id="guildrun-updates" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Clock className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.guildrunUpdatesAndPatchNotes.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.guildrunUpdatesAndPatchNotes.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.guildrunUpdatesAndPatchNotes.updates.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {entry.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {entry.date}
                      </span>
                    </div>
                    <h3 className="font-bold mb-1.5">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1.5">
                      {entry.changes}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Build impact: </span>
                      {entry.impact}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== Latest Updates Section（8 模块之后）===== */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* ===== FAQ Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ===== CTA Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Footer ===== */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/guildrun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/PlayGuildrun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/3669200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/3669200/Guildrun/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
