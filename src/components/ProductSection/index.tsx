"use client";

import React from "react";
import { ProductSectionProps } from "@/types/Products_section";
import ProductUi from "@/ui/Product";
import { useProductInteractions } from "@/hooks/useProductInteractions";
import SwiperSlide from "@/components/SwiperSlide";
import ProductHeader from "@/ui/Product/ProductHeader";
import styles from "./ProductSection.module.scss";
import Link from "next/link";

interface ExtendedProductSectionProps extends ProductSectionProps {
  sectionId?: string;
  displayType?: "new" | "bestseller" | "all";
}

export default function ProductSection({
  title,
  products,
  description,
  sectionId,
  displayType, // Nhận displayType từ props
}: ExtendedProductSectionProps) {
  const [swiperReady, setSwiperReady] = React.useState(false);

  const {
    hoveredId,
    hoverShowActions,
    activeColors,
    activeColorImages,
    handleMouseEnter,
    handleMouseLeave,
    handleSetHoverShowActions,
    handleSetActiveColor,
    handleProductClick,
  } = useProductInteractions(products);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSwiperReady(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleSwiperInit = () => {
    setSwiperReady(true);
  };

  // Tạo link dựa trên displayType
  const getViewAllHref = () => {
    switch (displayType) {
      case "new":
        return "/collections/san-pham-moi";
      case "bestseller":
        return "/collections/ban-chay-nhat";
      case "all":
        return "/collections/tat-ca-san-pham";
      default:
        return "/collections/tat-ca-san-pham";
    }
  };

  return (
    <div className={`${styles.wrapper} ${styles.responsiveHover}`}>
      <ProductHeader title={title} description={description} />
      <div className={styles.wrapper_productList}>
        <div
          style={{
            opacity: swiperReady ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <SwiperSlide
            data={products}
            transitionSpeed={800}
            swiperProps={{
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 20,
              pagination: {
                clickable: true,
              },
              onInit: handleSwiperInit,
              onSwiper: handleSwiperInit,
              breakpoints: {
                480: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 10,
                },
                1110: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                1210: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
                1280: {
                  slidesPerView: 5,
                  slidesPerGroup: 5,
                },
              },
            }}
            renderItem={(product) => (
              <div
                onClick={(e) => handleProductClick(product, e)}
                style={{ cursor: "pointer" }}
              >
                <ProductUi
                  key={product._id}
                  product={product}
                  isHover={hoveredId === product._id}
                  showActions={hoverShowActions === product._id}
                  onMouseEnter={() => handleSetHoverShowActions(product._id)}
                  onMouseLeave={() => handleSetHoverShowActions(null)}
                  onImageMouseEnter={() => handleMouseEnter(product._id)}
                  onImageMouseLeave={handleMouseLeave}
                  activeColor={activeColors[product._id] ?? null}
                  setActiveColor={(colorIdx, image) =>
                    handleSetActiveColor(product._id, colorIdx, image)
                  }
                  activeColorImage={activeColorImages[product._id] ?? null}
                  sectionId={sectionId}
                />
              </div>
            )}
          />
          <Link href={getViewAllHref()} className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
      </div>
    </div>
  );
}
