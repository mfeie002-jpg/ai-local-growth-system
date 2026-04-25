import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getAllBlogPosts, getFeaturedPosts, getPostsByCategory, categories, BlogPost } from '@/data/blogPosts';
import { cn } from '@/lib/utils';
import { NewsletterSignup } from '@/components/NewsletterSignup';

function BlogCard({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) {
  const { isEnglish } = useLanguage();
  const slug = isEnglish ? post.slugEn : post.slug;
  const path = isEnglish ? `/en/blog/${slug}` : `/blog/${slug}`;
  const num = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={path}
      className={cn(
        'group relative block overflow-hidden border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/60 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.4)]',
        featured && 'border-aurora'
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.thumbnail}
          alt={isEnglish ? post.title.en : post.title.de}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="font-editorial text-xs font-semibold tracking-[0.2em] text-foreground/90 backdrop-blur-md bg-background/40 px-3 py-1.5">
            {num} / {(isEnglish ? post.category.en : post.category.de).toUpperCase()}
          </span>
          {featured && (
            <span className="text-aurora font-editorial text-xs font-bold tracking-[0.25em]">
              ★ FEATURED
            </span>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="font-editorial text-2xl sm:text-3xl font-semibold leading-[1.1] text-foreground group-hover:text-aurora transition-colors mb-3">
          {isEnglish ? post.title.en : post.title.de}
        </h3>
        <p className="text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
          {isEnglish ? post.excerpt.en : post.excerpt.de}
        </p>
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString(isEnglish ? 'en-US' : 'de-CH', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-foreground transition-all duration-300 group-hover:rotate-45 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}

function CategoryFilter({
  selectedCategory, onCategoryChange,
}: { selectedCategory: string; onCategoryChange: (key: string) => void }) {
  const { isEnglish } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {categories.map((category) => {
        const active = selectedCategory === category.key;
        return (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={cn(
              'group relative px-4 py-2 text-xs font-editorial font-semibold tracking-[0.18em] uppercase border transition-all duration-300',
              active
                ? 'border-aurora bg-card text-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]'
                : 'border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground'
            )}
          >
            {isEnglish ? category.en : category.de}
          </button>
        );
      })}
    </div>
  );
}

export default function BlogPage() {
  const { isEnglish } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredPosts = getFeaturedPosts();
  const filteredPosts = getPostsByCategory(selectedCategory);

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Blog & Resources | Digital Marketing Insights' : 'Blog & Ressourcen | Digital Marketing Insights'}
        description={isEnglish
          ? 'Expert insights on Local SEO, Google Ads, AI automation, and digital marketing for local service businesses in Switzerland.'
          : 'Expertenwissen zu Local SEO, Google Ads, KI-Automatisierung und Digital Marketing für lokale Dienstleister in der Schweiz.'}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Knowledge / 03' : 'Wissen / 03'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {isEnglish
                  ? 'Field notes from the frontier of AI-powered growth, written for operators.'
                  : 'Feldnotizen von der Front KI-gestützten Wachstums — geschrieben für Macher.'}
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                  {isEnglish ? (
                    <>Insights, <em className="italic text-aurora not-italic-fix">unfiltered.</em></>
                  ) : (
                    <>Wissen, <em className="italic text-aurora">ungeschönt.</em></>
                  )}
                </h1>
                <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? 'Practical guides, tactical playbooks, and contrarian takes for service businesses building with AI.'
                    : 'Praxis-Guides, taktische Playbooks und kontroverse Perspektiven für Dienstleister, die mit KI bauen.'}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {selectedCategory === 'all' && featuredPosts.length > 0 && (
        <section className="border-b border-border/60 py-20 sm:py-28">
          <div className="container-section">
            <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  01 — {isEnglish ? 'Featured' : 'Empfohlen'}
                </span>
                <h2 className="mt-3 font-editorial text-4xl sm:text-5xl font-bold leading-tight">
                  {isEnglish ? 'Editor\u2019s picks' : 'Redaktions-Picks'}
                </h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All posts + filter */}
      <section className="py-20 sm:py-28">
        <div className="container-section">
          <div className="mb-12 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-6">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                02 — {isEnglish ? 'Archive' : 'Archiv'}
              </span>
              <h2 className="mt-3 font-editorial text-4xl sm:text-5xl font-bold leading-tight">
                {selectedCategory === 'all'
                  ? (isEnglish ? 'Every article' : 'Alle Artikel')
                  : (isEnglish
                      ? categories.find(c => c.key === selectedCategory)?.en || 'Articles'
                      : categories.find(c => c.key === selectedCategory)?.de || 'Artikel')}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {filteredPosts.length} {isEnglish ? `article${filteredPosts.length !== 1 ? 's' : ''}` : 'Artikel'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:flex lg:justify-end">
              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-border/60 bg-card/30">
              <p className="text-muted-foreground">
                {isEnglish ? 'No articles found in this category.' : 'Keine Artikel in dieser Kategorie gefunden.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-border/60 py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="container-section relative">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-sunset)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.05]" />
        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <h2 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                {isEnglish ? (
                  <>Knowledge is cheap. <em className="italic text-aurora">Action compounds.</em></>
                ) : (
                  <>Wissen ist günstig. <em className="italic text-aurora">Handeln zahlt sich aus.</em></>
                )}
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <Link
                to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                className="group inline-flex items-center gap-3 border border-foreground/40 bg-background/40 backdrop-blur-md px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-aurora hover:bg-background/60 transition-all"
              >
                {isEnglish ? 'Get Free Audit' : 'Gratis Audit holen'}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
