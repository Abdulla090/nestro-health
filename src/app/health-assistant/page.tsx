"use client";

import HealthChatbot from "@/components/HealthChatbot";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import KurdishLanguageEnforcer from "@/components/KurdishLanguageEnforcer";

export default function HealthAssistantPage() {
  // Check if API key is available
  const apiKeyAvailable = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <KurdishLanguageEnforcer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{t("nav.healthAssistant")}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("calculators.healthAssistant.description")}
        </p>
        
        {!apiKeyAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 bg-yellow-50 border-yellow-200 border rounded-lg p-4 max-w-2xl mx-auto"
          >
            <p className="text-yellow-800">
              <strong>{t("healthAssistant.apiKeyRequired")}:</strong> {t("healthAssistant.apiKeyMissing")}
            </p>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-2"
        >
          <HealthChatbot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{t("healthAssistant.about")}</h2>
            <p className="text-gray-600 mb-4">
              {t("healthAssistant.aboutDescription")}
            </p>
            <p className="text-gray-600 mb-4">
              {t("healthAssistant.poweredBy")}
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>{t("healthAssistant.disclaimer").split(":")[0]}:</strong> {t("healthAssistant.disclaimer").split(":")[1]}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{t("healthAssistant.sampleQuestions")}</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="bg-blue-50 p-3 rounded-lg">"What are some healthy breakfast options?"</li>
              <li className="bg-blue-50 p-3 rounded-lg">"How can I improve my sleep quality?"</li>
              <li className="bg-blue-50 p-3 rounded-lg">"What exercises are good for lower back pain?"</li>
              <li className="bg-blue-50 p-3 rounded-lg">"How much water should I drink daily?"</li>
              <li className="bg-blue-50 p-3 rounded-lg">"What are the symptoms of vitamin D deficiency?"</li>
            </ul>
          </div>
          
          {!apiKeyAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t("healthAssistant.setupInstructions")}</h2>
              <div className="space-y-3 text-gray-600">
                <p>{t("healthAssistant.setupDescription")}</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>{t("healthAssistant.getApiKey")}</li>
                  <li>{t("healthAssistant.createEnvFile")}</li>
                  <li>{t("healthAssistant.addApiKey")}</li>
                  <li>{t("healthAssistant.restartServer")}</li>
                </ol>
                <p className="mt-2">
                  <Link href="/" className="text-blue-600 hover:underline">
                    {t("healthAssistant.returnHome")}
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 