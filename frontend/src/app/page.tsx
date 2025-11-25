import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 h-16 flex items-center border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sprout className="h-6 w-6" />
          <span>Mselele Farm</span>
        </div>
        <div className="ml-auto flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-muted/20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Mokua Family Farm
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Smart Farm Management for Mselele, Joska
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Access Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} Mselele Farm Management System. Built by Michael Ogutu.
      </footer>
    </div>
  );
}
