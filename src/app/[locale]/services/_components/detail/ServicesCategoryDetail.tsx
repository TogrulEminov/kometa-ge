"use client";

import { useState } from "react";
import {
  FaTruck,
  FaShip,
  FaPlane,
  FaBox,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
  FaShieldAlt,
  FaCheckCircle,
  FaChartBar,
  FaTruckMoving,
  FaBoxOpen,
  FaWarehouse,
  FaAnchor,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import CustomImage from "@/globalElement/CustomImage";

// ============================================
// TYPES
// ============================================
interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  children?: ServiceItem[];
}

interface AdvantageItem {
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface RelatedService {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}

// ============================================
// DATA
// ============================================
const allServices: ServiceItem[] = [
  {
    id: "1",
    icon: <FaTruck />,
    label: "Quru Yolu Daşıma",
    href: "#",
    children: [
      {
        id: "1-1",
        icon: <FaTruckMoving />,
        label: "FTL Daşıma",
        href: "/services/ftl",
      },
      {
        id: "1-2",
        icon: <FaBoxOpen />,
        label: "LTL Daşıma",
        href: "/services/ltl",
      },
    ],
  },
  { id: "2", icon: <FaShip />, label: "Dəniz Daşıma", href: "/services/sea" },
  { id: "3", icon: <FaPlane />, label: "Hava Yükü", href: "/services/air" },
];

// Üstünlüklər - 1 eyni ikon
const advantages: AdvantageItem[] = [
  {
    title: "Qlobal Şəbəkə",
    description:
      "150+ ölkədə fəaliyyət göstərən geniş tərəfdaş şəbəkəmiz ilə hər növ yükü istənilən nöqtəyə çatdırırıq.",
  },
  {
    title: "Vaxtında Çatdırılma",
    description:
      "99.2% vaxtında çatdırılma nisbətimiz ilə sizin biznes proseslərinizi dayanmadan davam etdiririk.",
  },
  {
    title: "Təhlükəsizlik Zəmanəti",
    description:
      "GPS izləmə sistemi və 24/7 təhlükəsizlik nəzarəti ilə yükünüzün təhlükəsizliyinə tam zəmanət veririk.",
  },
  {
    title: "Peşəkar Komanda",
    description:
      "20+ illik təcrübəyə malik logistika mütəxəssislərimiz hər mərhələdə yanınızdadır.",
  },
];

// Statistika - 1 eyni ikon
const statistics: StatItem[] = [
  { value: "15K+", label: "Uğurlu Daşıma" },
  { value: "98%", label: "Məmnun Müştəri" },
  { value: "45+", label: "Ölkə" },
  { value: "24/7", label: "Dəstək" },
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Sorğu və Marşrut Analizi",
    description:
      "İlk mərhələdə yükün növü, həcmi, çəkisi, istiqaməti və çatdırılma müddəti analiz edilir. Bu məlumatlar əsasında uyğun logistika modeli və nəqliyyat həlli müəyyən olunur.",
  },
  {
    number: "02",
    title: "Qiymətləndirmə və Planlama",
    description:
      "Marşrut məsafəsi, tranzit müddəti, gömrük keçidləri və yük xüsusiyyətləri nəzərə alınaraq logistika planı hazırlanır. Xərclərin optimallaşdırılması və daşınmanın daha stabil idarə olunması üçün vacibdir.",
  },
  {
    number: "03",
    title: "Yükləmə və Koordinasiya",
    description:
      "Yük beynəlxalq daşınma standartlarına uyğun şəkildə nəqliyyat vasitəsinə yerləşdirilir. Daşınma boyunca operativ logistika koordinasiyası həyata keçirilir.",
  },
  {
    number: "04",
    title: "Çatdırılma və GPS İzləmə",
    description:
      "Daşınma prosesi ərzində yük GPS sistemi vasitəsilə izlənilir və təyin olunmuş marşrut üzrə təyinat nöqtəsinə çatdırılır. Müştərilər daşınmanın statusu haqqında operativ məlumat əldə edə bilir.",
  },
];

