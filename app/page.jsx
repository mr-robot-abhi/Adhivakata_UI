"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, CheckCircle, Shield, Scale, BookOpen, Gavel, Users, ChevronRight, Star } from "lucide-react"

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    testimonials: false,
    pricing: false,
  })

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 })
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })
  const isPricingInView = useInView(pricingRef, { once: false, amount: 0.3 })

  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const testimonialsControls = useAnimation()
  const pricingControls = useAnimation()

  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isHeroInView) {
      heroControls.start("visible")
      setIsVisible((prev) => ({ ...prev, hero: true }))
    }
    if (isFeaturesInView) {
      featuresControls.start("visible")
      setIsVisible((prev) => ({ ...prev, features: true }))
    }
    if (isTestimonialsInView) {
      testimonialsControls.start("visible")
      setIsVisible((prev) => ({ ...prev, testimonials: true }))
    }
    if (isPricingInView) {
      pricingControls.start("visible")
      setIsVisible((prev) => ({ ...prev, pricing: true }))
    }
  }, [
    isHeroInView,
    isFeaturesInView,
    isTestimonialsInView,
    isPricingInView,
    heroControls,
    featuresControls,
    testimonialsControls,
    pricingControls,
  ])

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  // Feature card animation variants
  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  // Testimonial animation variants
  const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: custom * 0.15,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  }

  // Pricing card animation variants
  const pricingCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  // Floating animation for hero image
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <span className="text-xl font-bold">Adhivakta</span>
        </motion.div>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80 z-10"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            />
            <motion.div
              animate={{ scale: 1.05 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Image
                src="/images/law-library.jpg"
                alt="Law library"
                fill
                className="object-cover object-center"
                priority
                style={{
                  transform: `translateY(${scrollY * 0.2}px)`,
                }}
              />
            </motion.div>
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                    initial="hidden"
                    animate={heroControls}
                    variants={textVariants}
                    custom={0}
                  >
                    <div className="overflow-hidden">
                      <motion.span
                        className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-primary pr-1"
                        animate={{
                          width: ["0%", "100%"],
                          borderRight: ["4px solid transparent", "4px solid var(--primary)"],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          delay: 0.3,
                        }}
                      >
                        Modern Legal Case
                      </motion.span>
                    </div>
                    <div className="overflow-hidden mt-2">
                      <motion.span
                        className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-primary pr-1"
                        animate={{
                          width: ["0%", "100%"],
                          borderRight: ["4px solid transparent", "4px solid var(--primary)"],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          delay: 2.5,
                        }}
                      >
                        Management for
                      </motion.span>
                    </div>
                    <div className="overflow-hidden mt-2">
                      <motion.span
                        className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-primary pr-1"
                        animate={{
                          width: ["0%", "100%"],
                          borderRight: ["4px solid transparent", "4px solid var(--primary)"],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          delay: 4.7,
                        }}
                      >
                        the Digital Age
                      </motion.span>
                    </div>
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    initial="hidden"
                    animate={heroControls}
                    variants={textVariants}
                    custom={1}
                  >
                    Streamline your legal practice with our comprehensive case management solution. Manage cases,
                    documents, and client communications all in one place.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial="hidden"
                  animate={heroControls}
                  variants={textVariants}
                  custom={2}
                >
                  <Link href="/auth/register">
                    <Button size="lg" className="px-8 group">
                      Get Started
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.span>
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <motion.div
                  animate={floatingAnimation}
                  className="relative h-[350px] w-[350px] overflow-hidden rounded-lg shadow-xl"
                >
                  <Image src="/images/gavel.jpg" alt="Scales of justice" fill className="object-cover" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Animated scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronRight className="h-8 w-8 rotate-90 text-primary" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={featuresControls}
              variants={textVariants}
              custom={0}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Powerful Features for Legal Professionals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to manage your legal practice efficiently and effectively.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 place-items-center">
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
                  initial="hidden"
                  animate={featuresControls}
                  variants={featureCardVariants}
                  custom={index}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background shadow-sm transition-all duration-300"
                >
                  <motion.div
                    className="mb-2"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" ref={testimonialsRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={testimonialsControls}
              variants={textVariants}
              custom={0}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Legal Professionals</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  See what our users have to say about Adhivakta
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Adhivakta has transformed how I manage my legal practice. The case tracking and document management features save me hours every week.",
                  author: "Rajesh Sharma",
                  title: "Senior Advocate, Bangalore High Court",
                  rating: 5,
                },
                {
                  quote:
                    "The client portal is a game-changer. My clients appreciate the transparency, and it's reduced the number of status update calls significantly.",
                  author: "Priya Patel",
                  title: "Family Law Attorney",
                  rating: 5,
                },
                {
                  quote:
                    "As a small firm, we needed an affordable solution that could grow with us. Adhivakta has exceeded our expectations in every way.",
                  author: "Vikram Singh",
                  title: "Managing Partner, Singh & Associates",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={testimonialsControls}
                  variants={testimonialVariants}
                  custom={index}
                  whileHover={{ y: -5 }}
                  className="flex flex-col space-y-4 rounded-lg border p-6 bg-background shadow-sm"
                >
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
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
        <section id="pricing" ref={pricingRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={pricingControls}
              variants={textVariants}
              custom={0}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Choose the plan that's right for your practice
                </p>
              </div>
            </motion.div>
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
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={pricingControls}
                  variants={pricingCardVariants}
                  custom={index}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className={`flex flex-col rounded-lg border p-6 ${
                    plan.popular ? "border-primary shadow-lg scale-105 bg-background relative" : "bg-background"
                  }`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full"
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      Most Popular
                    </motion.div>
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
                      <motion.li
                        key={i}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-auto ${plan.popular ? "" : "variant-outline"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
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
            © 2025 Adhivakta Legal Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
