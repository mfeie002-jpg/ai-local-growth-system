/**
 * ReportSkeleton — zero-CLS loading state for report pages.
 * Mirrors the hero grid (left text column + right ScoreCard aside) so when
 * real content arrives, the layout stays put.
 */
import { SectionMarker, AIAnnotation } from '@/components/neural';

interface ReportSkeletonProps {
  marker?: string;
  /** Reserve approximate height of the headline subline */
  showSubline?: boolean;
  /** Render the right-hand score aside (analysis/audit reports) */
  showAside?: boolean;
}

const Bar = ({ w = '100%', h = 12 }: { w?: string; h?: number }) => (
  <div
    className="rounded-sm bg-foreground/10 animate-pulse"
    style={{ width: w, height: `${h}px` }}
  />
);

export function ReportSkeleton({
  marker = 'Loading',
  showSubline = true,
  showAside = true,
}: ReportSkeletonProps) {
  return (
    <section className="pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
      <div className="container-section">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Left — headline placeholder */}
          <div className="col-span-12 lg:col-span-8">
            <SectionMarker index={0} total={6} label={marker} />
            {/* Reserve heading height: matches h1 line-height ~0.98 of 5.5rem */}
            <div
              className="space-y-3"
              style={{ minHeight: 'clamp(180px, 22vw, 240px)' }}
            >
              <Bar w="80%" h={56} />
              <Bar w="60%" h={56} />
            </div>
            {showSubline && (
              <div className="mt-8 space-y-2 max-w-2xl" style={{ minHeight: '64px' }}>
                <Bar w="95%" h={16} />
                <Bar w="78%" h={16} />
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2" style={{ minHeight: '14px' }}>
              <Bar w="120px" h={10} />
              <Bar w="160px" h={10} />
              <Bar w="60px" h={10} />
            </div>
          </div>

          {/* Right — ScoreCard placeholder reserves identical footprint */}
          {showAside && (
            <aside className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
              <div className="hidden lg:block rule-hairline w-12" />
              <div className="card-paper p-8 flex flex-col items-center">
                {/* ScoreCard ring placeholder — fixed 200px to match real component */}
                <div
                  className="rounded-full bg-foreground/5 animate-pulse"
                  style={{ width: 200, height: 200 }}
                  aria-hidden
                />
                <div className="mt-6 w-3/4" style={{ minHeight: '24px' }}>
                  <Bar w="100%" h={16} />
                </div>
                <div className="mt-3 w-full space-y-2" style={{ minHeight: '40px' }}>
                  <Bar w="100%" h={12} />
                  <Bar w="80%" h={12} />
                </div>
                {/* 3-up stat row reservation */}
                <div className="mt-6 w-full pt-6 border-t border-border/80 grid grid-cols-3 gap-2">
                  <Bar h={28} />
                  <Bar h={28} />
                  <Bar h={28} />
                </div>
                {/* Button placeholder */}
                <div className="w-full mt-6">
                  <Bar h={32} />
                </div>
              </div>
              <AIAnnotation>loading · reserving space · no layout shift</AIAnnotation>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
