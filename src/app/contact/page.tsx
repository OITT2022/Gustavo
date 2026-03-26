import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about artwork inquiries, commissions, or collaborations.",
};

interface Props {
  searchParams: Promise<{ artwork?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const { artwork } = await searchParams;

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Contact"
          subtitle="Inquiries, commissions, and collaborations"
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="heading-3">Get in Touch</h2>
                <p className="mt-3 body-text">
                  Whether you&apos;re interested in acquiring a piece,
                  commissioning a work, or simply want to say hello — I&apos;d
                  love to hear from you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gallery-400" />
                  <div>
                    <p className="text-sm font-medium text-gallery-900">
                      Email
                    </p>
                    <p className="text-sm text-gallery-600">
                      contact@gustavobarvalenzuela.art
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gallery-400" />
                  <div>
                    <p className="text-sm font-medium text-gallery-900">
                      Phone
                    </p>
                    <p className="text-sm text-gallery-600">
                      By appointment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gallery-400" />
                  <div>
                    <p className="text-sm font-medium text-gallery-900">
                      Studio
                    </p>
                    <p className="text-sm text-gallery-600">
                      Available upon request
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <ContactForm artworkReference={artwork} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
