import { groq } from "next-sanity";
import { client } from "../lib/index";

export async function getPage(slug: string = "/") {
  return client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0] {
      _type,
      slug,
      title,
      "body": body[]{
        _key,
        _type,
        // Hero Section
        _type == "heroSection" => {
          _key,
          _type,
          title,
          subtitle,
          images[]{
            asset->{ url },
            alt
          }
        },
        // Product Section
        _type == "productSection" => {
          _key,
          _type,
          sectionTitle,
          displayType,
          limit,
          // Thêm categoryGroups ở đây - ngang hàng với products
          "categoryGroups": *[_type == "categoryGroup"] | order(title asc) {
            _id,
            title,
            slug,
            description,
            categories[]->{
              _id,
              title,
              slug,
              type,
              material,
              description
            }
          },
          "products": *[
            _type == "product" &&
            (^.displayType == "all" ||
             (^.displayType == "new" && isNew == true) ||
             (^.displayType == "bestseller" && isBestseller == true))
          ] | order(isNew desc, _createdAt desc)[0...20] {
            _id,
            title,
            slug,
            price,
            originalPrice,
            msp,
            description {
              subtitle,
              mainDescription,
              details[] {
                label,
                value
              },
              styling[],
              tags[]
            },
            thumbnail {
              defaultImage {
                asset->{url},
                alt
              },
              hoverImage {
                asset->{url},
                alt
              }
            },
            categories[]->{
              title,
              slug,
              type,
              material,
              image{
                asset->{url},
                alt
              }
            },
            colors[]{
              colorCode,
              image{
                asset->{url},
                alt
              },
              detailImages[]{
                asset->{url},
                alt
              },
              sizes[]{
                size,
                quantity
              }
            },
            isNew,
            isBestseller,
            inStock
          }
        },
        // Nếu là reference tới Sections document
        _type == "reference" => @->{
          _type,
          sections[]{
            _key,
            _type,
            _type == "heroSection" => {
              _key,
              _type,
              title,
              subtitle,
              images[]{
                asset->{ url },
                alt
              }
            },
            _type == "productSection" => {
              _key,
              _type,
              sectionTitle,
              description,
              displayType,
              limit,
              // Thêm categoryGroups ở đây cũng
              "categoryGroups": *[_type == "categoryGroup"] | order(title asc) {
                _id,
                title,
                slug,
                description,
                categories[]->{
                  _id,
                  title,
                  slug,
                  type,
                  material,
                  description
                }
              },
              "products": *[
                _type == "product" &&
                (^.displayType == "all" ||
                 (^.displayType == "new" && isNew == true) ||
                 (^.displayType == "bestseller" && isBestseller == true))
              ] | order(isNew desc, _createdAt desc)[0...20] {
                _id,
                title,
                slug,
                msp,
                price,
                originalPrice,
                description {
                  subtitle,
                  mainDescription,
                  details[] {
                    label,
                    value
                  },
                  styling[],
                  tags[]
                },
                thumbnail {
                  defaultImage {
                    asset->{url},
                    alt
                  },
                  hoverImage {
                    asset->{url},
                    alt
                  }
                },
                categories[]->{
                  title,
                  slug,
                  type,
                  material,
                  image{
                    asset->{url},
                    alt
                  }
                },
                colors[]{
                  colorCode,
                  image{
                    asset->{url},
                    alt
                  },
                  detailImages[]{
                    asset->{url},
                    alt
                  },
                  sizes[]{
                    size,
                    quantity
                  }
                },
                isNew,
                isBestseller,
                inStock
              }
            },
            _type == "categorySection" => {
              _key,
              _type,
              title,
              description,
              "categories": categories[]->{
                _id,
                title,
                slug,
                description
              }
            },
            // FIX: Query cho categoryGroup reference
            _type == "reference" && @->._type == "categoryGroup" => @->{
              _key,
              _type,
              title,
              description,
              slug,
              categories[]->{
                _id,
                title,
                slug,
                description
              },
              "products": *[_type == "product" && count(categories[_ref in ^.categories[]._ref]) > 0] | order(isNew desc, _createdAt desc) {
                _id,
                title,
                slug,
                price,
                originalPrice,
                msp,
                description {
                  subtitle,
                  mainDescription,
                  details[] {
                    label,
                    value
                  },
                  styling[],
                  tags[]
                },
                thumbnail {
                  defaultImage {
                    asset->{url},
                    alt
                  },
                  hoverImage {
                    asset->{url},
                    alt
                  }
                },
                categories[]->{
                  title,
                  slug,
                  type,
                  material,
                  image{
                    asset->{url},
                    alt
                  }
                },
                colors[]{
                  colorCode,
                  image{
                    asset->{url},
                    alt
                  },
                  detailImages[]{
                    asset->{url},
                    alt
                  },
                  sizes[]{
                    size,
                    quantity
                  }
                },
                isNew,
                isBestseller,
                inStock
              }
            }
          }
        }
      }
    }`,
    { slug }
  );
}

export async function getCategoryGroupWithProducts(
  slug: string,
  page: number = 1
) {
  return client.fetch(
    groq`*[_type == "categoryGroup" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      categories[]->{
        _id,
        title,
        slug,
        type,
        material,
        description
      },
      "products": *[_type == "product" && count(categories[_ref in ^.categories[]._ref]) > 0] | order(_createdAt desc) {
        _id,
        title,
        slug,
        price,
        originalPrice,
        msp,
        description {
          subtitle,
          mainDescription,
          details[] {
            label,
            value
          },
          styling[],
          tags[]
        },
        thumbnail {
          defaultImage {
            asset->{url},
            alt
          },
          hoverImage {
            asset->{url},
            alt
          }
        },
        categories[]->{
          title,
          slug,
          type,
          material
        },
        colors[]{
          colorCode,
          image{
            asset->{url},
            alt
          },
          detailImages[]{
            asset->{url},
            alt
          },
          sizes[]{
            size,
            quantity
          }
        },
        isNew,
        isBestseller,
        inStock
      },
      "totalProducts": count(*[_type == "product" && count(categories[_ref in ^.categories[]._ref]) > 0])
    }`,
    { slug }
  );
}

// Lấy 1 sản phẩm theo slug
export async function getProductSlug(slug: string) {
  return client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      price,
      originalPrice,
      description {
        subtitle,
        mainDescription,
        details[] {
          label,
          value
        },
        styling[],
        tags[]
      },
      thumbnail {
        defaultImage { asset->{url}, alt },
        hoverImage { asset->{url}, alt }
      },
      categories[]->{
        _id,
        title,
        slug,
        type,
        material,
        image{ asset->{url}, alt }
      },
      colors[]{
        colorCode,
        image{ asset->{url}, alt },
        detailImages[]{ asset->{url}, alt },
        sizes[]{
          size,
          quantity
        }
      },
      isNew,
      isBestseller,
      inStock,
      msp
    }`,
    { slug }
  );
}

// Lấy 10 sản phẩm liên quan cùng category, loại trừ sản phẩm hiện tại
export async function getRelatedProducts(
  currentProductId: string,
  categoryIds: string[]
) {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) return [];
  return client.fetch(
    groq`*[_type == "product" && _id != $currentProductId && count(categories[_ref in $categoryIds]) > 0][0...10]{
      _id,
      title,
      slug,
      price,
      originalPrice,
      msp,
      thumbnail {
        defaultImage { asset->{url}, alt },
        hoverImage { asset->{url}, alt }
      },
      categories[]->{
        _id,
        title,
        slug
      },
      colors[]{
        colorCode,
        image{ asset->{url}, alt },
        detailImages[]{ asset->{url}, alt },
        sizes[]{ size, quantity }
      }
    }`,
    { currentProductId, categoryIds }
  );
}
