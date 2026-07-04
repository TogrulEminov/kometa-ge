"use client";
import { jsonItem, newInfoJson } from "@/services/interface/type";
import CountUp from "react-countup";

export default function StatisticsDetail({
  statistics,
}: {
  statistics: newInfoJson;
}) {
  if (!statistics) return null;
  return (
    <div id="statistics" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {statistics.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {statistics.subTitle}
          </span>
        )}
        <h2
          title={statistics.title}
          className="text-3xl font-bold mt-2 mb-4 text-foreground"
        >
          {statistics.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="rounded-2xl p-8 bg-secondary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.items.map((stat: jsonItem, i: number) => {
            const isNumber = !isNaN(Number(stat.itemValue));
            return (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {isNumber ? (
                    <CountUp
                      end={Number(stat.itemValue) as number}
                      duration={2}
                      enableScrollSpy={true}
                      scrollSpyOnce={false}
                      suffix={stat.itemSuffix as string}
                    />
                  ) : (
                    <span>
                      {stat.itemValue as string} {stat.itemSuffix as string}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-white/60">
                  {stat.itemTitle as string}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
