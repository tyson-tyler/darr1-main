import { ProductCard } from "@/app/components/home/Product";
import { getProductsByCategory } from "@/lib/firebase/products/read_server";

type RelatedProductsProps = {
  catergoryId: string;
};

export default async function RelatedProducts({
  catergoryId,
}: RelatedProductsProps) {
  const products = await getProductsByCategory({ catergoryId });

  if (!products || products.length === 0) {
    return null; // Don’t render if no products
  }

  return (
    <section className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-[100rem]">
        {/* Heading */}
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          Related Products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard product={item} key={item?.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
