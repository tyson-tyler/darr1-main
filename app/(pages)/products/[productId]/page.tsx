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
  const product = await getProduct({ id: params.productId });

  return {
    title: `${product?.title ?? "Product"} | Product`,
    description: product?.shortDescription ?? "",
    openGraph: {
      images: [product?.featureImageURL ?? "/default.png"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { productId } = params;
  const product = await getProduct({ id: params.productId });

  if (!product) return notFound();

  return (
    <main className="px-4 md:px-8 lg:px-12 xl:px-20 py-10 w-full overflow-x-hidden bg-gray-50">
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-[120rem] mx-auto">
        {/* Left - Product Images */}
        <div className="flex-1">
          <Photos
            imageList={[product.featureImageURL, ...(product.imageList ?? [])]}
          />
        </div>

        {/* Right - Product Details */}
        <div className="flex-1 lg:max-w-2xl">
          <Details product={product} />
        </div>
      </section>

      {/* Reviews + Related */}
      <div className="flex justify-center py-16">
        <AuthContextProvider>
          <div className="flex flex-col gap-8 max-w-[100rem] w-full">
            <AddReview productId={params.productId} />
            <Reviews productId={productId} />
            <RelatedProducts catergoryId={product.catergoryId} />
          </div>
        </AuthContextProvider>
      </div>
    </main>
  );
}
