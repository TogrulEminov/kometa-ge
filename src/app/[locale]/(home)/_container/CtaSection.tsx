"use client";

import { Button } from "antd";
import {
  SendOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { FaPhoneAlt } from "react-icons/fa";
import SectionContentComponent from "@/components/SectionContent";

export default function CTASection() {
  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      label: "Phone",
      value: "+994 12 345 67 89",
      href: "tel:+994123456789",
    },
    {
      icon: <MailOutlined />,
      label: "Email",
      value: "info@kometa-ge.az",
      href: "mailto:info@kometa-ge.az",
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Address",
      value: "Heydar Aliyev Ave., Baku",
      href: "#",
    },
    {
      icon: <ClockCircleOutlined />,
      label: "Working Hours",
      value: "Mon - Fri 09:00 - 18:00",
      href: "#",
    },
  ];

  const benefits = [
    "Free consultation",
    "24/7 support service",
    "Real-time tracking",
    "Affordable pricing offers",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionContentComponent
          subTitle={"Contact us"}
          title="Still Have Questions?"
          type="vertical"
          description={
            "Our team is ready to answer all your questions about logistics and freight services."
          }
        />

        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left — Contact Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-[#1c1e29]/[0.06] bg-[#f2f2f2] p-6 transition-all duration-300 hover:border-[#b11226]/10 hover:bg-white hover:shadow-xl hover:shadow-[#b11226]/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b11226]/[0.08] text-lg text-[#b11226] transition-all duration-300 group-hover:bg-[#b11226] group-hover:text-white group-hover:scale-105">
                  {item.icon}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1c1e29]/30">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1c1e29] leading-snug">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Right — Dark CTA Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1c1e29] p-8 sm:p-10">
            {/* Background glow effects */}
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#b11226]/[0.12] blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#b11226]/[0.06] blur-[80px]" />
            <div className="absolute top-0 right-0 h-px w-full bg-gradient-to-l from-[#b11226]/20 via-transparent to-transparent" />

            <div className="relative">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b11226] text-2xl text-white shadow-lg shadow-[#b11226]/20">
                <FaPhoneAlt />
              </div>

              <h3 className="mt-7 text-2xl font-black text-white leading-tight">
                Request a Callback
              </h3>

              <p className="mt-3 text-sm leading-[1.7] text-white/40">
                Leave your phone number and our team will contact you within 24
                hours. Fast, reliable and professional support guaranteed.
              </p>

              {/* CTA Button */}
              <Button
                type="primary"
                size="large"
                className="!mt-10 !h-14 !w-full !rounded-xl !bg-[#b11226] !text-sm !font-bold uppercase tracking-[0.08em] !text-white hover:!bg-[#8f0e1f] hover:!shadow-xl hover:!shadow-[#b11226]/20 transition-all duration-300"
              >
                <SendOutlined className="mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
