/**
 * FAQ data - frequently asked questions and answers.
 * Used by: FAQSection component (includes FAQPage JSON-LD schema)
 *
 * The FAQSection component automatically generates JSON-LD structured data
 * from this array, so search engines can display rich FAQ results.
 */

export interface FAQ {
  /** Unique identifier for accordion state */
  id: string
  /** The question being asked */
  question: string
  /** The answer to the question */
  answer: string
}

/**
 * Frequently asked questions.
 * Edit this array to add, remove, or modify FAQs.
 *
 * Tips:
 * - Keep answers concise but complete
 * - Use natural language that matches how customers ask
 * - Order by most commonly asked first
 * - Include questions that address common objections
 */
export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "What is your first frequently asked question?",
    answer:
      "This is the answer to your first FAQ. Provide a clear, helpful response that addresses the customer's concern. Keep it concise but complete.",
  },
  {
    id: "faq-2",
    question: "What is your second frequently asked question?",
    answer:
      "This is the answer to your second FAQ. You can include details about your services, policies, or anything customers commonly ask about.",
  },
  {
    id: "faq-3",
    question: "What is your third frequently asked question?",
    answer:
      "This is the answer to your third FAQ. Consider including information about pricing, availability, or what customers can expect.",
  },
  {
    id: "faq-4",
    question: "What is your fourth frequently asked question?",
    answer:
      "This is the answer to your fourth FAQ. Address common concerns or objections that potential customers might have.",
  },
  {
    id: "faq-5",
    question: "What is your fifth frequently asked question?",
    answer:
      "This is the answer to your fifth FAQ. Include any additional information that helps customers make a decision.",
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all FAQs.
 */
export function getAllFAQs(): FAQ[] {
  return faqs
}

/**
 * Get a subset of FAQs (e.g., for homepage preview).
 */
export function getFAQsPreview(count: number = 3): FAQ[] {
  return faqs.slice(0, count)
}
