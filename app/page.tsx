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
import BlogSection from "./comman/blog"

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
      <Loader />
      <Mainnav />
      <MainHeader />

      <div className="flex flex-col w-full justify-center items-center text-black bg-white">
        {/* <HeroTitle /> */}
        {/* <Categories categories={categories} /> */}
      </div>
      <div className="bg-white w-full ">
        <HeroTitle1 />
        <Collections collections={collections} />
      </div>

      {/* <div className="z-50 bg-black h-screen w-full">
        <Minimal />
      </div> */}

      <div className="px-5">
        <WeddingBanner />
      </div>

      <div className=" w-full mb-8">
        <HeroTitle2 />
        <ProductsGridView products={products} />
      </div>
      <div className=" w-full mb-8">
        <BlogSection/>
      </div>
      

      <div className="bg-white w-full ">
        <CustomerReviews />
      </div>

      <div>
        <ContactForm />
      </div>
    </>
  );
}
