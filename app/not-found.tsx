import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { businessInfo } from "@/lib/data/business-info"

export default function NotFound() {
  return (
    <SectionWrapper className="flex min-h-[70vh] items-center bg-background">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Display */}
          <div className="mb-8">
            <span className="text-8xl font-bold text-primary/20 md:text-9xl">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            may have been moved or doesn&apos;t exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary/20"
            >
              <ArrowLeft className="h-4 w-4" />
              View Services
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 rounded-xl bg-secondary/10 p-6">
            <p className="mb-2 text-sm text-muted-foreground">
              Need help? Contact us:
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="font-medium text-primary hover:underline"
              >
                {businessInfo.phone}
              </a>
              <span className="hidden text-muted-foreground sm:inline">|</span>
              <a
                href={`mailto:${businessInfo.email}`}
                className="font-medium text-primary hover:underline"
              >
                {businessInfo.email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
