import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones, ArrowUpRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { useLanguage } from '@/i18n/LanguageContext';
import { siteConfig } from '@/config/site';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function DemoPage() {
  const { t, isEnglish } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => { setDuration(audio.duration); setAudioLoaded(true); };
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false); setProgress(0);
      track('demo_complete', { page_path: window.location.pathname });
    };
    const handleError = () => { setAudioError(true); setAudioLoaded(false); };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audioLoaded) return;
    if (isPlaying) {
      audio.pause();
      track('demo_pause', { page_path: window.location.pathname });
    } else {
      audio.play();
      track('demo_play', { page_path: window.location.pathname });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setProgress(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isDE = !isEnglish;

  return (
    <Layout showPromo>
      <SEOHead
        title={isDE ? 'AI Lead Concierge Demo | itsFeierabend.ch' : 'AI Lead Concierge Demo | itsFeierabend.ch'}
        description={isDE
          ? 'Hör dir eine Demo unseres AI Lead Concierge an.'
          : 'Listen to a demo of our AI Lead Concierge.'
        }
      />

      {/* Hero — Editorial */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)' }}
          aria-hidden
        />

        <SectionContainer padding="large">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <aside className="lg:col-span-3 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 03 / Demo' : '§ 03 / Demo'}
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-5 space-y-3">
                <Headphones className="h-6 w-6 text-aurora" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isDE
                    ? 'Beispiel-Gespräch. Der Agent stellt sich transparent als digitaler Assistent vor.'
                    : 'Example conversation. The agent clearly identifies as AI.'
                  }
                </p>
              </div>
            </aside>

            <div className="lg:col-span-9 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{isDE ? 'Hör dem' : 'Hear the'}</span>
                <span className="block italic text-aurora">{isDE ? 'Concierge zu.' : 'Concierge.'}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {isDE
                  ? 'Ein echter Anruf, beantwortet von unserem AI Lead Concierge. Keine Skripte, keine Schauspieler.'
                  : 'A real call, answered by our AI Lead Concierge. No scripts, no actors.'
                }
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Audio Player */}
      <section className="relative">
        <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel rounded-2xl p-8 sm:p-12">
              <div className="flex items-center gap-3 mb-8">
                <span className="font-editorial text-aurora text-sm tracking-widest">01</span>
                <span className="h-px flex-1 bg-border/60" />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isDE ? 'Sample Call' : 'Sample Call'}
                </span>
              </div>

              <audio ref={audioRef} src="/audio/lead-concierge-demo.mp3" preload="metadata" />

              {audioError || !siteConfig.audioDemoEnabled ? (
                <div className="text-center py-10">
                  <p className="font-editorial text-2xl text-muted-foreground mb-6">
                    {isDE ? 'Demo wird gerade vorbereitet.' : 'Demo is being prepared.'}
                  </p>
                  <Button disabled>
                    <Play className="w-5 h-5 mr-2" />
                    {isDE ? 'Demo abspielen' : 'Play demo'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-center">
                    <button
                      onClick={togglePlay}
                      disabled={!audioLoaded}
                      className={cn(
                        'relative w-24 h-24 rounded-full flex items-center justify-center transition-all',
                        'border border-border/60 hover:scale-105 disabled:opacity-50',
                      )}
                      style={{ background: 'var(--gradient-aurora)' }}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-background" />
                      ) : (
                        <Play className="w-8 h-8 text-background ml-1" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      disabled={!audioLoaded}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between font-editorial text-sm text-muted-foreground tracking-widest">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="ghost" size="sm" onClick={toggleMute} disabled={!audioLoaded}>
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: 'var(--gradient-sunset)' }}
          aria-hidden
        />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <SectionContainer>
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {isEnglish ? '— Next step' : '— Nächster Schritt'}
            </span>
            <h2 className="mt-6 font-editorial font-semibold leading-[0.95] tracking-tight text-4xl sm:text-6xl md:text-7xl">
              {isEnglish ? (
                <>Want one for <span className="italic text-aurora">your business?</span></>
              ) : (
                <>Willst du das für <span className="italic text-aurora">dein Business?</span></>
              )}
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-audit' : '/gratis-audit'} location="demo-page">
                {t.cta.getAudit}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={isEnglish ? '/en/free-call' : '/gratis-call'} location="demo-page">
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
