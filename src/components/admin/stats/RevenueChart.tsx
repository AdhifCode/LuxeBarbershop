"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatRupiah } from "@/lib/utils";

interface DataPoint {
  day: string;
  revenue: number;
  bookings: number;
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="luxe-card p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-luxe text-gold">
            Last 7 Days
          </p>
          <h3 className="mt-1 font-display text-2xl text-offwhite">
            Revenue Trend
          </h3>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formatted}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(212,175,55,0.08)"
            />
            <XAxis
              dataKey="label"
              stroke="#A0A0A0"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#A0A0A0"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1000
                    ? `${(v / 1000).toFixed(0)}K`
                    : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                background: "#0A192F",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: 12,
                color: "#F5F5F5",
                fontSize: 12,
              }}
              labelStyle={{ color: "#D4AF37", fontSize: 11 }}
              formatter={(value, name) =>
                name === "revenue"
                  ? [formatRupiah(Number(value)), "Revenue"]
                  : [String(value), "Bookings"]
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={{ fill: "#D4AF37", r: 3 }}
              activeDot={{ r: 5, fill: "#E6C863" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
