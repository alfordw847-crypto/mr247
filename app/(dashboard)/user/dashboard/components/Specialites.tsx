"use client";

import { Banner } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const SpecialtiesCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  useEffect(() => {
    const fetchBanners = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      const banners = await res.json();
      setBanners(banners?.data);
    };
    fetchBanners();
  }, []);

  return (
    <motion.section className="bg-card/30   ">
      {/* Carousel */}
      <div className="relative px-2  ">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          speed={1000}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            768: { slidesPerView: 2 },
            640: { slidesPerView: 1 },
            0: { slidesPerView: 1 },
          }}
          className="!py-4"
        >
          {banners?.map((item, index) => {
            return (
              <SwiperSlide key={item.id}>
                <Image
                  src={item.url}
                  alt=""
                  className="rounded-md"
                  width={600}
                  height={400}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default SpecialtiesCarousel;
