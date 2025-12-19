import { useLanguage } from '@/i18n/LanguageContext';
import { SectionContainer } from '@/components/SectionContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder logos - in production these would be actual client logos
const clientLogos = [
  { name: 'TechCorp', initial: 'T' },
  { name: 'SwissFinance', initial: 'SF' },
  { name: 'MediCare Plus', initial: 'M+' },
  { name: 'BuildRight', initial: 'BR' },
  { name: 'GreenEnergy', initial: 'GE' },
  { name: 'RetailMax', initial: 'RM' },
];

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export function SocialProofSection() {
  const { isEnglish } = useLanguage();

  const testimonials: Testimonial[] = isEnglish ? [
    {
      quote: "Their AI implementation transformed our customer service. Response times dropped by 85% and customer satisfaction is at an all-time high.",
      author: "Sarah M.",
      role: "CEO",
      company: "TechCorp",
      rating: 5,
    },
    {
      quote: "We went from page 3 to #1 on Google in just 4 months. The ROI on their SEO work has been incredible.",
      author: "Thomas K.",
      role: "Marketing Director",
      company: "SwissFinance",
      rating: 5,
    },
    {
      quote: "The team doesn't just run campaigns — they understand our business. Our lead quality improved dramatically while costs went down.",
      author: "Maria L.",
      role: "Founder",
      company: "MediCare Plus",
      rating: 5,
    },
  ] : [
    {
      quote: "Ihre KI-Implementierung hat unseren Kundenservice transformiert. Antwortzeiten sanken um 85% und die Kundenzufriedenheit ist auf einem Allzeithoch.",
      author: "Sarah M.",
      role: "CEO",
      company: "TechCorp",
      rating: 5,
    },
    {
      quote: "Wir sind in nur 4 Monaten von Seite 3 auf Platz 1 bei Google gestiegen. Der ROI ihrer SEO-Arbeit war unglaublich.",
      author: "Thomas K.",
      role: "Marketing Director",
      company: "SwissFinance",
      rating: 5,
    },
    {
      quote: "Das Team führt nicht nur Kampagnen durch — sie verstehen unser Geschäft. Unsere Lead-Qualität hat sich dramatisch verbessert, während die Kosten sanken.",
      author: "Maria L.",
      role: "Gründerin",
      company: "MediCare Plus",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Client Logos */}
      <SectionContainer className="py-12 border-y border-border/50">
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {isEnglish ? 'Trusted by leading companies' : 'Vertraut von führenden Unternehmen'}
            </p>
          </div>
        </ScrollReveal>
        <StaggerContainer className="flex flex-wrap justify-center items-center gap-8 md:gap-12" staggerDelay={0.08}>
          {clientLogos.map((logo, index) => (
            <StaggerItem key={index}>
              <div 
                className="flex items-center justify-center w-20 h-12 rounded-lg bg-card/50 border border-border/30 text-muted-foreground font-bold text-lg opacity-60 hover:opacity-100 transition-opacity"
                title={logo.name}
              >
                {logo.initial}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionContainer>

      {/* Testimonials */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display mb-4">
                {isEnglish ? 'What Our Clients Say' : 'Was unsere Kunden sagen'}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {isEnglish 
                  ? 'Real results from real businesses. See why companies trust us with their growth.'
                  : 'Echte Ergebnisse von echten Unternehmen. Sehen Sie, warum uns Firmen ihr Wachstum anvertrauen.'}
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <div 
                  className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full"
                >
                  {/* Quote icon */}
                  <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center text-sm font-bold text-primary">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionContainer>
    </>
  );
}