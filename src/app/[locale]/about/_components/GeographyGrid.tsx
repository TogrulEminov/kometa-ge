"use client";

import { useEffect, useRef } from "react";

interface GeoItem {
  title: string;
  tag: string;
  description: string;
}

const geoItems: GeoItem[] = [
  {
    title: "Çin",
    tag: "Asiya",
    description:
      "Çindən Azərbaycana və regiona qruplaj, konteyner, tam yük və multimodal daşınmalar təşkil olunur.",
  },
  {
    title: "Avropa",
    tag: "Avropa",
    description:
      "Avropa ölkələri ilə Azərbaycan arasında sənaye, ticarət, avadanlıq və müxtəlif kateqoriyalı yüklər üzrə logistika həlləri.",
  },
  {
    title: "Türkiyə",
    tag: "Region",
    description:
      "Türkiyə istiqaməti üzrə quru yolu, qruplaj, tam yük və ekspress daşıma xidmətləri həyata keçirilir.",
  },
  {
    title: "MDB və Orta Asiya",
    tag: "MDB",
    description:
      "MDB və Orta Asiya bazarına üzrə tranzit, idxal, ixrac və ağır yüklərin planlaşdırılması.",
  },
];

export default function GeographyGrid() {
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
    <div id="section-geo" ref={sectionRef} className="reveal">
      <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        03 / Fəaliyyət
      </p>
      <h2 className="font-display text-4xl font-bold mb-6">
        Fəaliyyət coğrafiyamız
      </h2>
      <p className="text-gray-500 leading-relaxed text-lg mb-8">
        Profi Transport Çin, Avropa, Türkiyə, MDB, Orta Asiya və digər
        beynəlxalq istiqamətlər üzrə yükləşmələr təşkil edir. Şirkət həm
        Azərbaycana idxal edilən yüklərin, həm də Azərbaycandan xarici bazarlara
        göndərilən məhsulların logistikasını idarə edir.
      </p>

      <div className="grid md:grid-cols-2 gap-px bg-gray-300">
        {geoItems.map((item) => (
          <div key={item.title} className="bg-tertiary p-8 lg:p-10 reveal">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-display text-2xl font-bold">{item.title}</h3>
              <span className="text-xs font-medium text-gray-400 border border-gray-300 px-3 py-1">
                {item.tag}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}