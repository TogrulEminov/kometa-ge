import CustomImage from "@/globalElement/CustomImage";
import { highlightActiveWord } from "@/utils/highlight";
import StatCard from "./atoms/StatCard";
export default function HeroSection() {
  const stats = [
    { number: "19", label: "İllik Təcrübə", suffix: "+" },
    { number: "50", label: "Ölkə", suffix: "+" },
    { number: "1000", label: "Müştəri", suffix: "+" },
  ];

  return (
    <section className="relative bg-white overflow-hidden py-10 lg:py-20 border-b border-b-tertiary">
      <div className="container ">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 space-y-5">
            <span className="text-sm block w-fit font-medium bg-primary text-white px-4 rounded-full py-2 tracking-wide">
              Haqqımızda
            </span>
            <h1 className="text-secondary text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]  max-w-4xl">
              {highlightActiveWord({
                activeWord: "Beynəlxalq Yük Daşımaları",
                activeWordClassName: "text-primary relative",
                text: "Kometa ge – Gürcüstanda Beynəlxalq Yük Daşımaları və Logistika Şirkəti",
              })}
            </h1>
            <div className="border-l-[3px] border-secondary pl-6  max-w-3xl prose">
              <p>
                Kometa ge 19 illik təcrübəsi ilə Azərbaycandan dünyaya və
                dünyanın müxtəlif ölkələrindən Azərbaycana yük daşımaları təşkil
                edən peşəkar logistika şirkətidir. Şirkətimiz quru yolu, dəniz
                yolu, hava yolu, dəmir yolu, qruppaj, tam yük və ağır texnika
                daşımaları üzrə müştərilərə planlı, təhlükəsiz və səmərəli
                həllər təqdim edir.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                "2006-cı ildən fəaliyyətdə",
                "Bakı, Azərbaycan",
                "Beynəlxalq logistika həlləri",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                  <span className="text-sm font-medium text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-row flex-wrap lg:flex-col gap-4 lg:gap-6 lg:pt-20">
            {stats.map((stat, i) => (
              <StatCard
                value={stat.number}
                label={stat.label}
                key={i}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>

        <figure className="relative rounded-2xl overflow-hidden mt-8">
          <CustomImage
            src="https://res.cloudinary.com/da403zlyf/image/upload/v1781435252/ChatGPT_Image_Jun_14_2026_03_05_45_PM_rb8css.png"
            title="Logistics"
            width={1400}
            height={600}
            className="w-full h-75 sm:h-100 lg:h-125 object-cover"
            priority
          />
        </figure>
      </div>
    </section>
  );
}
