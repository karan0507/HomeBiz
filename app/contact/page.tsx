"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";

const contactCards = [
  {
    icon: Mail,
    label: "Email us",
    value: "support@homebiz.ca",
    sub: "We reply within 24 hours",
    color: "from-orange-500 to-amber-500",
    bg: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
    border: "border-orange-200 dark:border-orange-800/50",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "416-555-HOME",
    sub: "Mon–Fri, 9 am–6 pm EST",
    color: "from-rose-500 to-pink-500",
    bg: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    border: "border-rose-200 dark:border-rose-800/50",
  },
  {
    icon: MapPin,
    label: "Find us",
    value: "Toronto, Ontario",
    sub: "Serving the Greater Toronto Area",
    color: "from-purple-500 to-violet-500",
    bg: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
    border: "border-purple-200 dark:border-purple-800/50",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "< 24 hours",
    sub: "Average first response",
    color: "from-teal-500 to-cyan-500",
    bg: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
    border: "border-teal-200 dark:border-teal-800/50",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <MainLayout>
      {/* ─── Hero section ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl">
          {/* ─── Two-column hero ────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — illustration */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center lg:items-start"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary mb-5">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                We&apos;d love to{" "}
                <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
                  hear from you
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Have questions about HomeBiz, a home kitchen, or an order?
                Our friendly team is always ready to help.
              </p>

              {/* Illustration */}
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                  <Image
                    src="/contact-illustration.png"
                    alt="Contact illustration — support chef with food icons"
                    width={600}
                    height={480}
                    className="w-full h-auto"
                    priority
                  />
                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2 border border-border"
                  >
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-xs font-semibold">Fast Support</p>
                      <p className="text-xs text-muted-foreground">Under 24 hrs</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0, type: "spring" }}
                    className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2 border border-border"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold">Always here for you</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right — contact form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-12 gap-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Message sent!</h2>
                    <p className="text-muted-foreground max-w-xs">
                      Thanks for reaching out. We&apos;ll get back to you
                      within 24–48 hours.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 gap-2"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Send a Message</h2>
                        <p className="text-xs text-muted-foreground">
                          We&apos;ll reply as soon as possible
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Jane Doe"
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="jane@example.com"
                            required
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                          id="message"
                          rows={5}
                          className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition"
                          placeholder="Tell us what's on your mind..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-orange-600 hover:opacity-90 transition-opacity text-white"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* ─── Contact info cards ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {contactCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} p-5 flex items-start gap-4`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0 shadow-md`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">
                    {card.label}
                  </p>
                  <p className="font-semibold text-sm">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {card.sub}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
