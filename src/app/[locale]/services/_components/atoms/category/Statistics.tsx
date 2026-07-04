"use client";
import { jsonItem, newInfoJson } from "@/services/interface/type";
import CountUp from "react-countup";
import { FaChartBar } from "react-icons/fa";

export default function Statistics({
  statistics,
}: {
  statistics: newInfoJson;
}) {
  if (!statistics) return null;
  return (
    <div id="statistics" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {statistics.subTitle && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {statistics.subTitle}
          </span>
        )}
        <h2
          title={statistics.title}
          className="text-foreground text-3xl font-bold mt-2 mb-4"
        >
          {statistics.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statistics.items.map((stat: jsonItem, i: number) => {
          const isNumber = !isNaN(Number(stat.itemValue));

          return (
            <div
              key={i}
              className="bg-secondary rounded-2xl p-6 text-center group hover:bg-primary transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mx-auto mb-3 group-hover:bg-white/20 transition-colors duration-300">
                <FaChartBar className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
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

              {typeof stat.itemTitle === "string" && (
                <div className="text-white/60 text-xs font-medium">
                  {stat.itemTitle as string}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
