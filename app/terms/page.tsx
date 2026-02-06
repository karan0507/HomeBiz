import { MainLayout } from "@/components/layout/main-layout"

export default function TermsPage() {
  return (
    <MainLayout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: January 2024
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using HomeBiz, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground mb-4">
              HomeBiz is a platform that connects customers with home chefs who
              prepare food from their home kitchens. We facilitate the
              connection but are not responsible for the food preparation
              itself.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. User Accounts
            </h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must provide accurate and complete information when
              creating an account.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Home Chef Requirements
            </h2>
            <p className="text-muted-foreground mb-4">
              All home chefs must possess a valid Food Handler Certificate
              issued by Toronto Public Health. Chefs are responsible for
              maintaining food safety standards and complying with all
              applicable regulations.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Orders and Payments
            </h2>
            <p className="text-muted-foreground mb-4">
              All payments are made directly between customers and home chefs
              via cash or e-Transfer at the time of pickup. HomeBiz does not
              process payments and is not liable for payment disputes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Cancellation Policy
            </h2>
            <p className="text-muted-foreground mb-4">
              Orders may be cancelled up to 2 hours before the scheduled pickup
              time. Cancellations made less than 2 hours before pickup are
              subject to the individual chef&apos;s cancellation policy.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-4">
              HomeBiz is not liable for any damages arising from the use of our
              platform or from any food prepared by home chefs. We provide the
              platform &quot;as is&quot; without warranties of any kind.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms, please contact us at
              legal@homebiz.ca.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
