"use client";

import { useState, useEffect, useRef } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Yükümün çatdırılma vaxtını necə öyrənə bilərəm?",
    answer:
      "Hər bir daşınma üçün fərdi izləmə kodu təqdim edirik. Bu kodu saytımızın Yük İzlə bölməsinə daxil edərək, yükünüzün real vaxtda yerini və təxmini çatdırılma tarixini görə bilərsiniz. Əlavə olaraq, müştəri xidmətlərimizə zəng edərək də məlumat ala bilərsiniz.",
  },
  {
    question: "Hansı növ yükləri daşıya bilərsiniz?",
    answer:
      "Quru yolu, dəniz yolu, hava yolu və dəmiryolu ilə demək olar ki, bütün növ yükləri daşıya bilərik: konteyner yükləri, ağır texnika (buldozer, ekskavator), sənaye avadanlıqları, təhlükəli yüklər (ADR), soyuducu tələb edən yüklər və xüsusi ölçülü yüklər.",
  },
  {
    question: "Daşınma qiyməti necə hesablanır?",
    answer:
      "Daşınma qiyməti bir neçə amildən asılıdır: yükün növü və çəkisi, marşrut (mənşə və təyinat), daşınma növü (quru, dəniz, hava, dəmiryolu), gömrük rüsumları və əlavə xidmətlər (sığorta, anbarlaşdırma). Ətraflı qiymət üçün Təklif Al düyməsinə klikləyin və ya bizimlə əlaqə saxlayın.",
  },
  {
    question: "Yüküm sığortalanırmı?",
    answer:
      "Bəli, bütün daşınmalarımızda kargo sığortası təklif edirik. Standart sığorta yüklərin dəyərinin 100%-ni əhatə edir. Xüsusi yüklər üçün (qiymətli metallar, incəsənət əsərləri və s.) fərdi sığorta planları da təqdim edirik.",
  },
  {
    question: "Gömrük rəsmiləşdirməsini siz edirsiniz?",
    answer:
      "Bəli, gömrük broker xidmətlərimiz mövcuddur. Peşəkar komandamız bütün gömrük sənədlərinin hazırlanması, rüsumların hesablanması və rəsmiləşdirmə prosesini həyata keçirir. Bu, sizin vaxtınıza və sərvətinizə qənaət edir.",
  },
  {
    question: "Minimum daşınma həcmi varmı?",
    answer:
      "Minimum həcm tələbi yoxdur. Həm qruplaj (LCL) yüklər, həm də tam konteyner (FCL) yüklər qəbul edilir. Hətta kiçik bağlamalar üçün belə xidmət göstəririk. Ən optimal variantı seçməyinizdə sizə kömək edərik.",
  },
  {
    question: "Necə sifariş verə bilərəm?",
    answer:
      'Sifariş vermək çox sadədir: 1) Saytımızda "Təklif Al" düyməsinə klikləyin, 2) Yükünüz haqqında məlumatları doldurun, 3) Əlaqə məlumatlarınızı qeyd edin. 24 saat ərzində mütəxəssislərimiz sizinlə əlaqə saxlayacaq. Və ya birbaşa +994 12 123 45 67 nömrəsinə zəng edə bilərsiniz.',
  },
];
export default function FAQSection() {
  return (
    <div id="section-faq" className="reveal">
      <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        05 / FAQ
      </p>
      <h2 className="font-display text-4xl font-bold mb-6">
        Tez-tez verilən suallar
      </h2>
      <p className="text-gray-500 leading-relaxed text-lg mb-10">
        Müştərilərimizin ən çox soruşduğu suallar və cavabları.
      </p>

      <div className="space-y-0">
        {faqItems.map((item, index) => (
          <details
            key={index}
            className={`group border-b border-gray-200 ${index === 0 ? "border-t" : ""}`}
          >
            <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
              <span className="font-semibold text-secondary pr-8">
                {item.question}
              </span>
              <svg
                className="w-5 h-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </summary>
            <p className="text-gray-500 leading-relaxed pb-6">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
