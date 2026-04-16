import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// ── Types (shared with AnalysisReportPage) ─────────────────────────
interface Signal {
  id: string;
  category: string;
  label: string;
  value: number | boolean | string;
  score: number;
  confidence: string;
  source: string;
  details?: string;
}

interface CategoryScore {
  id: string;
  name: string;
  weight: number;
  score: number;
  signals: Signal[];
  issueCount: number;
  criticalCount: number;
}

interface AIInterpretation {
  headline?: string;
  summary?: string;
  top_3_opportunities?: Array<{
    title: string;
    why: string;
    impact: string;
    effort: string;
    signal_ids?: string[];
  }>;
  strengths?: string[];
  risk_if_ignored?: string;
  recommended_action?: string;
  recommended_action_reason?: string;
}

export interface ReportPDFData {
  site_name: string;
  overall_score: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  ai_interpretation: AIInterpretation | null;
  scoring_details: { categories: CategoryScore[]; overall: number } | null;
  normalized_signals: Signal[];
  data_sources_used: string[] | null;
  scan_duration_ms: number | null;
  scan_version: string | null;
  created_at: string;
  checks_passed: number;
  checks_total: number;
}

// ── Colors ─────────────────────────────────────────────────────────
const colors = {
  bg: '#0F172A',
  card: '#1E293B',
  cardLight: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  green: '#22C55E',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
  border: '#334155',
};

function scoreColor(score: number): string {
  if (score >= 80) return colors.green;
  if (score >= 60) return colors.yellow;
  if (score >= 40) return colors.orange;
  return colors.red;
}

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    padding: 40,
    fontFamily: 'Helvetica',
    color: colors.text,
    fontSize: 10,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryLight,
  },
  badge: {
    fontSize: 7,
    color: colors.primaryLight,
    backgroundColor: '#6366F120',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },

  // Hero
  siteName: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 6,
  },
  headline: {
    fontSize: 11,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 20,
    paddingHorizontal: 30,
  },

  // Score block
  scoreBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.card,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
  },
  scoreLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // Sections
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },

  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Summary
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.textMuted,
  },

  // Opportunity
  oppNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6366F120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  oppNumText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryLight,
  },
  oppTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  oppDesc: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 1.5,
  },
  impactBadge: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontFamily: 'Helvetica-Bold',
  },

  // Category row
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 6,
    marginBottom: 4,
  },
  catName: {
    flex: 1,
    fontSize: 10,
  },
  catScore: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: colors.cardLight,
    borderRadius: 2,
    marginLeft: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },

  // Signal row
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    gap: 6,
  },
  signalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  signalLabel: {
    flex: 1,
    fontSize: 8,
    color: colors.textMuted,
  },
  signalScore: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  signalSource: {
    fontSize: 7,
    color: colors.textDim,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: colors.cardLight,
  },

  // Strength item
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
    gap: 6,
  },
  checkmark: {
    color: colors.green,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 1,
  },
  strengthText: {
    flex: 1,
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: colors.textDim,
  },
  footerBrand: {
    fontSize: 8,
    color: colors.primaryLight,
    fontFamily: 'Helvetica-Bold',
  },
});

// ── Helpers ────────────────────────────────────────────────────────
function impactColor(impact: string) {
  if (impact === 'high') return { bg: '#EF444430', text: colors.red };
  if (impact === 'medium') return { bg: '#EAB30830', text: colors.yellow };
  return { bg: colors.cardLight, text: colors.textMuted };
}

function impactLabel(impact: string, isDE: boolean) {
  if (impact === 'high') return isDE ? 'Hoch' : 'High';
  if (impact === 'medium') return isDE ? 'Mittel' : 'Medium';
  return isDE ? 'Niedrig' : 'Low';
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'pagespeed': return 'PageSpeed';
    case 'observatory': return 'Observatory';
    case 'firecrawl': return 'Firecrawl';
    default: return source;
  }
}

// ── Component ──────────────────────────────────────────────────────
interface ReportPDFProps {
  report: ReportPDFData;
  isDE?: boolean;
}

