import type { ComponentType } from 'react';
import type { PlanetName, ZodiacSignName } from '@/data/zodiac';

const AriesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 80q30-60 60 0M50 20v30M20 50h60" /></svg>
);
const TaurusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="50" cy="65" r="25" /><path d="M30 35 A 20 20 0 0 1 70 35" /></svg>
);
const GeminiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M25 20v60M75 20v60M20 25h60M20 75h60" /></svg>
);
const CancerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M25 30 a 20 20 0 1 0 40 0M75 70 a 20 20 0 1 1 -40 0" /></svg>
);
const LeoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="40" cy="40" r="20" /><path d="M60 40h20m-30 0c0 30 40 30 40 0V20" /></svg>
);
const VirgoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 20v60M45 20v60M70 20v40c0 20 20 20 20-10V20" /></svg>
);
const LibraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 75h60M20 60h60M30 60V30 a20 20 0 0 1 40 0V60" /></svg>
);
const ScorpioIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 20v60M45 20v60M70 20v40c0 20 20 20 20 0l-10-10m-10 10l10-10" /></svg>
);
const SagittariusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 80L80 20M50 20H80V50M40 60h-20v-20" /></svg>
);
const CapricornIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 40V20h20M40 20l20 20M60 40c0 20 20 20 20 0a20 20 0 1 0-40 0z" /></svg>
);
const AquariusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 35l15-15 15 15 15-15 15 15M20 65l15-15 15 15 15-15 15 15" /></svg>
);
const PiscesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M25 20 a 40 40 0 0 0 0 60M75 20 a 40 40 0 0 1 0 60M20 50h60" /></svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="50" cy="50" r="25"/><circle cx="50" cy="50" r="8" fill="currentColor"/></svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M30 20 A 40 40 0 1 1 30 80 A 30 30 0 1 0 30 20 z"/></svg>
);
const MercuryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="50" cy="30" r="15"/><path d="M50 45v40M35 80h30"/><path d="M30 35 A 20 20 0 0 1 70 35"/></svg>
);
const VenusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="50" cy="35" r="25"/><path d="M50 60v30M30 75h40"/></svg>
);
const MarsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><circle cx="40" cy="60" r="25"/><path d="M60 40L90 10M70 10h20v20"/></svg>
);
const JupiterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 50 h 60 M40 20 v 60" /><path d="M25 25 A 40 40 0 0 1 25 75"/></svg>
);
const SaturnIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}><path d="M20 50 h 60 M40 30 v 40" /><path d="M20 70 A 40 20 0 0 0 80 70"/></svg>
);

const zodiacIconMap: Record<ZodiacSignName, ComponentType<any>> = {
  Aries: AriesIcon, Taurus: TaurusIcon, Gemini: GeminiIcon, Cancer: CancerIcon, Leo: LeoIcon, Virgo: VirgoIcon,
  Libra: LibraIcon, Scorpio: ScorpioIcon, Sagittarius: SagittariusIcon, Capricorn: CapricornIcon, Aquarius: AquariusIcon, Pisces: PiscesIcon
};

const planetIconMap: Record<PlanetName, ComponentType<any>> = {
    Sun: SunIcon, Moon: MoonIcon, Mercury: MercuryIcon, Venus: VenusIcon, Mars: MarsIcon, Jupiter: JupiterIcon, Saturn: SaturnIcon
};

export const getZodiacIcon = (name: ZodiacSignName) => zodiacIconMap[name];
export const getPlanetIcon = (name: PlanetName) => planetIconMap[name];
