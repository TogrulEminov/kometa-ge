"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaBox,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
  FaShieldAlt,
  FaChartBar,
  FaArrowRight,
  FaTruckMoving,
  FaBoxOpen,
  FaWarehouse,
  FaPhoneAlt,
  FaStamp,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaDolly,
  FaPallet,
  FaBoxes,
  FaShip,
  FaPlane,
  FaPlaneDeparture,
  FaRocket,
  FaFileSignature,
  FaFileContract,
  FaHandHoldingUsd,
  FaAnchor,
  FaConfluence,
} from "react-icons/fa";

// ============================================
// TYPES
// ============================================
interface ServiceItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
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

interface FAQItem {
  question: string;
  answer: string;
}

// ============================================
// BRAND COLORS
// ============================================
const colors = {
  primary: "#b11226",
  secondary: "#1c1e29",
  tertiary: "#f2f2f2",
};

// ============================================
// DATA - FTL
// ============================================
const ftlData = {
  title: "FTL (Tam Maşın) Daşıma",
  subtitle: "Full Truck Load",
  description:
    "FTL yükdaşıma modeli iri həcmli yüklərin tam nəqliyyat vasitəsi ilə daşınması üçün nəzərdə tutulur. Bu modeldə nəqliyyat vasitəsi yalnız bir müştərinin yükü üçün ayrılır və çatdırılma prosesi daha birbaşa şəkildə həyata keçirilir.",
  image:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
  tags: [
    "İri həcmli yüklər",
    "Topdansatış",
    "Sənaye məhsulları",
    "Təcili çatdırılma",
    "Birbaşa marşrut",
    "Minimum boşaltma",
  ],
  advantages: [
    {
      title: "Birbaşa Çatdırılma",
      description:
        "Yük birbaşa təyinat nöqtəsinə çatdırılır, əlavə dayanacaq və boşaltma mərhələləri olmur.",
    },
    {
      title: "Sürətli Tranzit",
      description:
        "Digər yüklərin yüklənməsi və boşaldılması gözlənilmir, tranzit müddəti minimuma endirilir.",
    },
    {
      title: "Təhlükəsizlik",
      description:
        "Yük yalnız bir müştəriyə məxsus olduğu üçün qarışdırma və zədələnmə riski sıfıra endirilir.",
    },
    {
      title: "Çevik Planlama",
      description:
        "Yükləmə və boşaltma vaxtları müştərinin istəyinə uyğun təyin edilir.",
    },
  ],
  statistics: [
    { value: "12K+", label: "FTL Daşıma" },
    { value: "99%", label: "Vaxtında Çatdırılma" },
    { value: "35+", label: "Ölkə" },
    { value: "48h", label: "Ortalama Tranzit" },
  ],
  processSteps: [
    {
      number: "01",
      title: "Yük Analizi və Sifariş",
      description:
        "Müştərinin yükünün həcmi, çəkisi və xüsusiyyətləri analiz edilir. Uyğun nəqliyyat vasitəsi seçilir və sifariş təsdiqlənir.",
    },
    {
      number: "02",
      title: "Nəqliyyat Təyini",
      description:
        "Yükün xüsusiyyətlərinə uyğun optimal nəqliyyat vasitəsi təyin edilir və marşrut planlaşdırılır.",
    },
    {
      number: "03",
      title: "Birbaşa Yükləmə",
      description:
        "Yük müştərinin ünvanından birbaşa yüklənir və heç bir əlavə dayanacaq olmadan yola düşülür.",
    },
    {
      number: "04",
      title: "Təyinata Çatdırılma",
      description:
        "Yük birbaşa təyinat nöqtəsinə çatdırılır və müştərinin istədiyi vaxtda boşaldılır.",
    },
  ],
  faqs: [
    {
      question: "FTL daşıma hansı yüklər üçün uyğundur?",
      answer:
        "İri həcmli, ağır və dəyərli yüklər üçün optimal həldir. Sənaye avadanlıqları, topdansatış malları, mebel, elektronika və digər iri partiyalı yüklər FTL ilə daşınır.",
    },
    {
      question: "FTL daşımanın üstünlükləri nələrdir?",
      answer:
        "Birbaşa çatdırılma, sürətli tranzit, yüksək təhlükəsizlik, çevik planlama və minimum zədələnmə riski FTL-in əsas üstünlükləridir.",
    },
    {
      question: "FTL daşıma neçə gün çəkir?",
      answer:
        "Marşrutdan asılı olaraq Avropaya 3-5 gün, MDB ölkələrinə 2-4 gün, Türkiyəyə 2-3 gün çəkir.",
    },
    {
      question: "Hansı nəqliyyat vasitələri istifadə olunur?",
      answer:
        "Tentli tırlar, reef konteynerlər, açıq platformalar, silos tankerlər və xüsusi təyinatlı nəqliyyat vasitələri.",
    },
    {
      question: "FTL daşıma xərci necə hesablanır?",
      answer:
        "Xərc marşrut məsafəsinə, nəqliyyat vasitəsinin növünə, yükün xüsusiyyətlərinə və əlavə xidmətlərə görə hesablanır.",
    },
    {
      question: "GPS izləmə mövcuddurmu?",
      answer:
        "Bəli, bütün FTL daşımalarımızda real-time GPS izləmə sistemi aktivdir.",
    },
  ],
};

