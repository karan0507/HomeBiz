import { MainLayout } from "@/components/layout/main-layout"

export default function PrivacyPage() {
  return (
    <MainLayout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: January 2024
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when
              you create an account, place an order, or contact us for support.
              This may include your name, email address, phone number, and
              delivery address.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, send you related
              information, and communicate with you about products, services,
              and events.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We share your information with home chefs to fulfill your orders.
              We do not sell your personal information to third parties. We may
              share information with service providers who assist in our
              operations.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Data Security
            </h2>
            <p className="text-muted-foreground mb-4">
              We take reasonable measures to help protect your personal
              information from loss, theft, misuse, unauthorized access,
              disclosure, alteration, and destruction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Your Rights
            </h2>
            <p className="text-muted-foreground mb-4">
              You may access, update, or delete your account information at any
              time by logging into your account or contacting us. You may also
              opt out of receiving promotional communications.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Contact Us
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy, please contact
              us at privacy@homebiz.ca.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
