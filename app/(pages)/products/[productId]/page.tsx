// app/products/[productId]/page.tsx
import { AuthContextProvider } from "@/context/authcontext";
import Photos from "./components/photo";
import { getProduct } from "@/lib/firebase/products/read_server";
import Details from "./components/Details";
import AddReview from "./components/AddReviews";
import RelatedProducts from "./components/RelatedProduct";
import { notFound } from "next/navigation";
import Reviews from "./components/review";

type PageProps = {
  params: {
    productId: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  try {
    const product = await getProduct({ id: params.productId });

    if (!product) {
      return {
        title: "Product Not Found | Product",
        description: "This product does not exist",
      };
    }

    return {
      title: `${product.title} | Product`,
      description: product.shortDescription ?? "",
      openGraph: {
        images: [product.featureImageURL ?? "/default.png"],
      },
    };
  } catch (err) {
    console.error("Metadata fetch failed:", err);
    return {
      title: "Error | Product",
      description: "An error occurred while loading this product.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { productId } = params;

  let product = null;
  try {
    product = await getProduct({ id: productId });
  } catch (err) {
    console.error("Product fetch failed:", err);
  }

  if (!product) return notFound();

  const imageList = [
    ...(product.featureImageURL ? [product.featureImageURL] : []),
    ...(product.imageList ?? []),
  ];

  return (
    <main className="px-4 md:px-8 lg:px-12 xl:px-20 py-10 w-full overflow-x-hidden bg-gray-100">
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-[120rem] mx-auto">
        {/* Left - Product Images */}
        <div className="flex-1">
          <Photos imageList={imageList} />
        </div>

        {/* Right - Product Details */}
        <div className="flex-1 lg:max-w-2xl">
          <Details product={product} />
        </div>
      </section>

      {/* Reviews + Related */}
      <div className="flex justify-center py-16">
        {/* Make sure AuthContextProvider is a client component */}
        <AuthContextProvider>
          <div className="flex flex-col gap-8 max-w-[100rem] w-full">
            <AddReview productId={productId} />
            <Reviews productId={productId} />
            {/* double check spelling: categoryId */}
{/*             <RelatedProducts categoryId={product.categoryId ?? ""} /> */}
          </div>
        </AuthContextProvider>
      </div>
    </main>
  );
}
