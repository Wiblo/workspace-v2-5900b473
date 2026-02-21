/**
 * Services data - defines all services offered by the business.
 * Used by: FeaturedServices, ServicesGrid, ServiceCard, /services/[slug] pages
 */

export interface Service {
  slug: string
  name: string
  shortDescription: string
  description: string
  icon?: string
  image?: string
  imageAlt?: string
  featured?: boolean
  duration?: string
  price?: string
  benefits?: string[]
  idealFor?: string[]
}

export const services: Service[] = [
  {
    slug: "sports-physiotherapy",
    name: "Sports Physiotherapy",
    shortDescription:
      "Specialized treatment for sports injuries and performance optimization to get you back in the game faster.",
    description:
      "Our sports physiotherapy program is designed for athletes of all levels. We use evidence-based techniques to treat acute injuries, support post-surgical rehabilitation, and optimize athletic performance.\n\nWhether you're a weekend warrior or a competitive athlete, our therapists understand the demands of sport and will create a targeted recovery plan to get you back to peak performance.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    imageAlt: "Physiotherapist working with an athlete on sports rehabilitation",
    featured: true,
    duration: "60 min",
    price: "$120",
    benefits: [
      "Faster return to sport",
      "Injury prevention strategies",
      "Sport-specific rehabilitation programs",
      "Performance optimization techniques",
    ],
    idealFor: [
      "Athletes recovering from injury",
      "Weekend warriors with recurring pain",
      "Competitive athletes seeking peak performance",
    ],
  },
  {
    slug: "manual-therapy",
    name: "Manual Therapy",
    shortDescription:
      "Hands-on treatment techniques including joint mobilization and soft tissue work to restore movement and reduce pain.",
    description:
      "Manual therapy is a cornerstone of physiotherapy at Proactive Therapy. Our skilled therapists use their hands to mobilize joints, release tight muscles, and restore normal movement patterns.\n\nThis approach is particularly effective for stiff joints, muscle tension, headaches, and chronic pain conditions. Each session combines hands-on treatment with targeted exercises for lasting results.",
    icon: "Hand",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    imageAlt: "Physiotherapist performing manual therapy techniques on a patient",
    featured: true,
    duration: "45 min",
    price: "$100",
    benefits: [
      "Improved joint mobility",
      "Reduced muscle tension and pain",
      "Better posture and alignment",
      "Headache and migraine relief",
    ],
    idealFor: [
      "People with stiff or painful joints",
      "Office workers with neck and back tension",
      "Anyone with chronic pain conditions",
    ],
  },
  {
    slug: "rehabilitation",
    name: "Post-Surgery Rehabilitation",
    shortDescription:
      "Guided recovery programs after surgery to restore strength, mobility, and confidence in your body.",
    description:
      "Recovering from surgery requires expert guidance to ensure a safe and complete return to your daily activities. Our post-surgery rehabilitation programs are designed in collaboration with your surgeon to optimize your recovery timeline.\n\nFrom knee replacements to shoulder reconstructions, we guide you through each phase of healing with progressive exercise programs, manual therapy, and education to help you regain full function.",
    icon: "HeartPulse",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    imageAlt: "Patient performing rehabilitation exercises with physiotherapist guidance",
    featured: true,
    duration: "60 min",
    price: "$120",
    benefits: [
      "Structured recovery roadmap",
      "Surgeon-aligned treatment plans",
      "Progressive strength building",
      "Safe return to daily activities",
    ],
    idealFor: [
      "Post-knee or hip replacement patients",
      "Post-ACL reconstruction recovery",
      "Post-shoulder surgery rehabilitation",
    ],
  },
  {
    slug: "chronic-pain-management",
    name: "Chronic Pain Management",
    shortDescription:
      "Evidence-based approaches to understand, manage, and reduce persistent pain through movement and education.",
    description:
      "Living with chronic pain can feel overwhelming, but it doesn't have to control your life. Our chronic pain management program uses the latest evidence in pain science to help you understand your pain and develop strategies to reduce it.\n\nWe combine graded exercise, pain neuroscience education, manual therapy, and lifestyle modifications to help you regain control and get back to doing what you love.",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
    imageAlt: "Therapist helping patient with chronic pain management exercises",
    featured: false,
    duration: "60 min",
    price: "$120",
    benefits: [
      "Better understanding of your pain",
      "Reduced reliance on medication",
      "Improved daily function and quality of life",
      "Long-term self-management strategies",
    ],
    idealFor: [
      "People with pain lasting more than 3 months",
      "Those who have tried other treatments without success",
      "Anyone wanting to reduce pain medication use",
    ],
  },
  {
    slug: "dry-needling",
    name: "Dry Needling",
    shortDescription:
      "Targeted treatment using thin needles to release muscle trigger points, reduce tension, and relieve pain.",
    description:
      "Dry needling is an effective technique for treating muscular pain and tightness. Our trained therapists insert thin, sterile needles into myofascial trigger points to release tension, improve blood flow, and reduce pain.\n\nThis treatment is often combined with other physiotherapy techniques for the best results. It is particularly effective for conditions like neck pain, back pain, tennis elbow, and muscle strains.",
    icon: "Target",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&h=600&fit=crop",
    imageAlt: "Dry needling treatment being performed on a patient",
    featured: false,
    duration: "30 min",
    price: "$80",
    benefits: [
      "Rapid pain relief",
      "Muscle tension release",
      "Improved range of motion",
      "Accelerated healing",
    ],
    idealFor: [
      "People with muscle knots and trigger points",
      "Athletes with recurring muscle tightness",
      "Those with tension headaches",
    ],
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export function getFeaturedServices(): Service[] {
  return services.filter((service) => service.featured)
}

export function getAllServices(): Service[] {
  return services
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug)
}
