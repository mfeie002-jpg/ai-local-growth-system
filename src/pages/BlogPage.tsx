import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getAllBlogPosts, getFeaturedPosts, BlogPost } from '@/data/blogPosts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const { isEnglish } = useLanguage();
  const slug = isEnglish ? post.slugEn : post.slug;
  const path = isEnglish ? `/en/blog/${slug}` : `/blog/${slug}`;

  return (
    <Link to={path} className="group block">
      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${featured ? 'bg-gradient-to-br from-card to-primary/5' : ''}`}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {isEnglish ? post.category.en : post.category.de}
            </Badge>
            {featured && (
              <Badge variant="default" className="text-xs bg-primary">
                Featured
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
            {isEnglish ? post.title.en : post.title.de}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {isEnglish ? post.excerpt.en : post.excerpt.de}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString(isEnglish ? 'en-US' : 'de-CH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min
              </span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BlogPage() {
  const { isEnglish } = useLanguage();
  const featuredPosts = getFeaturedPosts();
  const allPosts = getAllBlogPosts();

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Blog & Resources | Digital Marketing Insights' : 'Blog & Ressourcen | Digital Marketing Insights'}
        description={isEnglish
          ? 'Expert insights on Local SEO, Google Ads, AI automation, and digital marketing for local service businesses in Switzerland.'
          : 'Expertenwissen zu Local SEO, Google Ads, KI-Automatisierung und Digital Marketing für lokale Dienstleister in der Schweiz.'
        }
      />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container-section relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                {isEnglish ? 'Knowledge Hub' : 'Wissens-Hub'}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {isEnglish ? 'Blog & Resources' : 'Blog & Ressourcen'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {isEnglish
                  ? 'Practical guides, tips, and strategies for local service businesses looking to grow with digital marketing.'
                  : 'Praktische Guides, Tipps und Strategien für lokale Dienstleister, die mit Digital Marketing wachsen wollen.'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Posts */}
      <SectionContainer background="muted">
        <SectionHeader
          title={isEnglish ? 'Featured Articles' : 'Empfohlene Artikel'}
          subtitle={isEnglish
            ? 'Our most popular and impactful content'
            : 'Unsere beliebtesten und wirkungsvollsten Inhalte'}
        />
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} featured />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionContainer>

      {/* All Posts */}
      <SectionContainer>
        <SectionHeader
          title={isEnglish ? 'All Articles' : 'Alle Artikel'}
          subtitle={isEnglish
            ? 'Browse our complete collection of guides and insights'
            : 'Durchstöbere unsere komplette Sammlung an Guides und Insights'}
        />
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer background="accent" padding="large">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {isEnglish
                ? 'Ready to Put This Knowledge Into Action?'
                : 'Bereit, dieses Wissen in die Tat umzusetzen?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {isEnglish
                ? 'Get a free audit and see how we can help you grow your local service business.'
                : 'Hol dir ein kostenloses Audit und erfahre, wie wir dir helfen können, dein lokales Unternehmen zu wachsen.'}
            </p>
            <Link
              to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {isEnglish ? 'Get Free Audit' : 'Gratis Audit holen'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </Layout>
  );
}
