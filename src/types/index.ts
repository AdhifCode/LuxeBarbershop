export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "Fade" | "Mullet" | "Classic" | "Beard" | "Color";
}

export interface BookingForm {
  name: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
