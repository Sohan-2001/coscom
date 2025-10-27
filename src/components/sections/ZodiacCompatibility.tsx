
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZODIAC_SIGNS, getCompatibility, ZodiacSignName } from '@/data/zodiac';
import { getZodiacIcon } from '@/components/AstrologyIcons';
import { Heart, Lock } from 'lucide-react';
import { useUser } from '@/firebase';

export function ZodiacCompatibility() {
  const [sign1, setSign1] = useState<ZodiacSignName | null>(null);
  const [sign2, setSign2] = useState<ZodiacSignName | null>(null);
  const [compatibility, setCompatibility] = useState<{
    level: string;
    text: string;
  } | null>(null);
  const { user } = useUser();

  const checkCompatibility = () => {
    if (sign1 && sign2) {
      setCompatibility(getCompatibility(sign1, sign2));
    }
  };

  const Icon1 = sign1 ? getZodiacIcon(sign1) : null;
  const Icon2 = sign2 ? getZodiacIcon(sign2) : null;

  return (
    <section id="compatibility" className="py-16 sm:py-24 bg-secondary/20">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold text-white sm:text-4xl">
            Zodiac Compatibility
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Curious about your connection with someone? Select two zodiac signs
            to reveal your cosmic synergy.
          </p>
        </div>

        <Card className="mt-10 bg-card/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Sign</label>
                <Select
                  onValueChange={(value) => setSign1(value as ZodiacSignName)}
                  disabled={!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZODIAC_SIGNS.map((sign) => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Their Sign</label>
                <Select
                  onValueChange={(value) => setSign2(value as ZodiacSignName)}
                  disabled={!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZODIAC_SIGNS.map((sign) => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={checkCompatibility}
                disabled={!sign1 || !sign2 || !user}
                className="w-full mt-4 md:mt-0"
              >
                {!user && <Lock className="mr-2 h-4 w-4" />}
                {user ? 'Check Compatibility' : 'Login to Check'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {compatibility && sign1 && sign2 && (
          <Card className="mt-8 animate-fade-in bg-card/50">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-4">
                {Icon1 && <Icon1 className="w-16 h-16 text-primary" />}
                <Heart className="w-8 h-8 text-red-400" />
                {Icon2 && <Icon2 className="w-16 h-16 text-primary" />}
              </div>
              <CardTitle className="mt-4">
                {sign1} & {sign2}
              </CardTitle>
              <CardDescription>
                Compatibility:{' '}
                <span className="font-bold text-primary">
                  {compatibility.level}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center font-body text-base text-gray-300">
                {compatibility.text}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
