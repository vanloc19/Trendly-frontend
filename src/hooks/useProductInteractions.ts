import React from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Product,
  ProductImage as ProductImageType,
} from "@/types/Products_section";
import { getSlug } from "@/utils/getSlug";

export function useProductInteractions(products: Product[]) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [hoverShowActions, setHoverShowActions] = React.useState<string | null>(
    null
  );

  // State cho active colors
  const [activeColors, setActiveColors] = React.useState<
    Record<string, number | null>
  >(() => {
    const initial: Record<string, number | null> = {};
    products.forEach((product) => {
      initial[product._id] =
        product.colors && product.colors.length > 0 ? 0 : null;
    });
    return initial;
  });

  const [activeColorImages, setActiveColorImages] = React.useState<
    Record<string, ProductImageType | null>
  >(() => {
    const initial: Record<string, ProductImageType | null> = {};
    products.forEach((product) => {
      if (product.colors && product.colors.length > 0) {
        initial[product._id] = product.colors[0].image || null;
      } else {
        initial[product._id] = null;
      }
    });
    return initial;
  });

  // Event handlers
  const handleMouseEnter = (id: string) => !isMobile && setHoveredId(id);
  const handleMouseLeave = () => !isMobile && setHoveredId(null);

  const handleSetHoverShowActions = (id: string | null) => {
    if (!isMobile) {
      setHoverShowActions(id);
    }
  };

  const handleSetActiveColor = (
    id: string,
    colorIdx: number | null,
    image?: ProductImageType | null
  ) => {
    setActiveColors((prev) => ({ ...prev, [id]: colorIdx }));
    setActiveColorImages((prev) => ({ ...prev, [id]: image || null }));
  };

  const handleProductClick = (product: Product, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.closest("button") || target.closest('[role="button"]')) {
      return;
    }

    const productSlug = getSlug(product);
    if (productSlug) {
      router.push(`/products/${productSlug}`);
    }
  };

  return {
    hoveredId,
    hoverShowActions,
    activeColors,
    activeColorImages,
    handleMouseEnter,
    handleMouseLeave,
    handleSetHoverShowActions,
    handleSetActiveColor,
    handleProductClick,
  };
}