// ============================================
// DATA - LTL
// ============================================
const ltlData = {
  title: "LTL (Qruplaşdırılmış) Daşıma",
  subtitle: "Less Than Truck Load",
  description:
    "LTL yükdaşıma modeli kiçik və orta həcmli yüklərin daşınması üçün daha sərfəli logistika həllidir. Bu formatda bir neçə müştərinin yükləri eyni nəqliyyat vasitəsində daşınır və xərclər bölüşdürülür.",
  image:
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&fit=crop",
  tags: [
    "Kiçik bizneslər",
    "E-commerce",
    "Periodik göndərişlər",
    "Xərclərin bölüşdürülməsi",
    "Çevik həcm",
    "Anbar toplama",
  ],
  advantages: [
    {
      title: "Sərfəli Xərc",
      description:
        "Nəqliyyat xərcləri bir neçə müştəri arasında bölüşdürülərək, hər bir müştəri üçün optimal qiymət təmin edilir.",
    },
    {
      title: "Çevik Həcm",
      description:
        "Kiçik və orta həcmli yüklər üçün ideal həll, minimum 1 paletdən başlayaraq daşıma imkanı.",
    },
    {
      title: "Anbar İnteqrasiyası",
      description:
        "Yüklər anbarlarımızda toplanır, optimal marşrutda birləşdirilir və səmərəli daşınır.",
    },
    {
      title: "Tez-tez Göndəriş",
      description:
        "Periodik və kiçik həcmli göndərişlər üçün ideal, ehtiyac olduqda həftədə bir neçə dəfə daşıma imkanı.",
    },
  ],
  statistics: [
    { value: "8K+", label: "LTL Daşıma" },
    { value: "97%", label: "Vaxtında Çatdırılma" },
    { value: "40+", label: "Ölkə" },
    { value: "72h", label: "Ortalama Tranzit" },
  ],
  processSteps: [
    {
      number: "01",
      title: "Yük Toplama",
      description:
        "Müxtəlif müştərilərin yükləri anbarlarımızda toplanır və optimal birləşdirmə planı hazırlanır.",
    },
    {
      number: "02",
      title: "Anbar İdarəetməsi",
      description:
        "Yüklər kateqoriyaya, istiqamətə və çatdırılma vaxtına görə sistematik şəkildə saxlanılır.",
    },
    {
      number: "03",
      title: "Marşrut Optimallaşdırma",
      description:
        "Yüklər optimal marşrutda birləşdirilir və səmərəli daşıma planı hazırlanır.",
    },
    {
      number: "04",
      title: "Paylanmış Çatdırılma",
      description:
        "Yük marşrut üzrə ardıcıl olaraq hər müştərinin təyinat nöqtəsinə çatdırılır.",
    },
  ],
  faqs: [
    {
      question: "LTL daşıma hansı yüklər üçün uyğundur?",
      answer:
        "Kiçik və orta həcmli yüklər, e-commerce sifarişləri, nümunə məhsullar, kiçik partiyalı mallar və periodik göndərişlər üçün ideal həldir.",
    },
    {
      question: "LTL daşımanın minimum həcmi nə qədərdir?",
      answer:
        "Minimum 1 palet (təxminən 1 kub metr) ilə başlayaraq daşıma mümkündür. Maksimum həcm bir tırın 1/3-ü qədər ola bilər.",
    },
    {
      question: "LTL daşıma neçə gün çəkir?",
      answer:
        "Anbar toplama müddətini nəzərə alaraq, Avropaya 5-7 gün, MDB ölkələrinə 4-6 gün, Türkiyəyə 3-5 gün çəkir.",
    },
    {
      question: "Yüklər qarışdırılmır?",
      answer:
        "Xeyr, yüklər kateqoriyaya, təhlükəsizlik səviyyəsinə və istiqamətə görə ayrı-ayrılıqda saxlanılır və daşınır.",
    },
    {
      question: "LTL daşıma xərci necə hesablanır?",
      answer:
        "Xərc yükün həcminə, çəkisinə, marşruta və əlavə xidmətlərə görə hesablanır. Hər palet üçün ayrı qiymət təyin edilir.",
    },
    {
      question: "Anbar saxlama müddəti nə qədərdir?",
      answer:
        "Standart olaraq 3 gün pulsuz saxlama təklif edirik. Əlavə müddət üçün xüsusi tariflər mövcuddur.",
    },
  ],
};