const ReportPDF: React.FC<ReportPDFProps> = ({ report, isDE = true }) => {
  const ai = report.ai_interpretation;
  const categories = report.scoring_details?.categories || [];
  const sc = scoreColor(report.overall_score);

  return (
    <Document title={`${report.site_name} — Digitaler Reifegrad-Check`} author="itsFeierabend.ch">
      {/* ───── PAGE 1: Overview ───── */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <Text style={s.brand}>itsFeierabend.ch</Text>
          <Text style={s.badge}>{isDE ? 'Digitaler Reifegrad-Check' : 'Digital Maturity Check'}</Text>
        </View>
        <View style={s.divider} />

        {/* Site name + headline */}
        <Text style={s.siteName}>{report.site_name}</Text>
        {ai?.headline && <Text style={s.headline}>{ai.headline}</Text>}

        {/* Score */}
        <View style={s.scoreBlock}>
          <View style={[s.scoreCircle, { borderColor: sc }]}>  
            <Text style={[s.scoreNumber, { color: sc }]}>{report.overall_score}</Text>
          </View>
          <Text style={s.scoreLabel}>{isDE ? 'Digitaler Reifegrad' : 'Digital Maturity Score'}</Text>
          <View style={s.badgeRow}>
            <Text style={[s.countBadge, { backgroundColor: '#6366F130', color: colors.primaryLight }]}>
              {report.critical_issues} {isDE ? 'Top-Potenziale' : 'Top Potentials'}
            </Text>
            <Text style={[s.countBadge, { backgroundColor: '#EAB30830', color: colors.yellow }]}>
              {report.warning_issues} {isDE ? 'Verbesserungen' : 'Improvements'}
            </Text>
            <Text style={[s.countBadge, { backgroundColor: colors.cardLight, color: colors.textMuted }]}>
              {report.info_issues} {isDE ? 'Gut aufgestellt' : 'Well set up'}
            </Text>
          </View>
        </View>

        {/* AI Summary */}
        {ai?.summary && (
          <View style={s.card}>
            <Text style={s.summaryText}>{ai.summary}</Text>
          </View>
        )}

        {/* Top 3 Opportunities */}
        {ai?.top_3_opportunities && ai.top_3_opportunities.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.sectionTitle}>{isDE ? 'Grösste Chancen' : 'Biggest Opportunities'}</Text>
            {ai.top_3_opportunities.map((opp, i) => {
              const ic = impactColor(opp.impact);
              return (
                <View key={i} style={s.card}>
                  <View style={s.cardRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={s.oppNumber}>
                        <Text style={s.oppNumText}>{i + 1}</Text>
                      </View>
                      <Text style={s.oppTitle}>{opp.title}</Text>
                    </View>
                    <Text style={[s.impactBadge, { backgroundColor: ic.bg, color: ic.text }]}>
                      {impactLabel(opp.impact, isDE)}
                    </Text>
                  </View>
                  <Text style={s.oppDesc}>{opp.why}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            {isDE ? 'Erstellt am' : 'Generated'} {new Date(report.created_at).toLocaleDateString(isDE ? 'de-CH' : 'en-US')}
            {' · '}{report.data_sources_used?.length || 0} {isDE ? 'Datenquellen' : 'data sources'}
          </Text>
          <Text style={s.footerBrand}>itsFeierabend.ch</Text>
        </View>
      </Page>

      {/* ───── PAGE 2: Categories + Signals ───── */}
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.brand}>itsFeierabend.ch</Text>
          <Text style={[s.badge, { fontSize: 7 }]}>{report.site_name}</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.sectionTitle}>{isDE ? 'Digitaler Reifegrad nach Bereich' : 'Digital Maturity by Area'}</Text>

        {categories.map((cat) => (
          <View key={cat.id} style={{ marginBottom: 8 }} wrap={false}>
            {/* Category header */}
            <View style={s.catRow}>
              <Text style={s.catName}>{cat.name}</Text>
              <Text style={[s.catScore, { color: scoreColor(cat.score) }]}>{cat.score}</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, {
                  width: `${cat.score}%`,
                  backgroundColor: scoreColor(cat.score),
                }]} />
              </View>
            </View>

            {/* Signals */}
            {cat.signals?.map((signal) => (
              <View key={signal.id} style={s.signalRow}>
                <View style={[s.signalDot, { backgroundColor: scoreColor(signal.score) }]} />
                <Text style={s.signalLabel}>{signal.label}</Text>
                <Text style={s.signalSource}>{sourceLabel(signal.source)}</Text>
                <Text style={[s.signalScore, { color: scoreColor(signal.score) }]}>{signal.score}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Strengths */}
        {ai?.strengths && ai.strengths.length > 0 && (
          <View style={{ marginTop: 16 }} wrap={false}>
            <Text style={s.sectionTitle}>{isDE ? 'Was bereits gut läuft' : 'What\'s already working well'}</Text>
            <View style={s.card}>
              {ai.strengths.map((str, i) => (
                <View key={i} style={s.strengthItem}>
                  <Text style={s.checkmark}>✓</Text>
                  <Text style={s.strengthText}>{str}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action motivation */}
        {ai?.risk_if_ignored && (
          <View style={[s.card, { marginTop: 8, borderLeftWidth: 3, borderLeftColor: colors.primaryLight }]} wrap={false}>
            <Text style={[s.sectionSubtitle, { color: colors.primaryLight, marginBottom: 4 }]}>
              {isDE ? 'Was sich verändert, wenn du handelst' : 'What changes when you act'}
            </Text>
            <Text style={s.summaryText}>{ai.risk_if_ignored}</Text>
          </View>
        )}

        {/* CTA box */}
        <View style={[s.card, { marginTop: 16, backgroundColor: '#6366F115', borderWidth: 1, borderColor: '#6366F140' }]} wrap={false}>
          <Text style={[s.sectionSubtitle, { textAlign: 'center' }]}>
            {isDE ? 'Bereit für den nächsten Schritt?' : 'Ready for the next step?'}
          </Text>
          {ai?.recommended_action_reason && (
            <Text style={[s.summaryText, { textAlign: 'center', marginTop: 4 }]}>
              {ai.recommended_action_reason}
            </Text>
          )}
          <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: colors.primaryLight, fontFamily: 'Helvetica-Bold' }}>
            itsfeierabend.ch/gratis-call
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Version {report.scan_version || 'v1.0'} · {report.normalized_signals?.length || 0} Signals · {report.checks_passed}/{report.checks_total} {isDE ? 'Bereiche' : 'areas'}
          </Text>
          <Text style={s.footerBrand}>itsFeierabend.ch</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;
