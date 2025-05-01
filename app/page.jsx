"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Shield, Scale, BookOpen, Gavel, Users } from "lucide-react"

// Add custom animation styles
const customStyles = `
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

.animate-typing {
  animation: typing 3.5s steps(40, end);
  display: inline-block;
  width: 100%;
}
`

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    testimonials: false,
  })

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.section]: true,
          }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (testimonialsRef.current) observer.observe(testimonialsRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <style jsx global>
        {customStyles}
      </style>
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <span className="text-xl font-bold">Adhivakta</span>
        </div>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:underline">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} data-section="hero" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80 z-10" />
            <Image
              src="/images/law-library.jpg"
              alt="Law library"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.hero ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2"
            >
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl relative">
                    <span className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-primary pr-1">
                      Modern Legal Case Management for the Digital Age
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your legal practice with our comprehensive case management solution. Manage cases,
                    documents, and client communications all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button size="lg" className="px-8 group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isVisible.hero ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative h-[350px] w-[350px] overflow-hidden rounded-lg shadow-xl"
                >
                  <Image
                    src="/images/gavel.jpg"
                    alt="Scales of justice"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={featuresRef}
          data-section="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Powerful Features for Legal Professionals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to manage your legal practice efficiently and effectively.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Case Management",
                  description: "Organize and track all your cases in one place with customizable fields and statuses.",
                  icon: <Scale className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Document Management",
                  description: "Store, organize, and quickly retrieve all case-related documents securely.",
                  icon: <BookOpen className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Client Portal",
                  description: "Provide clients with secure access to their case information and documents.",
                  icon: <Users className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Calendar & Deadlines",
                  description: "Never miss important dates with integrated calendar and deadline tracking.",
                  icon: <Gavel className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Time & Billing",
                  description: "Track billable hours and generate invoices directly from the platform.",
                  icon: <Shield className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Reporting & Analytics",
                  description: "Gain insights into your practice with customizable reports and analytics.",
                  icon: <CheckCircle className="h-10 w-10 text-primary" />,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={testimonialsRef}
          data-section="testimonials"
          className="w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Legal Professionals</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  See what our users have to say about Adhivakta
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Adhivakta has transformed how I manage my legal practice. The case tracking and document management features save me hours every week.",
                  author: "Rajesh Sharma",
                  title: "Senior Advocate, Bangalore High Court",
                },
                {
                  quote:
                    "The client portal is a game-changer. My clients appreciate the transparency, and it's reduced the number of status update calls significantly.",
                  author: "Priya Patel",
                  title: "Family Law Attorney",
                },
                {
                  quote:
                    "As a small firm, we needed an affordable solution that could grow with us. Adhivakta has exceeded our expectations in every way.",
                  author: "Vikram Singh",
                  title: "Managing Partner, Singh & Associates",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible.testimonials ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col space-y-4 rounded-lg border p-6 bg-background shadow-sm"
                >
                  <div className="relative">
                    <span className="absolute -left-2 -top-2 text-4xl text-primary opacity-30">"</span>
                    <p className="relative z-10 italic text-muted-foreground">{testimonial.quote}</p>
                    <span className="absolute -bottom-6 -right-2 text-4xl text-primary opacity-30">"</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Choose the plan that's right for your practice
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {[
                {
                  name: "Solo Practitioner",
                  price: "₹2,999",
                  description: "Perfect for individual lawyers",
                  features: [
                    "Up to 50 active cases",
                    "5GB document storage",
                    "Calendar integration",
                    "Basic reporting",
                    "Email support",
                  ],
                  popular: false,
                },
                {
                  name: "Small Firm",
                  price: "₹7,999",
                  description: "Ideal for small law firms",
                  features: [
                    "Up to 200 active cases",
                    "25GB document storage",
                    "Calendar & email integration",
                    "Advanced reporting",
                    "Priority support",
                    "Client portal",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For larger legal practices",
                  features: [
                    "Unlimited cases",
                    "Unlimited storage",
                    "Full API access",
                    "Custom integrations",
                    "Dedicated account manager",
                    "On-premise deployment option",
                  ],
                  popular: false,
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-lg border p-6 ${
                    plan.popular ? "border-primary shadow-lg scale-105 bg-background relative" : "bg-background"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground"> / month</span>}
                  </div>
                  <ul className="mb-6 space-y-2 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-auto ${plan.popular ? "" : "variant-outline"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Transform Your Legal Practice?
                </h2>
                <p className="max-w-[600px] md:text-xl">
                  Join thousands of legal professionals who trust Adhivakta to manage their cases, documents, and client
                  relationships.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="px-8">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20"
                  >
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              A
            </div>
            <span className="text-lg font-semibold">Adhivakta</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left md:ml-auto">
            © 2023 Adhivakta Legal Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
