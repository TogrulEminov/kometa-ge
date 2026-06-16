"use client";

import CustomImage from "@/globalElement/CustomImage";
import { Link } from "@/i18n/navigation";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import InteractiveRouteMap, { getCountryByIso } from "./InteractiveRouteMap";

const FROM_ISO = "KAZ";
const TO_ISO = "AZE";
const fromCountry = getCountryByIso(FROM_ISO);
const toCountry = getCountryByIso(TO_ISO);

const routeData = {
  fromIso: FROM_ISO,
  toIso: TO_ISO,
  routingMap: {
    from: fromCountry?.name ?? FROM_ISO,
    to: toCountry?.name ?? TO_ISO,
  },
  title: "Turkey to Azerbaijan",
  description:
    "Multimodal freight transportation from Kazakhstan to Azerbaijan via ground and sea routes. Optimal logistics solution with Caspian Sea crossing through the port of Aktau to Baku.",
  features: [
    "Ground + Short sea crossing",
    "Weekly regular departures",
    "GPS tracking system",
    "Customs declaration support",
  ],
  image:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80",
};

function LeftSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-secondary font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Freight Directions
        </h3>
        <div className="space-y-2">
          <div className="px-4 py-3.5 rounded-xl bg-primary text-white shadow-lg text-sm font-medium">
            Kazakhstan → Azerbaijan
          </div>
          <div className="px-4 py-3.5 rounded-xl text-secondary/50 text-sm font-medium">
            China → Azerbaijan
          </div>
          <div className="px-4 py-3.5 rounded-xl text-secondary/50 text-sm font-medium">
            China → Europe
          </div>
          <div className="px-4 py-3.5 rounded-xl text-secondary/50 text-sm font-medium">
            Central Asia → Azerbaijan
          </div>
          <div className="px-4 py-3.5 rounded-xl text-secondary/50 text-sm font-medium">
            Georgia → Azerbaijan
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary to-[#8a0d1e] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <h3 className="text-white font-bold text-lg mb-2 relative z-10">
          Need a Quote?
        </h3>
        <p className="text-white/70 text-sm mb-5 relative z-10">
          Contact us for detailed information about our freight services and get
          a custom quote.
        </p>
        <a
          href="/contact"
          className="w-full flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-tertiary transition-colors duration-300 relative z-10"
        >
          <FaPhoneAlt className="w-4 h-4" />
          Contact Us
        </a>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
        <h3 className="text-secondary font-bold text-lg mb-4">Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaPhoneAlt className="w-4 h-4" />
            </div>
            <a href="tel:+994552624037" className="hover:underline">
              +994 55 262 40 37
            </a>
          </div>
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaEnvelope className="w-4 h-4" />
            </div>
            <a href="mailto:info@kometa.ge" className="hover:underline">
              info@kometa.ge
            </a>
          </div>
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaMapMarkerAlt className="w-4 h-4" />
            </div>
            <span>Baku, Azerbaijan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteDetail() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <CustomImage
          width={1200}
          height={500}
          className="w-full h-80 object-cover"
          src={routeData.image}
          title={`${routeData.routingMap.from} to ${routeData.routingMap.to}`}
        />
      </div>

      <div>
        <span className="text-primary text-sm font-bold tracking-wider uppercase">
          Freight Transportation
        </span>
        <h1 className="text-secondary text-3xl md:text-4xl font-bold mt-2">
          {routeData.title}
        </h1>
        <div className="w-16 h-1 bg-primary rounded-full mt-4" />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-secondary font-bold text-xl mb-4">
          About This Route
        </h2>
        <article className="text-secondary/70 leading-relaxed">
          {routeData.description}
        </article>
      </div>

      <InteractiveRouteMap fromIso={FROM_ISO} toIso={TO_ISO} />

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-secondary font-bold text-xl mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routeData.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-tertiary rounded-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-secondary/80 text-sm font-medium leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-secondary font-bold text-xl mb-6">
          Why This Route?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-tertiary rounded-2xl">
            <h3 className="text-secondary font-bold text-base mb-2">
              Optimal Transit Time
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              The multimodal approach combining ground and sea transport ensures
              the most efficient delivery timeline for this corridor.
            </p>
          </div>
          <div className="p-6 bg-tertiary rounded-2xl">
            <h3 className="text-secondary font-bold text-base mb-2">
              Cost Efficiency
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              Strategic routing through the Caspian Sea minimizes overall
              transportation costs while maintaining service quality.
            </p>
          </div>
          <div className="p-6 bg-tertiary rounded-2xl">
            <h3 className="text-secondary font-bold text-base mb-2">
              Reliable Infrastructure
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              Well-established port facilities at Aktau and Baku ensure smooth
              cargo handling and minimal delays.
            </p>
          </div>
          <div className="p-6 bg-tertiary rounded-2xl">
            <h3 className="text-secondary font-bold text-base mb-2">
              Full Customs Support
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              Our team handles all customs documentation and clearance
              procedures at every border crossing.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-secondary font-bold text-xl mb-6">
          Common Questions
        </h2>
        <div className="space-y-4">
          <details className="border border-gray-100 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
              <span className="text-secondary font-bold text-sm">
                What types of cargo can be transported on this route?
              </span>
              <span className="text-primary text-lg font-bold">+</span>
            </summary>
            <div className="px-5 pb-5">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-secondary/60 text-sm leading-relaxed">
                  We handle general cargo, refrigerated goods, oversized loads,
                  containers, and bulk materials. Special arrangements available
                  for hazardous materials.
                </p>
              </div>
            </div>
          </details>
          <details className="border border-gray-100 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
              <span className="text-secondary font-bold text-sm">
                How is cargo tracked during transit?
              </span>
              <span className="text-primary text-lg font-bold">+</span>
            </summary>
            <div className="px-5 pb-5">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-secondary/60 text-sm leading-relaxed">
                  All shipments are equipped with GPS tracking devices. Clients
                  receive real-time updates via our online portal throughout the
                  journey.
                </p>
              </div>
            </div>
          </details>
          <details className="border border-gray-100 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
              <span className="text-secondary font-bold text-sm">
                What documents are required for customs clearance?
              </span>
              <span className="text-primary text-lg font-bold">+</span>
            </summary>
            <div className="px-5 pb-5">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-secondary/60 text-sm leading-relaxed">
                  Required documents include commercial invoice, packing list,
                  bill of lading, certificate of origin, and customs
                  declaration. Our team prepares all necessary paperwork.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-8 text-center">
        <h2 className="text-white text-2xl font-bold mb-3">Ready to Ship?</h2>
        <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
          Get a personalized quote for your freight transportation needs on this
          route.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            className="bg-primary cursor-pointer text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition-colors duration-300"
          >
            Get a Quote
          </button>
          <Link
            href={"/contact"}
            className="bg-white hover:bg-white/90 text-secondary font-bold py-4 px-8 rounded-xl hover:bg-tertiary transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DirectionsDetailContainer() {
  return (
    <div className="lg:py-20 py-10 bg-tertiary min-h-screen">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-[30%] shrink-0 lg:order-1 order-2">
            <div className="lg:sticky lg:top-25">
              <LeftSidebar />
            </div>
          </aside>

          <div className="lg:w-[70%] lg:min-w-0 lg:order-2 order-1">
            <RouteDetail />
          </div>
        </div>
      </div>
    </div>
  );
}
