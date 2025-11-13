"use client";

import React from "react";
import { Product } from "@/types/Products_section";
import ProductUi from "@/ui/Product";
import { useProductInteractions } from "@/hooks/useProductInteractions";
import styles from "./ViewAllProduct.module.scss";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  type?: string;
  material?: string;
  description?: string;
}

interface ViewAllProductProps {
  title: string;
  description?: string;
  products: Product[];
  totalProducts?: number;
  categories?: Category[];
  sectionId?: string;
}

export default function ViewAllProduct({
  title,
  description,
  products,
  totalProducts,
  categories,
  sectionId,
}: ViewAllProductProps) {
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

  return (
    <div className={styles.viewAllProduct}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.productCount}>
          {totalProducts || products.length} sản phẩm
        </div>
      </div>

      {/* Categories Filter (nếu có nhiều categories) */}
      {categories && categories.length > 1 && (
        <div className={styles.categoriesFilter}>
          <div className={styles.filterTitle}>Danh mục:</div>
          <div className={styles.categoryTags}>
            {categories.map((category) => (
              <span key={category._id} className={styles.categoryTag}>
                {category.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div
            key={product._id}
            className={styles.productWrapper}
            onClick={(e) => handleProductClick(product, e)}
            style={{ cursor: "pointer" }}
          >
            <ProductUi
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
        ))}
      </div>
    </div>
  );
}
