import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChefHat,
} from "lucide-react"

const resources = [
  {
    icon: BookOpen,
    title: "Getting Started Guide",
    description: "Everything you need to know to start your home kitchen",
    link: "/how-it-works",
    linkText: "Read Guide",
  },
  {
    icon: FileText,
    title: "Food Safety Guidelines",
    description: "Toronto Public Health requirements for home food businesses",
    link: "https://www.toronto.ca/community-people/health-wellness-care/health-programs-advice/food-safety/",
    linkText: "Learn More",
    external: true,
  },
  {
    icon: Video,
    title: "Chef Success Stories",
    description: "Watch how other home chefs built their business",
    link: "/success-stories",
    linkText: "Watch Stories",
  },
  {
    icon: Download,
    title: "Menu Template",
    description: "Download our free menu planning template",
    link: "#",
    linkText: "Download",
  },
]

export default function ResourcesPage() {
  return (
    <MainLayout>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                Chef Resources
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Resources for <span className="text-gradient">Home Chefs</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to start and grow your home kitchen business
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <Card key={resource.title}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {resource.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {resource.external ? (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="gap-2">
                            {resource.linkText}
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <Link href={resource.link}>
                          <Button variant="outline">{resource.linkText}</Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <h2 className="text-2xl font-bold mb-4">Ready to start cooking?</h2>
              <Link href="/business/signup">
                <Button size="lg" className="gap-2">
                  <ChefHat className="w-5 h-5" />
                  Become a Home Chef
                </Button>
              </Link>
            </div>
          </div>
        </section>
    </MainLayout>
  )
}