const relatedServices: RelatedService[] = [
  {
    icon: <FaShip className="w-5 h-5" />,
    title: "Dəniz Daşıma",
    desc: "Beynəlxalq dəniz yolu ilə konteyner və bulk yüklərin daşınması",
    href: "/services/sea",
  },
  {
    icon: <FaPlane className="w-5 h-5" />,
    title: "Hava Yükü",
    desc: "Təcili və yüksək dəyərli yüklər üçün sürətli hava daşıma",
    href: "/services/air",
  },
  {
    icon: <FaWarehouse className="w-5 h-5" />,
    title: "Anbar Xidməti",
    desc: "Yüksək təhlükəsizlikli anbarlarda saxlama və paylama",
    href: "/services/warehouse",
  },
  {
    icon: <FaBoxOpen className="w-5 h-5" />,
    title: "Paketləmə",
    desc: "Yüklərin beynəlxalq standartlara uyğun paketlənməsi",
    href: "/services/packaging",
  },
];

// ============================================
// STICKY SIDEBAR
// ============================================
function StickyBar() {
  const [expandedService, setExpandedService] = useState<string | null>("1");
  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="lg:sticky lg:top-25 space-y-6">
      {/* All Services */}
      <div className="bg-secondary rounded-2xl p-6 shadow-xl">
        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Xidmətlərimiz
        </h3>
        <nav className="space-y-1">
          {allServices.map((service) => (
            <div key={service.id}>
              <button
                onClick={() => {
                  if (service.children) {
                    toggleService(service.id);
                  } else {
                    window.location.href = service.href;
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  expandedService === service.id
                    ? "bg-primary text-white  shadow-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{service.icon}</span>
                <span className="flex-1 text-left">{service.label}</span>
                {service.children && (
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      expandedService === service.id
                        ? "-rotate-180"
                        : "-rotate-90"
                    }`}
                  />
                )}
                {!service.children && (
                  <FaChevronRight className="w-3 h-3 opacity-50" />
                )}
              </button>

              {service.children && expandedService === service.id && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/30 pl-4">
                  {service.children.map((child) => (
                    <a
                      key={child.id}
                      href={child.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      <span className="text-base">{child.icon}</span>
                      <span>{child.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Contact CTA */}
      <div className="bg-linear-to-br from-primary to-[#8a0d1e] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-white font-bold text-lg mb-2 relative z-10">
          Sualınız var?
        </h3>
        <p className="text-white/70 text-sm mb-5 relative z-10">
          Xidmətlərimiz haqqında ətraflı məlumat almaq üçün bizimlə əlaqə
          saxlayın.
        </p>
        <button className="w-full bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-tertiary transition-colors duration-300 flex items-center justify-center gap-2 relative z-10">
          <FaPhoneAlt className="w-4 h-4" />
          Bizimlə Əlaqə
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl p-6  border border-gray-100">
        <h3 className="text-secondary font-bold text-lg mb-4">Əlaqə</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary">
              <FaPhoneAlt className="w-4 h-4" />
            </div>
            <span>+994 12 123 45 67</span>
          </div>
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary">
              <FaEnvelope className="w-4 h-4" />
            </div>
            <span>info@kometa.ge</span>
          </div>
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary">
              <FaMapMarkerAlt className="w-4 h-4" />
            </div>
            <span>Bakı, Azərbaycan</span>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-secondary rounded-2xl p-6 shadow-xl">
        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
          Bizi İzləyin
        </h3>
        <div className="flex gap-3">
          {[FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe].map((Icon, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SERVICE OVERVIEW SECTION
// ============================================
function ServiceOverview() {
  return (
    <div id="overview" className="scroll-mt-8">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Xidmət Haqqında
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Quru Yolu Daşıma Xidməti
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="prose prose-lg max-w-none text-secondary/70 leading-relaxed mb-8">
        <p className="mb-4">
          Profi Transport müxtəlif kateqoriyalara aid yüklərin beynəlxalq quru
          yolu ilə təhlükəsiz və planlı şəkildə daşınmasını təşkil edir. Yükün
          növü, həcmi, çəkisi və çatdırılma müddəti nəzərə alınaraq uyğun
          logistika modeli seçilir.
        </p>
        <p>
          Beynəlxalq daşınma prosesində düzgün nəqliyyat həllinin seçilməsi həm
          logistika xərclərinə, həm də çatdırılma sürətinə birbaşa təsir
          göstərir. Şirkətimiz müxtəlif sahələr üzrə fəaliyyət göstərən
          bizneslər üçün fərdi logistika yanaşması tətbiq edir.
        </p>
      </div>

      <CustomImage
        width={1200}
        title=""
        height={600}
        className="max-w-full lg:h-100 object-cover rounded-lg"
        src={
          "https://i.pinimg.com/736x/b5/4e/5f/b54e5f9002b0cfe779a82ca633ca4bca.jpg"
        }
      />
    </div>
  );
}

// ============================================
// ADVANTAGES SECTION - 1 EYNI IKON
// ============================================
function Advantages() {
  return (
    <div id="advantages" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Üstünlüklərimiz
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Niyə Bizi Seçməlisiniz?
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advantages.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100   transition-all duration-300 group"
          >
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
              <FaCheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-secondary font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STATISTICS SECTION - 1 EYNI IKON
// ============================================
function Statistics() {
  return (
    <div id="statistics" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Rəqəmlərlə
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Uğurlarımız
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statistics.map((stat, i) => (
          <div
            key={i}
            className="bg-secondary rounded-2xl p-6 text-center group hover:bg-primary transition-colors duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mx-auto mb-3 group-hover:bg-white/20 transition-colors duration-300">
              <FaChartBar className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-white/60 text-xs font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PROCESS SECTION
// ============================================
function Process() {
  return (
    <div id="process" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Proses
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Quru Yolu Daşıma Prosesi Necə İşləyir?
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-4" />
        <p className="text-secondary/60 leading-relaxed">
          Quru yolu ilə beynəlxalq yükdaşıma prosesi bir neçə mərhələdən
          ibarətdir və hər mərhələ logistika təhlükəsizliyi və əməliyyat
          səmərəliliyi nəzərə alınaraq idarə olunur.
        </p>
      </div>

      <div className="space-y-6">
        {processSteps.map((step, i) => (
          <div key={i} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg  shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>
              {i < processSteps.length - 1 && (
                <div className="w-0.5 flex-1 bg-linear-to-b from-primary/30 to-transparent mt-4" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h3 className="text-secondary font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-secondary/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// FAQ SECTION (details/summary ilə)
// ============================================
function FAQ() {
  const faqData = [
    {
      question: "FTL və LTL arasında fərq nədir?",
      answer:
        "FTL (Full Truck Load) tam yük daşımasıdır - bir nəqliyyat vasitəsi yalnız bir müştərinin yükü üçün ayrılır. LTL (Less Than Truck Load) isə qruplaşdırılmış daşımadır - bir neçə müştərinin yükləri eyni vasitədə daşınır və xərclər bölüşdürülür.",
    },
    {
      question: "Quru yolu ilə hansı ölkələrə yük daşınır?",
      answer:
        "Avropa, MDB, Orta Asiya və Türkiyə istiqamətlərində müntəzəm xətlərimiz fəaliyyət göstərir. Xüsusi istiqamətlər üçün fərdi həllər təklif edirik.",
    },
    {
      question: "Yük izləmə sistemi mövcuddur?",
      answer:
        "Bəli, bütün yüklərimiz real-time GPS izləmə sistemi ilə təchiz edilib. Müştəri panelimizdən 24/7 yükünüzün yerini və statusunu izləyə bilərsiniz.",
    },
    {
      question: "GPS izləmə sistemi mövcuddurmu?",
      answer:
        "Hər bir nəqliyyat vasitəmizdə peşəkar GPS izləmə cihazları quraşdırılıb. Mobil tətbiqimiz vasitəsilə istədiyiniz vaxt yükünüzün dəqiq koordinatlarını görə bilərsiniz.",
    },
    {
      question: "Gömrük prosedurları necə idarə olunur?",
      answer:
        "Özəl gömrük bəyanətçilərimiz bütün sənədləşmə və rəsmiləşdirmə prosesini həyata keçirir. Gömrük yoxlanışları və vergi hesablamaları tam şəkildə bizim tərəfimizdən idarə olunur.",
    },
    {
      question: "Çatdırılma müddəti nədən asılıdır?",
      answer:
        "Çatdırılma müddəti marşrutun məsafəsindən, gömrük prosedurlarının müddətindən, hava şəraitindən və yükün növündən asılıdır. Hər bir sifariş üçün dəqiq tarix aralığı təqdim edirik.",
    },
  ];

  return (
    <div id="faq" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Suallar
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Tez-tez Soruşulan Suallar
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="space-y-3">
        {faqData.map((faq, i) => (
          <details
            key={i}
            className="bg-white rounded-2xl border border-gray-100 group overflow-hidden"
          >
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
              <span className="text-secondary font-bold text-base pr-4">
                {faq.question}
              </span>
              <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-secondary group-open:bg-primary group-open:text-white transition-all duration-300 shrink-0">
                <FaChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
              </div>
            </summary>
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-secondary/60 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ============================================
// RELATED SERVICES SECTION
// ============================================
function RelatedServices() {
  return (
    <div id="related" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Digər Xidmətlər
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          Əlaqəli Xidmətlər
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedServices.map((service, i) => (
          <Link
            key={i}
            href={`/servies/${service.href}`}
            className="group bg-white rounded-2xl p-5  border border-gray-100 hover:border-primary/20  transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
              {service.icon}
            </div>
            <div>
              <h3 className="text-secondary font-bold text-base mb-1 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-secondary/50 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================
// FTL / LTL SECTION - EN AŞAĞIDA
// ============================================
function FTL_LTL_Section() {
  return (
    <div id="ftl-ltl" className="scroll-mt-8 mt-16 mb-16">
      <div className="mb-8">
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Daşıma Modelləri
        </span>
        <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
          FTL və LTL Daşıma
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-4" />
        <p className="text-secondary/60 leading-relaxed">
          Profi Transport müxtəlif kateqoriyalara aid yüklərin beynəlxalq quru
          yolu ilə təhlükəsiz və planlı şəkildə daşınmasını təşkil edir. Yükün
          növü, həcmi, çəkisi və çatdırılma müddəti nəzərə alınaraq uyğun
          logistika modeli seçilir.
        </p>
      </div>

      <div className="space-y-6">
        {/* FTL */}
        <Link
          href={"/services/road/ftl"}
          className="bg-white block rounded-2xl p-6  border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <FaTruckMoving className="size-7" />
            </div>
            <div>
              <h3 className="text-secondary font-bold text-xl mb-3">
                FTL (Tam Maşın) Daşıma
              </h3>
              <p className="text-secondary/60 text-sm leading-relaxed">
                FTL yükdaşıma modeli iri həcmli yüklərin tam nəqliyyat vasitəsi
                ilə daşınması üçün nəzərdə tutulur. Bu modeldə nəqliyyat
                vasitəsi yalnız bir müştərinin yükü üçün ayrılır və çatdırılma
                prosesi daha birbaşa şəkildə həyata keçirilir. FTL daşımalar
                xüsusilə: iri partiyalı məhsullar, topdansatış yükləri, sənaye
                məhsulları, sabit tədarük zənciri tələb edən bizneslər üçün
                uyğun hesab olunur. Bu model əlavə yükləmə və boşaltma
                mərhələlərinin minimuma endirilməsinə imkan yaratdığı üçün
                tranzit müddəti daha stabil olur.
              </p>
            </div>
          </div>
        </Link>

        {/* LTL */}
        <Link
          href={"/services/road/ltl"}
          className="bg-white block rounded-2xl p-6  border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <FaBoxOpen className="size-7" />
            </div>
            <div>
              <h3 className="text-secondary font-bold text-xl mb-3">
                LTL (Qruplaşdırılmış) Daşıma
              </h3>
              <p className="text-secondary/60 text-sm leading-relaxed">
                LTL yükdaşıma modeli kiçik və orta həcmli yüklərin daşınması
                üçün daha sərfəli logistika həllidir. Bu formatda bir neçə
                müştərinin yükləri eyni nəqliyyat vasitəsində daşınır və
                logistika xərcləri bölüşdürülür. LTL daşımalar: kiçik bizneslər,
                e-commerce göndərişləri, az həcmli kommersiya yükləri, periodik
                göndərişlər üçün optimal seçim hesab olunur. Bu yanaşma
                logistika xərclərinin optimallaşdırılmasına və daha çevik
                daşınma imkanlarının yaradılmasına kömək edir.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ServicesCategoryDetail() {
  return (
    <div className="lg:py-20 py-10 bg-tertiary">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-[30%] shrink-0 lg:order-1 order-2">
            <StickyBar />
          </aside>
          <div className="lg:w-[70%] lg:min-w-0 lg:order-2 order-1">
            <ServiceOverview />
            <Advantages />
            <Statistics />
            <Process />
            <FAQ />
            <RelatedServices />
            <FTL_LTL_Section />
          </div>
        </div>
      </div>
    </div>
  );
}
