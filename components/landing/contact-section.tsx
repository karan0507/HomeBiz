"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Phone, Send, Loader2, CheckCircle2, MapPin } from "lucide-react";


export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Premium Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Typography & Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Get in Touch
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Let's start a <br />
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">conversation.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Whether you're a curious customer or a passionate home chef ready to launch your culinary dream, we're here to help you every step of the way.
              </p>
            </div>

            {/* Contact Detail Blocks */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</p>
                  <a href="mailto:hello@homebiz.ca" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">hello@homebiz.ca</a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Location</p>
                  <p className="text-sm font-semibold text-foreground">Toronto, ON, Canada</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Premium Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative card backdrop */}
            <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-[2rem] opacity-10 hidden sm:block pointer-events-none" />
            
            <Card className="relative bg-white border-0 shadow-2xl rounded-[2rem] overflow-hidden backdrop-blur-sm sm:p-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent" />
              
              <CardContent className="p-8 sm:p-10">
                <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
                <p className="text-sm text-muted-foreground mb-8">We typically respond within 24 hours.</p>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Alert className="bg-green-50 text-green-800 border-green-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Message Sent!</h4>
                        <AlertDescription className="text-green-700/80">
                          Thank you for reaching out. Our team will get back to you within 24 hours.
                        </AlertDescription>
                      </div>
                    </Alert>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-sm font-semibold text-foreground/80">Full Name</Label>
                        <Input 
                          id="contact-name" 
                          required 
                          placeholder="John Doe"
                          className="h-12 bg-muted/40 border-muted-foreground/20 focus-visible:ring-primary rounded-xl px-4 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-sm font-semibold text-foreground/80">Email Address</Label>
                        <Input 
                          id="contact-email" 
                          type="email" 
                          required 
                          placeholder="john@example.com"
                          className="h-12 bg-muted/40 border-muted-foreground/20 focus-visible:ring-primary rounded-xl px-4 transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject" className="text-sm font-semibold text-foreground/80">Subject</Label>
                      <Input 
                        id="contact-subject" 
                        required 
                        placeholder="How can we help?"
                        className="h-12 bg-muted/40 border-muted-foreground/20 focus-visible:ring-primary rounded-xl px-4 transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-sm font-semibold text-foreground/80">Message</Label>
                      <textarea
                        id="contact-message"
                        required
                        placeholder="Tell us about your inquiry..."
                        rows={5}
                        className="w-full px-4 py-3 bg-muted/40 border border-muted-foreground/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
