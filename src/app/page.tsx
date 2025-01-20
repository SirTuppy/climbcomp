import Link from 'next/link';
import { Button } from '../components/ui/button';
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center">
      <div className="container px-4 py-16 mx-auto text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          ClimbComp
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          A modern platform for managing climbing competitions. 
          Simple, flexible, and powerful.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" prefetch={false}>
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/SirTuppy/climbcomp" target="_blank" prefetch={false}>
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}