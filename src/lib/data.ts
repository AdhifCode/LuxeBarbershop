import type { GalleryItem, Service } from "@/types";

export const SERVICES: Service[] = [
  {
    id: "haircut-signature",
    title: "Signature Haircut",
    description:
      "Konsultasi gaya, potong rambut presisi, hot towel, dan styling premium.",
    price: "Rp 75.000",
    duration: "45 min",
    featured: true,
  },
  {
    id: "haircut-beard",
    title: "Haircut + Beard Grooming",
    description:
      "Paket lengkap potong rambut dan grooming jenggot dengan royal shave.",
    price: "Rp 110.000",
    duration: "60 min",
  },
  {
    id: "creambath",
    title: "Creambath Therapy",
    description:
      "Perawatan kulit kepala dan rambut dengan pijat relaksasi 30 menit.",
    price: "Rp 85.000",
    duration: "60 min",
  },
  {
    id: "keratin",
    title: "Keratin Smoothing",
    description:
      "Perawatan rambut premium untuk hasil halus, sehat, dan berkilau.",
    price: "Rp 250.000",
    duration: "90 min",
  },
  {
    id: "hair-color",
    title: "Hair Coloring",
    description:
      "Pewarnaan profesional dengan produk premium dan finishing rapi.",
    price: "Rp 180.000",
    duration: "90 min",
  },
  {
    id: "luxe-package",
    title: "The Luxe Package",
    description:
      "Haircut + Beard + Creambath + Hot Towel. Pengalaman grooming terlengkap.",
    price: "Rp 175.000",
    duration: "120 min",
    featured: true,
  },
];

/**
 * Curated Unsplash imagery for the lookbook. Production-quality and license-friendly.
 */
export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
    alt: "Mid fade haircut",
    title: "Mid Fade",
    category: "Fade",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
    alt: "Classic side part",
    title: "Classic Side Part",
    category: "Classic",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
    alt: "Beard sculpting",
    title: "Royal Beard",
    category: "Beard",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=900&q=80",
    alt: "Modern mullet",
    title: "Modern Mullet",
    category: "Mullet",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1635273051937-1108a242c14a?auto=format&fit=crop&w=900&q=80",
    alt: "Skin fade",
    title: "Skin Fade",
    category: "Fade",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1593702288056-f173dc8a96c2?auto=format&fit=crop&w=900&q=80",
    alt: "Textured crop",
    title: "Textured Crop",
    category: "Classic",
  },
  {
    id: "g7",
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80",
    alt: "Hair color highlight",
    title: "Highlight Color",
    category: "Color",
  },
  {
    id: "g8",
    src: "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=900&q=80",
    alt: "Pompadour styling",
    title: "Pompadour",
    category: "Classic",
  },
];
