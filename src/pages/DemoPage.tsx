import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
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

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      track('demo_complete', { page_path: window.location.pathname });
    };

    const handleError = () => {
      setAudioError(true);
      setAudioLoaded(false);
    };

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
    <Layout>
      <SEOHead
        title={isDE ? 'AI Lead Concierge Demo | itsFeierabend.ch' : 'AI Lead Concierge Demo | itsFeierabend.ch'}
        description={isDE 
          ? 'Hör dir eine Demo unseres AI Lead Concierge an.'
          : 'Listen to a demo of our AI Lead Concierge.'
        }
      />

      <SectionContainer className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {isDE ? 'AI Lead Concierge Demo' : 'AI Lead Concierge Demo'}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12">
            {isDE 
              ? 'Beispiel-Gespräch. Nicht jede Konversation ist identisch. Der Agent stellt sich transparent als digitaler Assistent vor.'
              : 'Example conversation. Not every conversation is identical. The agent clearly identifies as AI.'
            }
          </p>

          {/* Audio Player */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-12">
            <audio
              ref={audioRef}
              src="/audio/lead-concierge-demo.mp3"
              preload="metadata"
            />

            {audioError || !siteConfig.audioDemoEnabled ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {isDE 
                    ? 'Demo wird gerade vorbereitet.'
                    : 'Demo is being prepared.'
                  }
                </p>
                <Button disabled>
                  <Play className="w-5 h-5 mr-2" />
                  {isDE ? 'Demo abspielen' : 'Play demo'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Play Button */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={togglePlay}
                    disabled={!audioLoaded}
                    className={cn(
                      'w-16 h-16 rounded-full',
                      isPlaying ? 'bg-primary/90' : 'bg-primary'
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    disabled={!audioLoaded}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Volume Control */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    disabled={!audioLoaded}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="primary"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="demo-page"
            >
              {t.cta.getAudit}
            </CTAButton>
            <CTAButton
              variant="secondary"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location="demo-page"
            >
              {t.cta.bookCall}
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
