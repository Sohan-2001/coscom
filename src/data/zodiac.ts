import type { ComponentType } from 'react';

export type ZodiacSignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn';

export interface ZodiacSign {
  name: ZodiacSignName;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: string;
}

export interface Planet {
  name: PlanetName;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', element: 'Fire', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', element: 'Earth', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', element: 'Air', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', element: 'Water', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', element: 'Fire', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', element: 'Earth', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', element: 'Air', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', element: 'Water', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', element: 'Fire', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', element: 'Earth', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', element: 'Air', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', element: 'Water', dates: 'Feb 19 - Mar 20' },
];

export const PLANETS: Planet[] = [
  { name: 'Sun' },
  { name: 'Moon' },
  { name: 'Mercury' },
  { name: 'Venus' },
  { name: 'Mars' },
  { name: 'Jupiter' },
  { name: 'Saturn' },
];

const compatibilityMatrix: Record<
  ZodiacSignName,
  Record<ZodiacSignName, 'High' | 'Medium' | 'Low'>
> = {
  Aries: { Aries: 'Medium', Taurus: 'Low', Gemini: 'High', Cancer: 'Low', Leo: 'High', Virgo: 'Medium', Libra: 'High', Scorpio: 'Low', Sagittarius: 'High', Capricorn: 'Low', Aquarius: 'High', Pisces: 'Medium' },
  Taurus: { Aries: 'Low', Taurus: 'High', Gemini: 'Medium', Cancer: 'High', Leo: 'Low', Virgo: 'High', Libra: 'Medium', Scorpio: 'High', Sagittarius: 'Low', Capricorn: 'High', Aquarius: 'Low', Pisces: 'High' },
  Gemini: { Aries: 'High', Taurus: 'Medium', Gemini: 'High', Cancer: 'Medium', Leo: 'High', Virgo: 'Medium', Libra: 'High', Scorpio: 'Low', Sagittarius: 'High', Capricorn: 'Medium', Aquarius: 'High', Pisces: 'Low' },
  Cancer: { Aries: 'Low', Taurus: 'High', Gemini: 'Medium', Cancer: 'High', Leo: 'Medium', Virgo: 'High', Libra: 'Low', Scorpio: 'High', Sagittarius: 'Medium', Capricorn: 'High', Aquarius: 'Medium', Pisces: 'High' },
  Leo: { Aries: 'High', Taurus: 'Low', Gemini: 'High', Cancer: 'Medium', Leo: 'High', Virgo: 'Low', Libra: 'High', Scorpio: 'Low', Sagittarius: 'High', Capricorn: 'Low', Aquarius: 'High', Pisces: 'Medium' },
  Virgo: { Aries: 'Medium', Taurus: 'High', Gemini: 'Medium', Cancer: 'High', Leo: 'Low', Virgo: 'High', Libra: 'Medium', Scorpio: 'Medium', Sagittarius: 'Low', Capricorn: 'High', Aquarius: 'Low', Pisces: 'High' },
  Libra: { Aries: 'High', Taurus: 'Medium', Gemini: 'High', Cancer: 'Low', Leo: 'High', Virgo: 'Medium', Libra: 'High', Scorpio: 'Medium', Sagittarius: 'High', Capricorn: 'Low', Aquarius: 'High', Pisces: 'Medium' },
  Scorpio: { Aries: 'Low', Taurus: 'High', Gemini: 'Low', Cancer: 'High', Leo: 'Low', Virgo: 'Medium', Libra: 'Medium', Scorpio: 'High', Sagittarius: 'Low', Capricorn: 'Medium', Aquarius: 'Low', Pisces: 'High' },
  Sagittarius: { Aries: 'High', Taurus: 'Low', Gemini: 'High', Cancer: 'Medium', Leo: 'High', Virgo: 'Low', Libra: 'High', Scorpio: 'Low', Sagittarius: 'High', Capricorn: 'Low', Aquarius: 'High', Pisces: 'Medium' },
  Capricorn: { Aries: 'Low', Taurus: 'High', Gemini: 'Medium', Cancer: 'High', Leo: 'Low', Virgo: 'High', Libra: 'Low', Scorpio: 'Medium', Sagittarius: 'Low', Capricorn: 'High', Aquarius: 'Medium', Pisces: 'Medium' },
  Aquarius: { Aries: 'High', Taurus: 'Low', Gemini: 'High', Cancer: 'Medium', Leo: 'High', Virgo: 'Low', Libra: 'High', Scorpio: 'Low', Sagittarius: 'High', Capricorn: 'Medium', Aquarius: 'High', Pisces: 'Medium' },
  Pisces: { Aries: 'Medium', Taurus: 'High', Gemini: 'Low', Cancer: 'High', Leo: 'Medium', Virgo: 'High', Libra: 'Medium', Scorpio: 'High', Sagittarius: 'Medium', Capricorn: 'Medium', Aquarius: 'Medium', Pisces: 'High' },
};

const compatibilityText = {
  High: "An excellent match! You share a deep connection and understanding. Your energies complement each other, creating a dynamic and harmonious relationship. There's potential for a long-lasting and exciting bond.",
  Medium:
    'A good potential match. You have enough in common to get along well, but also enough differences to keep things interesting. With a little effort and understanding, this relationship can blossom into something beautiful.',
  Low: 'This pairing can be challenging. Your personalities and values may clash, leading to friction. However, differences can also lead to growth. This relationship will require a lot of patience, communication, and compromise to succeed.',
};

export function getCompatibility(sign1: ZodiacSignName, sign2: ZodiacSignName) {
  const level = compatibilityMatrix[sign1][sign2];
  return {
    level,
    text: compatibilityText[level],
  };
}
