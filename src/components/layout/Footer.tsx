import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex items-center justify-center text-center text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        <p>&copy; {new Date().getFullYear()} Cosmic Insights. All rights reserved.</p>
      </div>
    </footer>
  );
}
