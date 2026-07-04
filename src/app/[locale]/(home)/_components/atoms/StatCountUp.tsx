"use client";

import CountUp from "react-countup";

interface StatCountUpProps {
  value: string | number;
  suffix?: string;
  className?: string;
}

export default function StatCountUp({
  value,
  suffix = "",
  className,
}: StatCountUpProps) {
  const isNumber = !isNaN(Number(value));

  return (
    <span className={className}>
      {isNumber ? (
        <CountUp
          end={Number(value)}
          duration={2}
          suffix={suffix}
          enableScrollSpy
          scrollSpyOnce
        />
      ) : (
        `${value}${suffix}`
      )}
    </span>
  );
}
