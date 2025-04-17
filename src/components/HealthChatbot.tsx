"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner, FaLanguage } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage, { MessageType } from './ChatMessage';
import { useLanguage } from '@/context/LanguageContext';

// Get the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Only initialize the Google Generative AI if API key is available
let genAI: any = null;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
}

const HealthChatbot: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: uuidv4(),
      text: apiKey 
        ? "Hi there! I'm your health assistant. How can I help you with your fitness, nutrition, or wellness questions today?"
        : "Hi there! It looks like the AI service is not properly configured. Please check back later or contact support if this issue persists.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(!apiKey);
  const [isKurdishResponse, setIsKurdishResponse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || apiKeyMissing) return;

    // Add user message
    const userMessage: MessageType = {
      id: uuidv4(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!genAI) {
        throw new Error("Gemini API not initialized");
      }

      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Set language for AI response
      const responseLanguage = isKurdishResponse ? 
        "Respond in Kurdish Sorani language using Arabic script. Make sure to use proper Kurdish Sorani grammar and vocabulary." : 
        "Respond in English language.";

      // Prepare prompt with health context
      const prompt = `You are a helpful health and fitness assistant. Please provide accurate and helpful information about fitness, nutrition, wellness, and healthy lifestyle choices. 
      
      User question: ${inputText}
      
      ${responseLanguage}
      
      Keep your answers concise, evidence-based, and focused on promoting overall health and wellbeing. Do not provide medical diagnoses or treatment recommendations.`;

      // Get the response from the AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Add bot response
      const botMessage: MessageType = {
        id: uuidv4(),
        text: text,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add specific error message based on the error
      let errorMessage = "I'm sorry, but I couldn't generate a response at the moment. Please try again later.";
      
      if ((error as Error).message.includes("403") || (error as Error).message.includes("API Key")) {
        errorMessage = "There seems to be an issue with the API key. The administrator needs to set up a valid Gemini API key.";
        setApiKeyMissing(true);
      }
      
      const botErrorMessage: MessageType = {
        id: uuidv4(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Toggle language of AI responses
  const toggleResponseLanguage = () => {
    setIsKurdishResponse(!isKurdishResponse);
  };

  // Example health-related questions for suggestions
  const suggestions = [
    "How many calories should I eat in a day?",
    "What's a good workout for beginners?",
    "How can I improve my sleep quality?",
    "What are healthy snack options?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{t("healthAssistant.assistantTitle")}</h2>
            <p className="text-sm text-blue-100">{t("healthAssistant.assistantSubtitle")}</p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={toggleResponseLanguage}
              className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                isKurdishResponse 
                  ? 'bg-blue-700 text-white hover:bg-blue-800' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title={isKurdishResponse 
                ? `${t("healthAssistant.languageToggle.currentlyResponding")} ${t("healthAssistant.languageToggle.kurdish")}` 
                : `${t("healthAssistant.languageToggle.currentlyResponding")} ${t("healthAssistant.languageToggle.english")}`}
            >
              <FaLanguage className="mr-1.5" size={18} />
              <span className="font-medium text-sm">
                {isKurdishResponse ? t("healthAssistant.languageToggle.kurdish") : t("healthAssistant.languageToggle.english")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {apiKeyMissing && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">{t("healthAssistant.apiKeyRequired")}</p>
          <p>
            {t("healthAssistant.apiKeyMissing")}
          </p>
          <p className="text-sm mt-2">
            {t("healthAssistant.getApiKeyFrom")}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
              disabled={apiKeyMissing}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiKeyMissing 
              ? t("healthAssistant.apiKeyRequiredPlaceholder") 
              : t("healthAssistant.inputPlaceholder")}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={1}
            disabled={apiKeyMissing}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || inputText.trim() === '' || apiKeyMissing}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {t("healthAssistant.send")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HealthChatbot; 