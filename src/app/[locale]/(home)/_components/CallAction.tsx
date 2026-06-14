"use client";
import { Link } from "@/i18n/navigation";

export default function CallAction({ className }: { className?: string }) {
  return (
    <section className={`relative z-10 container py-10 border-b border-b-black/3 lg:pb-10 lg:py-0 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 items-start">
        <ServicesCard />
        <Form />
      </div>
    </section>
  );
}

function ServicesCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:mt-10  flex  lg:items-stretch flex-col lg:flex-row gap-5">
      <div className="w-full lg:w-40 h-50 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src="https://res.cloudinary.com/da403zlyf/image/upload/v1781109661/24177_tmmacv.jpg"
          alt="Services"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center space-y-3">
        <span className="text-[#B11226] text-xs font-semibold uppercase tracking-widest">
          Lorem, ipsum dolor.
        </span>
        <h3 className="text-[#1C1E29] text-lg font-bold uppercase leading-snug">
          International transport of heavy equipment and oversized cargo
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          praesentium explicabo, ratione cum fuga recusandae ullam neque
          possimus voluptatum accusantium unde repellendus quidem autem aliquid
          voluptas, esse quia nisi asperiores.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 border border-[#1C1E29] text-[#1C1E29] hover:bg-[#1C1E29] hover:text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded transition-colors duration-200 w-fit"
        >
          Read more <span>→</span>
        </Link>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-[#B11226] rounded-2xl  min-h-100 p-7 lg:-mt-68 text-white">
      <h2 className="text-2xl font-bold uppercase mb-1">Book Shipment</h2>
      <p className="text-white/70 text-sm mb-4">
        Let us know how to get back to you.
      </p>
      <hr className="border-white/20 mb-5" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Services
          </label>
          <input
            type="text"
            placeholder="Enter pickup location"
            className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Pickup From
          </label>
          <input
            type="text"
            placeholder="Enter pickup location"
            className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Delivery To
          </label>
          <input
            type="text"
            placeholder="Enter delivery location"
            className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Example: User@Website.Com"
            className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Telephone
          </label>
          <input
            type="tel"
            placeholder="+(602) 448 763 22"
            className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
            Message
          </label>
          <textarea
            placeholder="+(602) 448 763 22"
            className="w-full bg-transparent min-h-30 resize-none border-b border-white/40 focus:border-white outline-none text-sm text-white placeholder:text-white/50 pb-1.5"
          />
        </div>
        <div className="flex items-end col-span-2">
          <button className="w-full bg-white text-[#B11226] hover:bg-gray-100 font-semibold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors duration-200">
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
}

// export function ShortContent() {
//   return (
//     <div className="flex flex-col pt-5 space-y-5 col-start-1 col-end-7 row-start-7 row-end-13">
//       <div>
//         <CustomImage  width={50} height={50} title="" src={}/>
//       </div>
//       <div>
//         <h2 className="text-secondary font-bold text-3xl">
//           Lorem ipsum dolor sit amet.
//         </h2>
//         <article className="text-secondary/50 text-base leading-loose">
//           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error quae
//           maxime eius reprehenderit cumque adipisci reiciendis similique
//           aspernatur dolorum, quam deleniti ab voluptate ipsa labore vitae
//         </article>
//       </div>
//     </div>
//   );
// }
