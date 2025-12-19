import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getBlogPost, getAllBlogPosts, BlogPost } from '@/data/blogPosts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function RelatedPostCard({ post }: { post: BlogPost }) {
  const { isEnglish } = useLanguage();
  const slug = isEnglish ? post.slugEn : post.slug;
  const path = isEnglish ? `/en/blog/${slug}` : `/blog/${slug}`;

  return (
    <Link to={path} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-2">
          <Badge variant="secondary" className="w-fit text-xs mb-2">
            {isEnglish ? post.category.en : post.category.de}
          </Badge>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {isEnglish ? post.title.en : post.title.de}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime} min
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isEnglish } = useLanguage();
  
  const post = getBlogPost(slug || '', isEnglish);
  
  if (!post) {
    return <Navigate to={isEnglish ? '/en/blog' : '/blog'} replace />;
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.category.en === post.category.en)
    .slice(0, 3);

  const title = isEnglish ? post.title.en : post.title.de;
  const content = isEnglish ? post.content.en : post.content.de;
  const excerpt = isEnglish ? post.excerpt.en : post.excerpt.de;
  const category = isEnglish ? post.category.en : post.category.de;

  return (
    <Layout>
      <SEOHead
        title={`${title} | itsFeierabend Blog`}
        description={excerpt}
      />

      {/* Hero */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container-section relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              {/* Back Link */}
              <Link
                to={isEnglish ? '/en/blog' : '/blog'}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                {isEnglish ? 'Back to Blog' : 'Zurück zum Blog'}
              </Link>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground mb-6">
                {excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString(isEnglish ? 'en-US' : 'de-CH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min {isEnglish ? 'read' : 'Lesezeit'}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="container-section">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
              </article>
            </ScrollReveal>

            <Separator className="my-12" />

            {/* CTA */}
            <ScrollReveal>
              <div className="bg-muted rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">
                  {isEnglish
                    ? 'Want to Apply These Strategies?'
                    : 'Willst du diese Strategien anwenden?'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isEnglish
                    ? 'Get a free audit and personalized recommendations for your business.'
                    : 'Hol dir ein kostenloses Audit und personalisierte Empfehlungen für dein Unternehmen.'}
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
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-muted/50">
          <div className="container-section">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-8 text-center">
                {isEnglish ? 'Related Articles' : 'Ähnliche Artikel'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </Layout>
  );
}

// Simple markdown-to-HTML converter for the content
function formatContent(content: string): string {
  return content
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\*\*(.+?)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });
}
