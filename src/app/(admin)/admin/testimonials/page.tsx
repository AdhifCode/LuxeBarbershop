import PageHeader from "@/components/layout/admin/PageHeader";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { listTestimonials } from "@/server/actions/testimonials";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const res = await listTestimonials();
  const items = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Kumpulkan dan kelola testimoni customer untuk meningkatkan trust."
      />
      <TestimonialsManager items={items} />
    </>
  );
}
