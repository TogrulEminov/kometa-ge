"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AboutContent() {
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="space-y-20">
      {/* About Section */}
      <div id="section-about" className="reveal">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="image-reveal rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=400&fit=crop"
              alt="Warehouse"
              width={500}
              height={400}
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="image-reveal rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&h=400&fit=crop"
              alt="Shipping"
              width={500}
              height={400}
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          01 / Giriş
        </p>
        <h2 className="font-display text-4xl font-bold mb-6">
          Giriş, təcrübə və etibar
        </h2>
        <p className="text-gray-500 leading-relaxed text-lg mb-4">
          Profi Transport 19 ildən artıqdır ki, beynəlxalq yükləşmə və logistika
          sahəsində fəaliyyət göstərir. Bu müddət ərzində şirkət yalnız daşıma
          xidməti göstərməklə kifayətlənməyib, müştərilər üçün düzgün
          planlaşdırılmış, idarə olunan və etibarlı logistika sistemləri qurub.
        </p>
        <p className="text-gray-500 leading-relaxed">
          Beynəlxalq logistika marşrut seçmədən daha geniş prosesdir. Burada
          vaxtın düzgün idarə olunması, sənədləşmə, tərəflər arasında
          koordinasiya, risklərin əvvəlcədən qiymətləndirilməsi və yüklün
          təyinat nöqtəsinə təhlükəsiz çatdırılması əsas rol oynayır.
        </p>
      </div>

      {/* Who We Are */}
      <div id="section-who" className="reveal">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          02 / Kimik?
        </p>
        <h2 className="font-display text-4xl font-bold mb-6">Biz kimik?</h2>
        <p className="text-gray-500 leading-relaxed text-lg mb-4">
          Profi Transport Azərbaycanda fəaliyyət göstərən beynəlxalq yükləşmə və
          logistika şirkətidir. Şirkət müxtəlif ölkələr arasında yüklərin
          daşınmasını, idxal və ixrac proseslərini, tranzit marşrutları və
          multimodal logistika həllərini təşkil edir.
        </p>
        <p className="text-gray-500 leading-relaxed">
          Fəaliyyətimizin əsas istiqaməti müştərinin yükünü təhlükəsiz, vaxtında
          və düzgün planlaşdırılmış şəkildə təyinat nöqtəsinə çatdırmaqdır.
          Bunun üçün hər daşınmada yükün növü, həcmi, çəkisi, marşrutu və
          çatdırılma tələbi ayrıca analiz olunur.
        </p>
      </div>
    </div>
  );
}
