"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, CheckCircle, Shield, Scale, BookOpen, Gavel, Users, ChevronDown, Star } from "lucide-react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  // Refs and controls for scroll animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: false, amount: 0.4 })
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })
  const isPricingInView = useInView(pricingRef, { once: false, amount: 0.3 })

  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const testimonialsControls = useAnimation()
  const pricingControls = useAnimation()

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Trigger animations on scroll
  useEffect(() => {
    if (isHeroInView) heroControls.start("visible")
    if (isFeaturesInView) featuresControls.start("visible")
    if (isTestimonialsInView) testimonialsControls.start("visible")
    if (isPricingInView) pricingControls.start("visible")
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

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  }

  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  }

  const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: custom * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  }

  const pricingCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.7, type: "spring", stiffness: 120 },
    }),
  }

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-white/95 backdrop-blur-sm px-4 md:px-8 shadow-sm">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Image
            src="/adhi_logo_1.png"
            alt="Adhivakta Logo"
            width={48}
            height={48}
            className="object-contain border-2 border-gray-300 shadow-lg"
            style={{objectPosition:'center', width:'48px', height:'48px'}}
          />
        </motion.div>
        <nav className="ml-auto flex items-center gap-6">
          {[
            { href: "#features", label: "Features" },
            { href: "#testimonials", label: "Testimonials" },
            { href: "#pricing", label: "Pricing" },
          ].map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={link.href} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-black">
                Login
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link href="/auth/register">
              <Button className="bg-black hover:bg-gray-800 text-white px-6">Get Started</Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative w-full pt-24 pb-32 overflow-hidden bg-gray-50">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bg_5.png"
              alt="Legal background"
              fill
              className="object-cover object-center filter grayscale"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent z-10" />
          </div>

          <div className="container relative z-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-tight"
                  initial="hidden"
                  animate={heroControls}
                  variants={textVariants}
                  custom={0}
                >
                  Elevate Your <br />
                  <span className="text-gray-300">Legal Practice</span> <br />
                  with Precision
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-gray-300 max-w-xl"
                  initial="hidden"
                  animate={heroControls}
                  variants={textVariants}
                  custom={1}
                >
                  Adhivakta offers a sophisticated platform to manage cases, streamline documents, and enhance client
                  communication with unmatched efficiency.
                </motion.p>
                <motion.div
                  className="flex gap-4"
                  initial="hidden"
                  animate={heroControls}
                  variants={textVariants}
                  custom={2}
                >
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 group">
                      Start Free Trial
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="ml-2"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 border-gray-300 text-white hover:bg-gray-800/50"
                    >
                      Discover More
                    </Button>
                  </Link>
                </motion.div>
                <motion.p
                  className="text-sm text-gray-400"
                  initial="hidden"
                  animate={heroControls}
                  variants={textVariants}
                  custom={3}
                >
                  No credit card required. 30-day free trial for all plans.
                </motion.p>
              </div>
              <motion.div
                className="relative h-[400px] lg:h-[500px] w-full max-w-md mx-auto"
                animate={floatingAnimation}
              >
                <Image
                  src="/images/bg_2.jpg"
                  alt="Justice symbol"
                  fill
                  className="object-cover rounded-xl shadow-2xl filter grayscale"
                  loading="eager"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent rounded-xl"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="w-full py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="hidden"
              animate={featuresControls}
              variants={textVariants}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Comprehensive Tools for Legal Excellence
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Adhivakta empowers legal professionals with intuitive features designed to optimize every aspect of your
                practice.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  title: "Case Management",
                  description:
                    "Effortlessly organize and track cases with customizable workflows and real-time updates.",
                  icon: <Scale className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_4.png",
                },
                {
                  title: "Document Management",
                  description:
                    "Securely store, categorize, and access all case-related documents in a centralized hub.",
                  icon: <BookOpen className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_5.png",
                },
                {
                  title: "Client Portal",
                  description:
                    "Provide clients with a secure, user-friendly portal for case updates and document sharing.",
                  icon: <Users className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_6.png",
                },
                {
                  title: "Calendar & Deadlines",
                  description: "Stay ahead with integrated calendars and automated deadline reminders.",
                  icon: <Gavel className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_4.png",
                },
                {
                  title: "Time & Billing",
                  description: "Track billable hours and generate professional invoices with ease.",
                  icon: <Shield className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_5.png",
                },
                {
                  title: "Reporting & Analytics",
                  description:
                    "Unlock insights with detailed reports and performance analytics tailored to your practice.",
                  icon: <CheckCircle className="h-8 w-8 text-gray-900" />,
                  image: "/images/bg_6.png",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={featuresControls}
                  variants={featureCardVariants}
                  custom={index}
                  whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
                >
                  <div className="relative h-48">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  </div>
                  <div className="p-6 text-center space-y-3">
                    <motion.div whileHover={{ rotate: 8, transition: { duration: 0.3 } }}>{feature.icon}</motion.div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-700 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" ref={testimonialsRef} className="w-full py-24 bg-gray-100">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="hidden"
              animate={testimonialsControls}
              variants={textVariants}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Voices of Trust</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Discover how Adhivakta has transformed the practices of legal professionals across the globe.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  quote:
                    "Adhivakta has revolutionized my workflow, saving hours with its intuitive case and document management tools.",
                  author: "Rajesh Sharma",
                  title: "Senior Advocate, Bangalore High Court",
                  rating: 5,
                  image: "/images/bg_1.jpg",
                },
                {
                  quote:
                    "The client portal enhances transparency, significantly reducing client inquiries and boosting satisfaction.",
                  author: "Priya Patel",
                  title: "Family Law Attorney",
                  rating: 5,
                  image: "/images/bg_2.jpg",
                },
                {
                  quote: "As a growing firm, Adhivakta's scalable solutions have been a perfect fit for our needs.",
                  author: "Vikram Singh",
                  title: "Managing Partner, Singh & Associates",
                  rating: 4,
                  image: "/images/bg_3.jpg",
                },
                {
                  quote:
                    "The analytics tools provide invaluable insights, helping us optimize our practice efficiently.",
                  author: "Anita Desai",
                  title: "Corporate Lawyer",
                  rating: 5,
                  image: "/images/bg_1.jpg",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={testimonialsControls}
                  variants={testimonialVariants}
                  custom={index}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                  className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/30 to-transparent opacity-50" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-gray-900 text-gray-900" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-center">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          fill
                          className="object-cover filter grayscale"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" ref={pricingRef} className="w-full py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="hidden"
              animate={pricingControls}
              variants={textVariants}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Tailored Pricing for Every Practice
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Select a plan that aligns with your firm's size and ambitions, with flexible options to scale as you
                grow.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  name: "Solo Practitioner",
                  price: "₹2,999",
                  description: "Designed for independent lawyers seeking efficiency and organization.",
                  features: [
                    "Manage up to 50 active cases",
                    "5GB secure document storage",
                    "Calendar integration with reminders",
                    "Basic reporting and insights",
                    "Email support with 48-hour response",
                  ],
                  popular: false,
                },
                {
                  name: "Small Firm",
                  price: "₹7,999",
                  description: "Perfect for small teams aiming to streamline operations and client engagement.",
                  features: [
                    "Up to 200 active cases",
                    "25GB secure document storage",
                    "Advanced calendar and email integration",
                    "Comprehensive reporting tools",
                    "Priority support with 24-hour response",
                    "Secure client portal access",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "Tailored solutions for large firms with complex needs and high case volumes.",
                  features: [
                    "Unlimited case management",
                    "Unlimited document storage",
                    "Full API access for integrations",
                    "Custom workflows and integrations",
                    "Dedicated account manager",
                    "On-premise or cloud deployment options",
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
                  whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                  className={`relative bg-white rounded-xl shadow-lg p-8 flex flex-col ${
                    plan.popular ? "border-2 border-gray-900" : "border border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 text-sm font-medium bg-gray-900 text-white rounded-full"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Most Popular
                    </motion.div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-700">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-700"> / month</span>}
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <CheckCircle className="mr-2 h-5 w-5 text-gray-900" />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-auto ${plan.popular ? "bg-gray-900 hover:bg-black text-white" : "border-grayabetic-300 text-gray-900 hover:bg-gray-100"}`}
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
        <section className="w-full py-24 bg-gray-900 text-white">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Redefine Your Legal Workflow</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Join a global community of legal professionals who rely on Adhivakta to manage cases, streamline
                operations, and deliver exceptional client experiences.
              </p>
              <p className="text-sm text-gray-300">
                Trusted by over 5,000 firms worldwide. Start your journey today with a risk-free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-lg font-semibold text-gray-900">Adhivakta</span>
          </div>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Contact", "Support"].map((item, index) => (
              <Link key={item} href="#" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-sm text-gray-700">© 2025 Adhivakta Legal Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
