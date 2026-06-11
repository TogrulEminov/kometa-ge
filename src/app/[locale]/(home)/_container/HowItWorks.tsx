import CustomImage from "@/globalElement/CustomImage";

const steps = [
  {
    id: 1,
    title: "SUBMIT YOUR SHIPMENT REQUEST",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.",
  },
  {
    id: 2,
    title: "WE PICK UP YOUR PACKAGE",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.",
  },
  {
    id: 3,
    title: "REAL-TIME TRACKING IN TRANSIT",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.",
  },
  {
    id: 4,
    title: "SAFE DELIVERY TO DESTINATION",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.",
  },
  {
    id: 5,
    title: "CONFIRMATION & FEEDBACK",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.",
  },
];

export default function HowItWorksScroll() {
  return (
    <section className="relative pb-10 lg:pb-20">
      <div className="w-full container">
        {/* TOP: Full-width Image */}
        <div className="relative w-full h-[220px] md:h-[320px] rounded-2xl overflow-hidden">
          <CustomImage
            src="https://res.cloudinary.com/da403zlyf/image/upload/v1781197854/73903_i728ok.jpg"
            title="Logistics Port"
            className="w-full h-full object-cover"
            fill
          />
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-secfrom-secondary/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 via-transparent to-transparent" />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex lg:items-end lg:flex-row flex-col gap-10 relative z-10">
          {/* LEFT: Red Card */}
          <div className="bg-primary lg:ml-5  order-2 lg:order-1  rounded-2xl mx-auto  p-6 md:p-8 lg:-mt-20 flex flex-col justify-between">
            {/* Steps — scrollable */}
            <div className="flex flex-col overflow-y-auto  scrollbar-none max-h-[360px] pr-1">
              {steps.map((step, i) => (
                <div key={step.id} className="flex gap-4">
                  {/* Check + Line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                      >
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-px bg-white/20"
                        style={{ height: 40 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2 flex-1">
                    <p className="text-xs md:text-sm font-bold uppercase tracking-wide mt-0.5 leading-snug text-white">
                      {step.title}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed text-white/60">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Badge + Title + CTA */}
          <div className="flex  order-1 lg:order-2  flex-col justify-end pt-10   pb-2">
            <span className="inline-block bg-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full w-fit">
              How It Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-secondary uppercase tracking-tight mt-4 leading-[1.05]">
              From Order To
              <br />
              Delivery, Simplified
            </h2>
            <button className="mt-6 inline-flex items-center gap-3 bg-primary text-white px-6 py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#d43d20] transition-colors duration-200 w-fit">
              Get Started
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
