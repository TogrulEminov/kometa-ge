import CustomImage from "@/globalElement/CustomImage";
import { Link } from "@/i18n/navigation";
import { FaCheck } from "react-icons/fa";

const coreValues = [
  "Reliability First",
  "Customer Commitment",
  "Innovation Driven",
];

const stats = [
  { value: "450+", label: "Worldwide Branches" },
  { value: "10.9K", label: "Satisfied Customers" },
  { value: "15+", label: "Year Experience" },
];

export default function HomeAboutComponent() {
  return (
    <section className="pt-0 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — image + core values overlay */}
          <div className="relative rounded-2xl overflow-hidden">
            <CustomImage
              width={700}
              height={500}
              src="https://res.cloudinary.com/da403zlyf/image/upload/v1781109661/24177_tmmacv.jpg"
              title=""
              className="w-full h-[480px] object-cover"
            />
            <div className="absolute bottom-4  left-4 w-fit  max-w-sm rounded-sm bg-[#B11226] px-7 py-6">
              <h3 className="text-white font-bold uppercase text-lg mb-4">
                Our Core Value
              </h3>
              <ul className="space-y-2">
                {coreValues.map((val) => (
                  <li key={val} className="flex items-center gap-3 text-white text-sm font-semibold uppercase tracking-wider">
                    <FaCheck size={13} className="flex-shrink-0" />
                    {val}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — text + stats */}
          <div className="flex flex-col space-y-6">
            <span className="inline-block w-fit bg-[#B11226] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-full">
              About Us
            </span>

            <h2 className="text-[#1C1E29] text-4xl lg:text-5xl font-bold uppercase leading-tight">
              Delivering Trust, One Route at a Time
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            <hr className="border-gray-200" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col space-y-1">
                  <span className="text-[#B11226] text-4xl font-bold">
                    {stat.value}
                  </span>
                  <span className="text-[#1C1E29] text-xs font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#1C1E29] hover:bg-[#B11226] text-white text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-colors duration-200"
              >
                Learn More <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}