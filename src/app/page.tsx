"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircleIcon, BoltIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import KurdishLanguageEnforcer from "@/components/KurdishLanguageEnforcer";
import KurdishFontFixer from "./KurdishFontFixer";
import { useAuth } from "@/context/AuthContext";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { t } = useLanguage();
  const { profile, loading } = useAuth();
  
  // Check if user has a profile, redirect to profile page if they do
  useEffect(() => {
    // We no longer want to redirect users with profiles away from the home page
    // Instead, we'll show personalized content for users with profiles
    console.log("Home page loaded, user profile status:", profile ? "has profile" : "no profile");
  }, [profile, loading]);
  
  const calculators = [
    {
      title: t("nav.bmiCalculator"),
      description: "Calculate your Body Mass Index based on your height and weight.",
      link: "/bmi",
      gradient: "bg-gradient-primary",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    },
    {
      title: t("nav.healthAssistant"),
      description: "Chat with our AI-powered health assistant for fitness, nutrition, and wellness advice.",
      link: "/health-assistant",
      gradient: "bg-gradient-info",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      ),
    },
    {
      title: t("nav.calorieCalculator"),
      description: "Estimate your daily calorie needs based on your age, gender, height, weight, and activity level.",
      link: "/calories",
      gradient: "bg-gradient-success",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    {
      title: t("nav.idealWeight"),
      description: "Find your ideal weight based on your height and gender using multiple formulas.",
      link: "/ideal-weight",
      gradient: "bg-gradient-purple",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
        </svg>
      ),
    },
    {
      title: t("nav.bodyFat"),
      description: "Estimate your body fat percentage using the U.S. Navy circumference method.",
      link: "/body-fat",
      gradient: "bg-gradient-orange",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
    },
    {
      title: t("nav.waterIntake"),
      description: "Calculate how much water you should drink daily based on your weight and activity level.",
      link: "/water-intake",
      gradient: "bg-gradient-cyan",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      ),
    },
    {
      title: t("nav.bloodPressure"),
      description: "Check your blood pressure category according to American Heart Association guidelines.",
      link: "/blood-pressure",
      gradient: "bg-gradient-red",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen font-sorani">
      <KurdishLanguageEnforcer />
      <KurdishFontFixer />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-sm"
              >
                <p className="text-xl font-medium text-gray-800">
                  {t("home.welcomeUser") || "Welcome"}, <span className="font-bold text-indigo-600">{profile.username || profile.full_name}</span>!
                </p>
              </motion.div>
            )}
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
            >
              {t("home.title")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              {t("home.subtitle")}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#calculators" 
                className="btn-primary"
              >
                {t("home.tryCalculators")}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#features" 
                className="btn-secondary"
              >
                {t("home.learnMore")}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,133.3C840,139,960,117,1080,106.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Calculators Section */}
      <section id="calculators" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("home.calculatorsHeading")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("home.calculatorsSubtitle")}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {calculators.map((calculator, index) => (
              <motion.div
                key={calculator.title}
                variants={fadeIn}
                whileHover={{ 
                  scale: 1.03,
                  transition: { 
                    type: "spring", 
                    stiffness: 300
                  }
                }}
                className="overflow-hidden rounded-2xl shadow-md"
              >
                <Link href={calculator.link} className="hover-card group block">
                  <div className={`${calculator.gradient} p-6 flex items-start gap-4`}>
                    <div className="p-3 bg-white/20 rounded-xl">
                      {calculator.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{calculator.title}</h3>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 mb-6">{calculator.description}</p>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center font-medium text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                        {t("home.tryCalculator")}
                        <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("home.whyChooseHeading")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("home.whyChooseSubtitle")}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                icon: <CheckCircleIcon className="w-8 h-8 text-blue-600" />,
                title: t("home.feature1Title"),
                description: t("home.feature1Description")
              },
              {
                icon: <BoltIcon className="w-8 h-8 text-blue-600" />,
                title: t("home.feature2Title"),
                description: t("home.feature2Description")
              },
              {
                icon: <LockClosedIcon className="w-8 h-8 text-blue-600" />,
                title: t("home.feature3Title"),
                description: t("home.feature3Description")
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-md hover-card"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("home.ctaHeading")}</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {t("home.ctaSubtitle")}
            </p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#calculators" 
              className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-lg font-medium bg-transparent hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              {t("home.getStartedNow")}
              <motion.svg 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">N</div>
                <span className="text-xl font-bold">
                  {t("common.appName")}<span className="text-blue-400">.</span>
                </span>
              </motion.div>
              <p className="mt-2 text-gray-400">
                {t("home.footerDescription")}
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <div className="flex flex-col items-center justify-center mt-16 mb-8">
                <p className="text-gray-500 text-sm text-center">
                  © {new Date().getFullYear()} Nestro Health. {t("home.footerDisclaimer")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
