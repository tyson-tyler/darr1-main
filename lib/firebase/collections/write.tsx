import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/cloudinary";

// Define the shape of the data
interface CollectionData {
  title: string;
  products: string[]; // adjust based on actual product type
}

// Props for creating a collection
interface CreateCollectionProps {
  data: CollectionData;
  image: File;
}

export const createNewCollection = async ({
  data,
  image,
}: CreateCollectionProps): Promise<void> => {
  if (!image) throw new Error("Image is required");
  if (!data?.title) throw new Error("Title is required");
  if (!data?.products || data.products.length === 0) {
    throw new Error("Products are required");
  }

  const newId = doc(collection(db, `ids`)).id;
  const imageURL = await uploadToCloudinary(image);

  await setDoc(doc(db, `collections/${newId}`), {
    ...data,
    id: newId,
    imageURL,
    timestampCreate: Timestamp.now().toJSON(),
  });
};
interface UpdateCollectionProps {
  data: CollectionData & { id: string; imageURL: string };
  image?: File;
}

export const updateCollection = async ({
  data,
  image,
}: UpdateCollectionProps): Promise<void> => {
  if (!data?.title) throw new Error("Title is required");
  if (!data?.products || data.products.length === 0) {
    throw new Error("Products are required");
  }
  if (!data?.id) throw new Error("ID is required");

  const id = data.id;
  let imageURL = data.imageURL;

  if (image) {
    imageURL = await uploadToCloudinary(image);
  }

  await updateDoc(doc(db, `collections/${id}`), {
    ...data,
    imageURL,
    timestampUpdate: Timestamp.now().toJSON(),
  });
};

export const deleteCollection = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  if (!id) throw new Error("ID is required");
  await deleteDoc(doc(db, `collections/${id}`));
};
