"use client";

import { useEffect, useRef } from "react";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "Quru yolu ilə yükləşmə",
    description:
      "Regional və beynəlxalq marşrutlarda qruplaj, tam yük və ağır texnika daşınmaları üçün çevik logistika həlləri.",
  },
  {
    number: "02",
    title: "Dəniz yolu ilə yükləşmə",
    description:
      "Konteyner, iri həcmli, sənaye və uzun məsafəli yüklər üçün beynəlxalq dəniz logistikasının təşkili.",
  },
  {
    number: "03",
    title: "Hava yolu ilə yükləşmə",
    description:
      "Təcili, yüksək dəyərli və vaxt həssaslığı olan yüklər üçün sürətli beynəlxalq çatdırılma xidməti.",
  },
  {
    number: "04",
    title: "Dəmiryolu ilə yükləşmə",
    description:
      "Böyük həcmli, ağır və uzun məsafəli yüklər üçün stabil tranzit və konteyner daşınmaları.",
  },
  {
    number: "05",
    title: "Ağır texnika və xüsusi yüklər",
    description:
      "Buldozer, ekskavator, mobil kran, transformator və iri sənaye avadanlıqları üçün fərdi logistika planı.",
  },
];

export default function ServicesList() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div id="section-services" ref={sectionRef} className="reveal">
      <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        06 / Xidmətlər
      </p>
      <h2 className="font-display text-4xl font-bold mb-6">
        Hansı xidmətlər təqdim edirik?
      </h2>
      <p className="text-gray-500 leading-relaxed text-lg mb-10">
        Profi Transport müştərinin yük növünə, büdcəsinə, müddət tələbinə və
        istiqamətinə uyğun müxtəlif daşıma həlləri təqdim edir.
      </p>

      <div className="space-y-0">
        {services.map((service, index) => (
          <div
            key={service.number}
            className={`group border-t border-gray-200 py-8 ${
              index === services.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 lg:col-span-1">
                <span className="font-display text-2xl font-bold text-gray-300 group-hover:text-primary transition-colors">
                  {service.number}
                </span>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <p className="text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-2 flex justify-end">
                <svg
                  className="w-6 h-6 text-gray-300 group-hover:text-primary transition-all transform group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}