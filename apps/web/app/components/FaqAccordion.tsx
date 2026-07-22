'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How hard is it to migrate from our current system?",
    answer: "Migration is fast and effortless! We provide free automated CSV import tools and dedicated onboarding support. Our team can help transfer your entire member directory, billing records, and active subscriptions in under 24 hours with zero downtime."
  },
  {
    question: "Do I need any special hardware for check-ins?",
    answer: "No specialized hardware required! Members can scan QR codes using any standard tablet, smartphone, or USB barcode reader. You can also turn any iOS/Android device into a digital check-in terminal."
  },
  {
    question: "Are there long-term contracts?",
    answer: "No contracts or hidden lock-ins whatsoever. All ClubPulse plans are billed month-to-month. You are free to upgrade, downgrade, or cancel your subscription at any time directly from your admin panel."
  },
  {
    question: "Is the mobile app actually useful for members?",
    answer: "Absolutely. Members use the app to display digital member ID cards, reserve court times and fitness classes, pay dues touchlessly, view upcoming club events, and receive instant push notification alerts from club coordinators."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs transition-all duration-200 hover:border-slate-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-900 text-base md:text-lg pr-4">
                {faq.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
