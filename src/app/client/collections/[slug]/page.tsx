import React from "react";
import { getCategoryGroupWithProducts } from "../../../../../sanity/query/sanity.query";
import { Product } from "@/types/Products_section";
import ViewAllProduct from "@/components/ViewAllProduct";

interface CategoryGroup {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type?: string;
  };
  description?: string;
  categories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    type?: string;
    material?: string;
    description?: string;
  }>;
  products: Product[];
  totalProducts: number;
}

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;

  // Map URL slug sang Sanity query slug
  const getSanitySlug = (urlSlug: string) => {
    switch (urlSlug) {
      case "san-pham-moi":
        return "new";
      case "ban-chay-nhat":
        return "bestsellers";
      case "tat-ca-san-pham":
        return "all";
      default:
        return "all";
    }
  };

  const sanitySlug = getSanitySlug(slug);

  // Fetch data với slug đã được map
  const categoryGroup: CategoryGroup | null =
    await getCategoryGroupWithProducts(sanitySlug);

  if (!categoryGroup) {
    return (
      <main>
        <section className="container_section">
          <div>Không tìm thấy collection này</div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="container_section">
        <ViewAllProduct
          title={categoryGroup.title}
          description={categoryGroup.description}
          products={categoryGroup.products}
          totalProducts={categoryGroup.totalProducts}
          categories={categoryGroup.categories}
          sectionId={`collection-${slug}`}
        />
      </section>
    </main>
  );
}
