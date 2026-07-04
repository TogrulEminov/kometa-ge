"use client";
import CountUp from "react-countup";

interface StatCardProps {
  label: string;
  suffix?: string;
  value: number;
}

export default function StatCard({ label, value, suffix }: StatCardProps) {
  const isNumber = !isNaN(Number(value));

  return (
    <div className="flex-1 lg:flex-none w-full shrink-0 surface-card p-6 text-center lg:text-left">
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
      <div className="text-sm text-muted font-medium">{label}</div>
    </div>
  );
}
