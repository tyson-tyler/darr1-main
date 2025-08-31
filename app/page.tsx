export const revalidate = 0; // 👈 Always fetch fresh data from Firebase

import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firebase/products/read_server";
import Collections from "./components/home/collections";
import { getCollections } from "@/lib/firebase/collections/read_server";
import { getCategories } from "@/lib/firebase/catergories/read_server";
import CustomerReviews from "./components/home/customerreview";
import Footer from "./components/footer/footer";
import Loader from "./components/main/newarr/slider/MainSlider";
import WeddingBanner from "./components/main/newarr/slider/wbanner";
import ProductsGridView, { ProductCard } from "./components/home/Product";
import HeroTitle1 from "./components/navbar/heading1";
import HeroTitle2 from "./components/navbar/heading2";
import ContactForm from "./comman/contact/page";
import MainHeader from "./admin/components/MainHeader";
import Mainnav from "./components/navbar/mainnav";
import BlogSection from "./comman/blog/page";
import HeroTitle from "./components/navbar/heading";
import Categories from "./components/home/category";
import CTAImage from "./components/cata";

export default async function Home() {
  const [featuredProducts, collections, categories, products] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getProducts(),
    ]);

  return (
    <>
      
      <Mainnav />
      <MainHeader />
      <div className="flex flex-col w-full justify-center items-center text-black bg-white">
        {/* <HeroTitle />
        <Categories categories={categories} /> */}
      </div>
      <div className="bg-white w-full ">
        <HeroTitle1 />
        <Collections collections={collections} />
      </div>
      <div className=" w-full mb-8">
        <HeroTitle2 />
        <ProductsGridView products={products} />
      </div>
      <main className="px-4 md:px-8 py-8">
        <CTAImage
          href="/collections/bHAeVvxRVIIrznyGZPRp"
          src="https://res.cloudinary.com/dblf5n0yn/image/upload/v1756630975/poiz2vba5bxwuhj9qxnp.jpg"
          alt="Shop the Summer Sale"
          priority
        />
      </main>
{/*       <div className=" w-full mb-8">
        <BlogSection />
      </div> */}
      <div>
        <ContactForm />
      </div>
    </>
  );
}
