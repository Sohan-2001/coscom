'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ZODIAC_SIGNS, PLANETS } from '@/data/zodiac';
import { getZodiacIcon, getPlanetIcon } from '@/components/AstrologyIcons';
import type { Planet } from '@/data/zodiac';
import { useUser } from '@/firebase';
import { Lock } from 'lucide-react';

interface PlanetPosition {
  planet: Planet;
  angle: number;
}

export function BirthChart() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [showChart, setShowChart] = useState(false);
  const [planetPositions, setPlanetPositions] = useState<PlanetPosition[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (showChart) {
      // Generate random positions only on client to avoid hydration mismatch
      const positions = PLANETS.map((planet) => ({
        planet,
        angle: Math.random() * 360,
      }));
      setPlanetPositions(positions);
    }
  }, [showChart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setShowChart(true);
    }
  };

  const chartSize = 400; // in pixels
  const center = chartSize / 2;
  const zodiacRadius = chartSize / 2 - 20;
  const planetRadius = chartSize / 2 - 70;

  return (
    <section id="birth-chart" className="py-16 sm:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold text-white sm:text-4xl">
            Your Birth Chart
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            A snapshot of the heavens at your moment of birth. Enter your birth
            date for a simplified overview.
          </p>
        </div>

        <Card className="mt-10 bg-card/50">
          <CardContent className="p-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-end gap-4"
            >
              <div className="w-full sm:w-auto flex-grow space-y-2">
                <label htmlFor="birth-date-chart" className="text-sm font-medium">
                  Birth Date
                </label>
                <Input
                  id="birth-date-chart"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  disabled={!user}
                />
              </div>
              <Button type="submit" disabled={!user}>
                {!user && <Lock className="mr-2 h-4 w-4" />}
                {user ? 'Generate Chart' : 'Login to Generate'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {showChart && user && (
          <div className="mt-8 flex justify-center animate-fade-in">
            <div
              className="relative"
              style={{ width: chartSize, height: chartSize }}
            >
              <div className="absolute inset-0 border-2 border-primary/50 rounded-full" />
              <div className="absolute inset-[40px] border border-primary/30 rounded-full" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/30 -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 h-full w-[1px] bg-primary/30 -translate-x-1/2" />


              {ZODIAC_SIGNS.map((sign, index) => {
                const angle = (index / 12) * 360 - 90; // -90 to start Aries at the left
                const x =
                  center + zodiacRadius * Math.cos((angle * Math.PI) / 180);
                const y =
                  center + zodiacRadius * Math.sin((angle * Math.PI) / 180);
                const Icon = getZodiacIcon(sign.name);
                return (
                  <div
                    key={sign.name}
                    className="absolute"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                );
              })}

              {planetPositions.map(({ planet, angle }) => {
                const adjustedAngle = angle - 90;
                // Vary radius for visual interest
                const radius = planetRadius - (planet.name.length % 5) * 15;
                const x =
                  center + radius * Math.cos((adjustedAngle * Math.PI) / 180);
                const y =
                  center + radius * Math.sin((adjustedAngle * Math.PI) / 180);
                const Icon = getPlanetIcon(planet.name);
                return (
                  <div
                    key={planet.name}
                    className="absolute transition-all duration-1000"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
