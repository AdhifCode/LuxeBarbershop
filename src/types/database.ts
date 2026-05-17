/**
 * src/types/database.ts
 *
 * CARA PAKAI:
 * File ini adalah "wrapper" yang aman — tidak perlu diubah manual lagi.
 *
 * Setelah menjalankan:
 *   npx supabase gen types typescript --project-id <ref> > src/types/supabase.generated.ts
 *
 * Import Database dari file generated tersebut di baris paling atas,
 * lalu semua alias di bawah tetap bekerja tanpa perubahan apapun.
 *
 * Untuk saat ini (tanpa gen types), semua tipe ditulis manual di sini
 * agar project tetap bisa di-build.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ────────────────────────────────────────────────────
export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
export type PromoType = "PERCENTAGE" | "FIXED_AMOUNT";
export type NotificationChannel = "WHATSAPP" | "EMAIL" | "SMS" | "IN_APP";
export type InventoryMovementType = "IN" | "OUT" | "ADJUST";
export type GalleryCategory =
  | "FADE"
  | "CLASSIC"
  | "MULLET"
  | "BEARD"
  | "COLOR"
  | "OTHER";

// ─── Raw row types ─────────────────────────────────────────────
// Gunakan `type` bukan `interface` agar assignable ke
// Record<string, unknown> yang dibutuhkan postgrest-js generics.

export type ProfilesRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ServicesRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  duration_min: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BarbersRow = {
  id: string;
  profile_id: string | null;
  full_name: string;
  bio: string | null;
  photo_url: string | null;
  specialties: string[];
  is_active: boolean;
  hire_date: string | null;
  created_at: string;
  updated_at: string;
};

export type BarberServicesRow = {
  barber_id: string;
  service_id: string;
};

export type BarberShiftsRow = {
  id: string;
  barber_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type BookingsRow = {
  id: string;
  code: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_id: string | null;
  service_title: string;
  service_price: number;
  duration_min: number;
  barber_id: string | null;
  barber_name: string | null;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  promo_id: string | null;
  discount_amount: number;
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PromosRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: PromoType;
  value: number;
  banner_url: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
};

export type GalleryItemRow = {
  id: string;
  title: string;
  category: GalleryCategory;
  before_url: string | null;
  after_url: string;
  barber_id: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type TestimonialsRow = {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar: string | null;
  rating: number;
  message: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type InventoryItemsRow = {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  stock: number;
  reorder_level: number;
  cost_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryMovementsRow = {
  id: string;
  item_id: string;
  type: InventoryMovementType;
  quantity: number;
  reason: string | null;
  booking_id: string | null;
  created_by: string | null;
  created_at: string;
};

export type NotificationsRow = {
  id: string;
  booking_id: string | null;
  channel: NotificationChannel;
  recipient: string;
  subject: string | null;
  body: string;
  sent_at: string | null;
  error: string | null;
  created_at: string;
};

// ─── Database schema (dipakai oleh Supabase client generics) ──
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: Partial<ProfilesRow> & { id: string; full_name: string };
        Update: Partial<ProfilesRow>;
        Relationships: [];
      };
      services: {
        Row: ServicesRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          price: number;
          duration_min: number;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          image_url?: string | null;
        };
        Update: Partial<ServicesRow>;
        Relationships: [];
      };
      barbers: {
        Row: BarbersRow;
        Insert: {
          id?: string;
          profile_id?: string | null;
          full_name: string;
          bio?: string | null;
          photo_url?: string | null;
          specialties?: string[];
          is_active?: boolean;
          hire_date?: string | null;
        };
        Update: Partial<BarbersRow>;
        Relationships: [];
      };
      barber_services: {
        Row: BarberServicesRow;
        Insert: BarberServicesRow;
        Update: Partial<BarberServicesRow>;
        Relationships: [];
      };
      barber_shifts: {
        Row: BarberShiftsRow;
        Insert: Omit<BarberShiftsRow, "id"> & { id?: string };
        Update: Partial<BarberShiftsRow>;
        Relationships: [];
      };
      bookings: {
        Row: BookingsRow;
        Insert: Partial<BookingsRow> & {
          customer_name: string;
          customer_phone: string;
          service_title: string;
          service_price: number;
          duration_min: number;
          start_at: string;
          end_at: string;
          total_price: number;
        };
        Update: Partial<BookingsRow>;
        Relationships: [];
      };
      promos: {
        Row: PromosRow;
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
          type: PromoType;
          value: number;
          banner_url?: string | null;
          starts_at: string;
          ends_at: string;
          is_active?: boolean;
          usage_limit?: number | null;
          used_count?: number;
        };
        Update: Partial<PromosRow>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryItemRow;
        Insert: {
          id?: string;
          title: string;
          category?: GalleryCategory;
          before_url?: string | null;
          after_url: string;
          barber_id?: string | null;
          is_published?: boolean;
          sort_order?: number;
        };
        Update: Partial<GalleryItemRow>;
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialsRow;
        Insert: {
          id?: string;
          author_name: string;
          author_title?: string | null;
          author_avatar?: string | null;
          rating: number;
          message: string;
          is_published?: boolean;
          sort_order?: number;
        };
        Update: Partial<TestimonialsRow>;
        Relationships: [];
      };
      inventory_items: {
        Row: InventoryItemsRow;
        Insert: {
          id?: string;
          name: string;
          sku?: string | null;
          unit?: string;
          stock?: number;
          reorder_level?: number;
          cost_price?: number | null;
          is_active?: boolean;
        };
        Update: Partial<InventoryItemsRow>;
        Relationships: [];
      };
      inventory_movements: {
        Row: InventoryMovementsRow;
        Insert: {
          id?: string;
          item_id: string;
          type: InventoryMovementType;
          quantity: number;
          reason?: string | null;
          booking_id?: string | null;
          created_by?: string | null;
        };
        Update: Partial<InventoryMovementsRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationsRow;
        Insert: {
          id?: string;
          booking_id?: string | null;
          channel: NotificationChannel;
          recipient: string;
          subject?: string | null;
          body: string;
          sent_at?: string | null;
          error?: string | null;
        };
        Update: Partial<NotificationsRow>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      increment_promo_used_count: {
        Args: { p_id: string };
        Returns: number;
      };
      sync_role_to_jwt: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      promo_type: PromoType;
      notification_channel: NotificationChannel;
      inventory_movement_type: InventoryMovementType;
      gallery_category: GalleryCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─── Convenience aliases ───────────────────────────────────────
// Dipakai di seluruh project — JANGAN dihapus.
export type ServiceRow = ServicesRow;
export type BarberRow = BarbersRow;
export type BookingRow = BookingsRow;
export type PromoRow = PromosRow;
export type GalleryRow = GalleryItemRow;
export type TestimonialRow = TestimonialsRow;
export type InventoryItemRow = InventoryItemsRow;