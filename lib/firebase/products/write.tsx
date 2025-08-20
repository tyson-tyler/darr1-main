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

// ----------- Types -----------
interface ProductData {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  featureImageURL?: string;
  imageList?: string[];
  id?: string;
}

// Input props for create/update
interface ProductProps {
  data: ProductData;
  featureImage: File | null;
  imageList: File[];
}

// ----------- Create Product -----------
export const createNewProduct = async ({
  data,
  featureImage,
  imageList,
}: ProductProps): Promise<void> => {
  if (!data?.title) throw new Error("Title is required");
  if (!featureImage) throw new Error("Feature Image is required");

  // Upload feature image
  const featureImageURL = await uploadToCloudinary(featureImage);

  // Upload additional images
  const imageURLList: string[] = [];
  for (const image of imageList) {
    const url = await uploadToCloudinary(image);
    imageURLList.push(url);
  }

  const newId = doc(collection(db, "ids")).id;

  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    id: newId,
    featureImageURL,
    imageList: imageURLList,
    timestampCreate: Timestamp.now().toJSON(),
  });
};

// ----------- Update Product -----------
export const updateProduct = async ({
  data,
  featureImage,
  imageList,
}: ProductProps): Promise<void> => {
  if (!data?.title) throw new Error("Title is required");
  if (!data?.id) throw new Error("ID is required");

  const id = data.id;
  let featureImageURL = data.featureImageURL ?? "";

  // Upload new feature image if updated
  if (featureImage) {
    featureImageURL = await uploadToCloudinary(featureImage);
  }

  // Upload new images if provided, else keep existing ones
  let imageURLList: string[] = data.imageList ?? [];
  if (imageList?.length > 0) {
    imageURLList = [];
    for (const image of imageList) {
      const url = await uploadToCloudinary(image);
      imageURLList.push(url);
    }
  }

  await setDoc(doc(db, `products/${id}`), {
    ...data,
    featureImageURL,
    imageList: imageURLList,
    timestampUpdate: Timestamp.now().toJSON(),
  });
};

// ----------- Delete Product -----------
export const deleteProduct = async ({ id }: { id: string }): Promise<void> => {
  if (!id) throw new Error("ID is required");
  await deleteDoc(doc(db, `products/${id}`));
};
