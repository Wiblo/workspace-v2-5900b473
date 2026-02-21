/**
 * FAQ data - frequently asked questions and answers.
 * Used by: FAQSection component (includes FAQPage JSON-LD schema)
 */

export interface FAQ {
  id: string
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Do I need a referral to see a physiotherapist?",
    answer:
      "No, you don't need a referral to book an appointment with us. You can contact us directly to schedule your first visit. However, if you're claiming through certain insurance plans, a doctor's referral may be required for reimbursement. We're happy to help you check your coverage.",
  },
  {
    id: "faq-2",
    question: "What should I wear to my physiotherapy appointment?",
    answer:
      "Wear comfortable, loose-fitting clothing that allows easy movement and access to the area being treated. For lower body issues, shorts or leggings work well. For upper body concerns, a tank top or t-shirt is ideal. We also have private treatment rooms if you need to change.",
  },
  {
    id: "faq-3",
    question: "How many sessions will I need?",
    answer:
      "The number of sessions varies depending on your condition, its severity, and your goals. After your initial assessment, your therapist will give you an estimated treatment plan. Many patients see improvement within 4-6 sessions, while more complex conditions may require ongoing care.",
  },
  {
    id: "faq-4",
    question: "What happens during my first appointment?",
    answer:
      "Your first visit is a comprehensive assessment lasting about 60 minutes. Your therapist will discuss your medical history, assess your movement and strength, identify the root cause of your issue, and create a personalized treatment plan. You'll also receive initial treatment and home exercises.",
  },
  {
    id: "faq-5",
    question: "Does physiotherapy hurt?",
    answer:
      "Physiotherapy should not cause significant pain. While some techniques may cause mild discomfort, especially when treating tight or injured areas, your therapist will always communicate with you and adjust the treatment to your comfort level. The goal is to reduce pain, not increase it.",
  },
  {
    id: "faq-6",
    question: "Do you accept insurance?",
    answer:
      "Yes, we accept most major health insurance plans and can direct bill many providers. We recommend contacting your insurance company beforehand to confirm your physiotherapy coverage. Our front desk team can also help you navigate your benefits.",
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getAllFAQs(): FAQ[] {
  return faqs
}

export function getFAQsPreview(count: number = 3): FAQ[] {
  return faqs.slice(0, count)
}
