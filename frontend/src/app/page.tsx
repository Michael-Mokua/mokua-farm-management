import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  ArrowRight,
  Briefcase,
  BookOpen,
  Hammer,
  Code,
  Instagram,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const familyMembers = [
    {
      name: "Patrick Mokua",
      role: "Father & Entrepreneur",
      Icon: Briefcase,
      iconColor: "text-amber-600",
      description: "Driving business development, financial strategy, and market opportunities. The visionary behind our value-added ventures.",
      skills: ["Business Strategy", "Finance", "Marketing"],
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
    },
    {
      name: "Carolyne Nyamoita",
      role: "Mother & Educator",
      Icon: BookOpen,
      iconColor: "text-blue-600",
      description: "Leading educational programs, record-keeping, and community outreach. The heart of our knowledge sharing.",
      skills: ["Education", "Documentation", "Outreach"],
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    },
    {
      name: "Fadhili Obiria",
      role: "Brother & Architect",
      Icon: Hammer,
      iconColor: "text-purple-600",
      description: "Designing sustainable infrastructure and efficient farm layouts. Building the future of our physical space.",
      skills: ["Architecture", "Sustainability", "Design"],
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Sprout className="h-6 w-6" />
            <span>Mselele Farm</span>
          </div>
          <div className="ml-auto flex gap-4">
            <Link href="/shop">
              <Button variant="outline">Shop</Button>
            </Link>
            <Link href="/login">
              <Button>Family Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 xl:py-56 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                    🌾 Mselele, Joska
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Mokua Family Farm
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Where <span className="font-semibold text-green-600">tradition</span> meets <span className="font-semibold text-emerald-600">technology</span>.
                  Cultivating excellence in sustainable agriculture.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/shop">
                  <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all transform hover:scale-105 text-base font-semibold">
                    🛒 Visit Our Shop <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-all transform hover:scale-105 text-base font-semibold">
                    👨‍👩‍👦‍👦 Family Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Family Profiles Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-background dark:via-green-950/10 dark:to-background">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-block rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-2 text-sm font-semibold text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                ✨ Our Team
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Meet the Family
              </h2>
              <p className="max-w-[700px] text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                The dedicated minds behind Mselele Farm, each bringing unique expertise to our sustainable future.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {/* Standard Family Cards */}
                {familyMembers.map((member, index) => (
                  <Card key={index} className={`border-2 transition-all hover:shadow-xl hover:-translate-y-2 duration-300 ${member.color} w-full`}>
                    <CardHeader>
                      <div className="mb-2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                        <member.Icon className={`h-6 w-6 ${member.iconColor}`} />
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="font-medium text-foreground/80">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {member.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-white/50 dark:bg-black/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Michael's Special "Glazed" Card */}
                <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/20 rounded-full blur-3xl"></div>

                  <CardHeader className="relative z-10">
                    <div className="mb-2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Michael Ogutu</CardTitle>
                    <CardDescription className="font-medium text-white/90">Tech Developer & Innovator</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-sm text-white/90 mb-4 font-medium leading-relaxed">
                      The digital architect engineering our smart solutions. From AI automation to this very platform, bridging agriculture with cutting-edge technology.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {["Full Stack", "AI/ML", "IoT", "Cloud"].map((skill) => (
                        <Badge key={skill} className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-auto pt-2 border-t border-white/20">
                      <a
                        href="https://instagram.com/whoismichaia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                        title="Follow on Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://wa.me/254110254359"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors backdrop-blur-sm font-medium text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="container px-4 md:px-6 mt-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-card border">
                  <p className="font-semibold text-lg mb-2">Patrick Mokua</p>
                  <p className="text-sm text-muted-foreground mb-2">Father & Entrepreneur</p>
                  <a href="tel:+254726366624" className="text-green-600 hover:underline flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    0726 366 624
                  </a>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <p className="font-semibold text-lg mb-2">Carolyne Nyamoita</p>
                  <p className="text-sm text-muted-foreground mb-2">Mother & Educator</p>
                  <a href="tel:+254728369948" className="text-green-600 hover:underline flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    0728 369 948
                  </a>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <p className="font-semibold text-lg mb-2">Fadhili Obiria</p>
                  <p className="text-sm text-muted-foreground mb-2">Brother & Architect</p>
                  <a href="tel:+254795535002" className="text-green-600 hover:underline flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    0795 535 002
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-muted/20">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Mselele Farm Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Built with ❤️ by</span>
            <a
              href="https://instagram.com/whoismichaia"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline flex items-center gap-1"
            >
              Michael Ogutu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