// ============================================
// ALL SERVICES DATA
// ============================================
const allServices: ServiceItem[] = [
  {
    id: "1",
    icon: <FaTruck />,
    label: "Quru Yolu Daşıma",
    href: "/services/ground",
  },
  {
    id: "1-1",
    icon: <FaTruckMoving />,
    label: "FTL Daşıma",
    href: "/services/ftl",
    isActive: true,
  },
  {
    id: "1-2",
    icon: <FaBoxOpen />,
    label: "LTL Daşıma",
    href: "/services/ltl",
  },
];

// ============================================
// STICKY SIDEBAR
// ============================================
function StickyBar({ isFTL }: { isFTL: boolean }) {
  // Update active item based on isFTL prop
  const services = allServices.map((s) => ({
    ...s,
    isActive: isFTL ? s.id === "1-1" : s.id === "1-2",
  }));

  return (
    <div className="lg:sticky lg:top-25 space-y-6">
      {/* All Services */}
      <div
        className="rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: colors.secondary }}
      >
        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <span
            className="w-1 h-5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          Xidmətlərimiz
        </h3>
        <nav className="space-y-1">
          {services.map((service) => {
            const isChild = service.id.includes("-");
            return (
              <a
                key={service.id}
                href={service.href}
                className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  padding: isChild ? "10px 16px 10px 40px" : "10px 16px",
                  backgroundColor: service.isActive
                    ? colors.primary
                    : "transparent",
                  color: service.isActive
                    ? "#ffffff"
                    : isChild
                      ? "rgba(156,163,175,1)"
                      : "rgba(209,213,219,1)",
                }}
                onMouseEnter={(e) => {
                  if (!service.isActive) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!service.isActive) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = isChild
                      ? "rgba(156,163,175,1)"
                      : "rgba(209,213,219,1)";
                  }
                }}
              >
                <span className={isChild ? "text-sm" : "text-lg"}>
                  {service.icon}
                </span>
                <span className="flex-1">{service.label}</span>
                {service.isActive && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Contact CTA */}
      <div
        className="rounded-2xl p-6 shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, #8a0d1e)`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-white font-bold text-lg mb-2 relative z-10">
          Sualınız var?
        </h3>
        <p className="text-white/70 text-sm mb-5 relative z-10">
          Xidmətlərimiz haqqında ətraflı məlumat almaq üçün bizimlə əlaqə
          saxlayın.
        </p>
        <button
          className="w-full font-bold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 relative z-10"
          style={{
            backgroundColor: "#ffffff",
            color: colors.primary,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#f2f2f2")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#ffffff")
          }
        >
          <FaPhoneAlt className="w-4 h-4" />
          Bizimlə Əlaqə
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3
          className="font-bold text-lg mb-4"
          style={{ color: colors.secondary }}
        >
          Əlaqə
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <FaPhoneAlt className="w-4 h-4" />,
              text: "+994 12 123 45 67",
            },
            {
              icon: <FaEnvelope className="w-4 h-4" />,
              text: "info@kometa.ge",
            },
            {
              icon: <FaMapMarkerAlt className="w-4 h-4" />,
              text: "Bakı, Azərbaycan",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm"
              style={{ color: `${colors.secondary}99` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: colors.tertiary,
                  color: colors.primary,
                }}
              >
                {item.icon}
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div
        className="rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: colors.secondary }}
      >
        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
          Bizi İzləyin
        </h3>
        <div className="flex gap-3">
          {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map(
            (Icon, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) =>
                  ((
                    e.currentTarget as HTMLButtonElement
                  ).style.backgroundColor = colors.primary)
                }
                onMouseLeave={(e) =>
                  ((
                    e.currentTarget as HTMLButtonElement
                  ).style.backgroundColor = "rgba(255,255,255,0.1)")
                }
              >
                <Icon className="w-4 h-4" />
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SERVICE OVERVIEW
// ============================================
function ServiceOverview({ isFTL }: { isFTL: boolean }) {
  const data = isFTL ? ftlData : ltlData;

  return (
    <section id="overview" className="scroll-mt-8">
      <div className="mb-6">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          {data.subtitle}
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          {data.title}
        </h2>
        <p
          className="text-base leading-relaxed max-w-3xl"
          style={{ color: `${colors.secondary}99` }}
        >
          {data.description}
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-xl cursor-default transition-colors duration-300"
            style={{ color: `${colors.secondary}99` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.borderColor =
                `${colors.primary}4D`;
              (e.currentTarget as HTMLSpanElement).style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.borderColor =
                "#e5e7eb";
              (e.currentTarget as HTMLSpanElement).style.color =
                `${colors.secondary}99`;
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================
// ADVANTAGES
// ============================================
function Advantages({ isFTL }: { isFTL: boolean }) {
  const data = isFTL ? ftlData : ltlData;

  return (
    <section id="advantages" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Üstünlüklər
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          Niyə {isFTL ? "FTL" : "LTL"} Seçməlisiniz?
        </h2>
        <div
          className="w-16 h-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.advantages.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-start gap-6"
            style={{ borderColor: "#f3f4f6" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                `${colors.primary}33`)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                "#f3f4f6")
            }
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 transition-colors duration-300"
              style={{ backgroundColor: colors.secondary }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  colors.primary)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  colors.secondary)
              }
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3
                className="font-bold text-lg mb-2 transition-colors duration-300"
                style={{ color: colors.secondary }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: `${colors.secondary}99` }}
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// STATISTICS
// ============================================
function Statistics({ isFTL }: { isFTL: boolean }) {
  const data = isFTL ? ftlData : ltlData;

  return (
    <section id="statistics" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Rəqəmlərlə
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          {isFTL ? "FTL" : "LTL"} Uğurları
        </h2>
        <div
          className="w-16 h-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      <div
        className="rounded-2xl p-8"
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.statistics.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div
                className="text-sm font-medium flex items-center justify-center gap-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS
// ============================================
function Process({ isFTL }: { isFTL: boolean }) {
  const data = isFTL ? ftlData : ltlData;

  return (
    <section id="process" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Proses
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          {isFTL ? "FTL" : "LTL"} Daşıma Prosesi
        </h2>
        <div
          className="w-16 h-1 rounded-full mb-4"
          style={{ backgroundColor: colors.primary }}
        />
        <p
          className="leading-relaxed"
          style={{ color: `${colors.secondary}99` }}
        >
          {isFTL
            ? "FTL daşıma prosesi birbaşa və sürətli şəkildə həyata keçirilir. Yük birbaşa təyinata çatdırılır."
            : "LTL daşıma prosesi anbar toplama, marşrut optimallaşdırma və paylanmış çatdırılma mərhələlərindən ibarətdir."}
        </p>
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div
          className="absolute left-7 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, ${colors.primary}, ${colors.primary}4D, transparent)`,
          }}
        />

        <div className="space-y-8">
          {data.processSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex gap-6 pl-2"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10 shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 14px ${colors.primary}33`,
                }}
              >
                {step.number}
              </div>
              <div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex-1 transition-colors duration-300"
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    `${colors.primary}33`)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    "#f3f4f6")
                }
              >
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: colors.secondary }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${colors.secondary}99` }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================
function FAQ({ isFTL }: { isFTL: boolean }) {
  const data = isFTL ? ftlData : ltlData;

  return (
    <section id="faq" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Suallar
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          Tez-tez Soruşulan Suallar
        </h2>
        <div
          className="w-16 h-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      <div className="space-y-3">
        {data.faqs.map((faq, i) => (
          <details
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden"
          >
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
              <span
                className="font-bold text-base pr-4"
                style={{ color: colors.secondary }}
              >
                {faq.question}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-open:text-white"
                style={{
                  backgroundColor: colors.tertiary,
                  color: colors.secondary,
                }}
              >
                <style>{`
                  details[open] summary .faq-icon-${i} {
                    background-color: ${colors.primary} !important;
                    color: white !important;
                  }
                  details[open] summary .faq-icon-${i} svg {
                    transform: rotate(180deg);
                  }
                `}</style>
                <span
                  className={`faq-icon-${i} w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300`}
                  style={{
                    backgroundColor: colors.tertiary,
                    color: colors.secondary,
                  }}
                >
                  <FaChevronDown className="w-4 h-4 transition-transform duration-300" />
                </span>
              </div>
            </summary>
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-100 pt-4">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${colors.secondary}99` }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ============================================
// OTHER SERVICE CARD
// ============================================
function OtherService({ isFTL }: { isFTL: boolean }) {
  const otherData = isFTL ? ltlData : ftlData;
  const otherHref = isFTL ? "/services/ltl" : "/services/ftl";
  const otherLabel = isFTL ? "LTL" : "FTL";

  return (
    <section id="other-service" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Digər Model
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          {otherLabel} Daşıma ilə də maraqlana bilərsiniz
        </h2>
        <div
          className="w-16 h-1 rounded-full mb-4"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      <a
        href={otherHref}
        className="group block relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        <img
          src={otherData.image}
          alt={otherData.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${colors.secondary} 0%, ${colors.secondary}80 50%, transparent 100%)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-2xl mb-2 transition-colors duration-300 group-hover:text-red-400">
                {otherData.title}
              </h3>
              <p className="text-white/70 text-sm max-w-xl">
                {otherData.description}
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  colors.primary)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
            >
              <FaArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

// ============================================
// PARENT SERVICE CARD
// ============================================
function ParentService() {
  return (
    <section id="parent-service" className="scroll-mt-8 mt-16 mb-16">
      <div className="mb-8">
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ color: colors.primary }}
        >
          Ana Xidmət
        </span>
        <h2
          className="text-3xl font-bold mt-2 mb-4"
          style={{ color: colors.secondary }}
        >
          Aid Olduğu Xidmət
        </h2>
        <div
          className="w-16 h-1 rounded-full mb-4"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      <a
        href="/services/ground"
        className="group block rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
        style={{ backgroundColor: colors.secondary }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: `${colors.primary}33`,
                color: colors.primary,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  colors.primary;
                (e.currentTarget as HTMLDivElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  `${colors.primary}33`;
                (e.currentTarget as HTMLDivElement).style.color =
                  colors.primary;
              }}
            >
              <FaTruck className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">
                Quru Yolu Daşıma
              </h3>
              <p
                className="text-sm max-w-lg"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                FTL və LTL daşıma xidmətlərimiz Quru Yolu Daşıma kateqoriyasının
                tərkib hissəsidir. Bütün quru yolu daşıma həlləri bir arada.
              </p>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                colors.primary)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                "rgba(255,255,255,0.1)")
            }
          >
            <FaArrowRight className="w-6 h-6" />
          </div>
        </div>
      </a>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function FTL_LTL_Page({ isFTL = true }: { isFTL?: boolean }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.tertiary }}>
      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - 30% */}
          <aside className="lg:w-[30%]  flex-shrink-0 lg:order-1 order-2">
            <StickyBar isFTL={isFTL} />
          </aside>

          {/* Right Content - 70% */}
          <div className="lg:w-[70%] min-w-0 lg:order-2 order-1">
            <ServiceOverview isFTL={isFTL} />
            <Advantages isFTL={isFTL} />
            <Statistics isFTL={isFTL} />
            <Process isFTL={isFTL} />
            <FAQ isFTL={isFTL} />
            <OtherService isFTL={isFTL} />
            <ParentService />
          </div>
        </div>
      </div>
    </div>
  );
}
