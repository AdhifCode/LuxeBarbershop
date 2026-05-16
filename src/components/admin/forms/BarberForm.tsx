"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input, { FieldLabel, Textarea } from "@/components/ui/Input";
import { barberSchema, type BarberInput } from "@/lib/validations/barber";
import { createBarber, updateBarber } from "@/server/actions/barbers";
import type { BarberRow } from "@/types/database";

interface Props {
  initial?: BarberRow;
  onSuccess: () => void;
}

export default function BarberForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BarberInput>({
    resolver: zodResolver(barberSchema) as never,
    defaultValues: initial
      ? {
          full_name: initial.full_name,
          bio: initial.bio,
          photo_url: initial.photo_url,
          specialties: initial.specialties,
          is_active: initial.is_active,
          hire_date: initial.hire_date,
        }
      : {
          full_name: "",
          bio: "",
          photo_url: "",
          specialties: [],
          is_active: true,
          hire_date: "",
        },
  });

  const specialties = watch("specialties") ?? [];

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (specialties.includes(v)) return;
    setValue("specialties", [...specialties, v]);
    setTagInput("");
  };

  const onSubmit = (values: BarberInput) => {
    startTransition(async () => {
      const res = initial
        ? await updateBarber(initial.id, values)
        : await createBarber(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Barber updated." : "Barber created.");
      onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="full_name" required>
            Full name
          </FieldLabel>
          <Input
            id="full_name"
            error={errors.full_name?.message}
            {...register("full_name")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="hire_date">Hire date</FieldLabel>
          <Input id="hire_date" type="date" {...register("hire_date")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea id="bio" rows={3} {...register("bio")} />
      </div>

      <div>
        <FieldLabel htmlFor="photo_url">Photo URL</FieldLabel>
        <Input
          id="photo_url"
          placeholder="https://…"
          error={errors.photo_url?.message}
          {...register("photo_url")}
        />
      </div>

      <div>
        <FieldLabel htmlFor="specialties">Specialties</FieldLabel>
        <Controller
          control={control}
          name="specialties"
          render={() => (
            <>
              <div className="flex flex-wrap gap-2 rounded-lg border border-gold/15 bg-navy-100/50 p-2">
                {specialties.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-luxe text-gold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "specialties",
                          specialties.filter((t) => t !== tag)
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-gold/20"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag and press enter"
                  className="flex-1 bg-transparent px-2 py-1 text-sm text-offwhite placeholder:text-mutedgray focus:outline-none"
                />
              </div>
            </>
          )}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-lightgray">
        <input
          type="checkbox"
          {...register("is_active")}
          className="h-4 w-4 accent-[#D4AF37]"
        />
        Active
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : initial ? "Update Barber" : "Create Barber"}
        </Button>
      </div>
    </form>
  );
}
