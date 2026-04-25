import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowUpRight, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead, ArticleSchema, BreadcrumbSchema } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBlogPost, getAllBlogPosts, BlogPost } from '@/data/blogPosts';
import { ReadingProgress } from '@/components/ReadingProgress';

function RelatedPostCard({ post, index }: { post: BlogPost; index: number }) {
  const { isEnglish } = useLanguage();
  const slug = isEnglish ? post.slugEn : post.slug;
  const path = isEnglish ? `/en/blog/${slug}` : `/blog/${slug}`;
  const num = String(index + 1).padStart(2, '0');

  return (
    <Link to={path} className="group block border border-border/60 bg-card/40 backdrop-blur-sm hover:border-primary/60 transition-all duration-500">
      <div className="relative h-40 overflow-hidden">
        <img
          src={post.thumbnail}
          alt={isEnglish ? post.title.en : post.title.de}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <span className="absolute top-3 left-3 font-editorial text-[10px] font-semibold tracking-[0.2em] text-foreground/90 backdrop-blur-md bg-background/40 px-2 py-1">
          {num} / {(isEnglish ? post.category.en : post.category.de).toUpperCase()}
        </span>
      </div>
      <div className="p-6">
        <h4 className="font-editorial text-xl font-semibold leading-tight text-foreground group-hover:text-aurora transition-colors line-clamp-2 mb-3">
          {isEnglish ? post.title.en : post.title.de}
        </h4>
        <div className="flex items-center justify-between text-xs text-muted-foreground tracking-wider">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> {post.readTime} min
          </span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isEnglish } = useLanguage();

  const post = getBlogPost(slug || '', isEnglish);
  if (!post) return <Navigate to={isEnglish ? '/en/blog' : '/blog'} replace />;

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.categoryKey === post.categoryKey)
    .slice(0, 3);

  const title = isEnglish ? post.title.en : post.title.de;
  const content = isEnglish ? post.content.en : post.content.de;
  const excerpt = isEnglish ? post.excerpt.en : post.excerpt.de;
  const category = isEnglish ? post.category.en : post.category.de;

  const baseUrl = 'https://itsfeierabend.ch';
  const blogPath = isEnglish ? '/en/blog' : '/blog';
  const currentPath = `${blogPath}/${isEnglish ? post.slugEn : post.slug}`;

  const breadcrumbItems = [
    { name: isEnglish ? 'Home' : 'Startseite', url: isEnglish ? `${baseUrl}/en` : baseUrl },
    { name: 'Blog', url: `${baseUrl}${blogPath}` },
    { name: title, url: `${baseUrl}${currentPath}` },
  ];

  return (
    <Layout>
      <ReadingProgress />
      <SEOHead title={`${title} | Blog`} description={excerpt} ogImage={post.thumbnail} />
      <ArticleSchema headline={title} description={excerpt} datePublished={post.date} author={post.author} image={post.thumbnail} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <Link
            to={isEnglish ? '/en/blog' : '/blog'}
            className="inline-flex items-center gap-2 text-xs font-editorial font-semibold tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-3 h-3" />
            {isEnglish ? 'Back to Blog' : 'Zurück zum Blog'}
          </Link>

          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3 space-y-6 lg:pt-4">
              <div>
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase block mb-2">
                  {isEnglish ? 'Category' : 'Kategorie'}
                </span>
                <span className="text-aurora font-editorial text-lg font-semibold">{category}</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" /> {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString(isEnglish ? 'en-US' : 'de-CH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min {isEnglish ? 'read' : 'Lesezeit'}
                </div>
              </div>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                  {title}
                </h1>
                <p className="mt-8 max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light">
                  {excerpt}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className="relative">
        <div className="container-section py-12">
          <div className="relative aspect-[21/9] overflow-hidden border border-border/60">
            <img src={post.thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-20">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <div className="col-span-12 lg:col-span-2 hidden lg:block">
              <div className="sticky top-32">
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Article' : 'Artikel'}
                </span>
                <div className="mt-3 h-px w-12 bg-aurora" style={{ background: 'var(--gradient-aurora)' }} />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <ScrollReveal>
                <article
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-editorial prose-headings:font-semibold prose-headings:tracking-tight
                    prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8
                    prose-p:text-foreground/90 prose-p:leading-relaxed
                    prose-a:text-aurora prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:text-foreground/90"
                >
                  <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
                </article>
              </ScrollReveal>

              {/* CTA inline */}
              <ScrollReveal>
                <div className="mt-16 relative overflow-hidden border border-border/60 bg-card/40 backdrop-blur-sm p-8 sm:p-12">
                  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
                  <div className="relative">
                    <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      {isEnglish ? 'Next step' : 'Nächster Schritt'}
                    </span>
                    <h3 className="mt-3 font-editorial text-3xl sm:text-4xl font-bold leading-tight">
                      {isEnglish ? (
                        <>Apply this. <em className="italic text-aurora">Get an audit.</em></>
                      ) : (
                        <>Setz es um. <em className="italic text-aurora">Hol dir ein Audit.</em></>
                      )}
                    </h3>
                    <p className="mt-4 text-muted-foreground max-w-lg">
                      {isEnglish
                        ? 'Free, personalized recommendations for your business — delivered in minutes.'
                        : 'Kostenlose, personalisierte Empfehlungen für dein Unternehmen — in Minuten geliefert.'}
                    </p>
                    <Link
                      to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                      className="mt-6 inline-flex items-center gap-3 border border-foreground/40 px-6 py-3 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-aurora transition-all group"
                    >
                      {isEnglish ? 'Get Free Audit' : 'Gratis Audit holen'}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border/60 py-20 sm:py-28">
          <div className="container-section">
            <div className="mb-12">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {isEnglish ? 'Continue reading' : 'Weiterlesen'}
              </span>
              <h2 className="mt-3 font-editorial text-4xl sm:text-5xl font-bold leading-tight">
                {isEnglish ? 'Related articles' : 'Ähnliche Artikel'}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p, i) => (
                <RelatedPostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\*\*(.+?)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>');
}
