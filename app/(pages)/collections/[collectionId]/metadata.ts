import { getCollection } from "@/lib/firebase/collections/read_server";
import { Metadata } from "next";

interface PageParams {
  params: {
    collectionId: string;
  };
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const collection = await getCollection({ id: params.collectionId });

  return {
    title: `${collection?.title ?? "Collection"} | Collection`,
    description: collection?.subTitle ?? "",
    openGraph: {
      images: collection?.imageURL ? [collection.imageURL] : [],
    },
  };
}
