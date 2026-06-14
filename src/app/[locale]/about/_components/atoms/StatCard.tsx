"use client";
import CountUp from "react-countup";

interface StatCardProps {
  label: string;
  suffix?: string;
  value: string | number;
}

export default function StatCard({ label, value, suffix }: StatCardProps) {
  const isNumber = !isNaN(Number(value));

  return (
    <div className="flex-1 lg:flex-none w-full shrink-0 bg-gray-50 rounded-2xl p-6 text-center lg:text-left border border-gray-100">
      <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
        {isNumber ? (
          <CountUp
            end={Number(value) as number}
            duration={2}
            suffix={suffix}
            enableScrollSpy={true}
            scrollSpyOnce={false}
          />
        ) : (
          `${value}${suffix}`
        )}
      </div>
      <div className="text-sm text-secondary/60 font-medium">{label}</div>
    </div>
  );
}
