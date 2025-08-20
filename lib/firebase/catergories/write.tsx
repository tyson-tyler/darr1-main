import { uploadToCloudinary } from "@/cloudinary";
import { db, stroage } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Define the shape of the data
interface CategoryData {
  name: string;
  slug: string;
}

// Define props expected by the function
interface CreateCategoryProps {
  data: CategoryData;
  image: File;
}

export const createNewCategory = async ({
  data,
  image,
}: CreateCategoryProps): Promise<void> => {
  if (!image) {
    throw new Error("Image is required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }

  const newId = doc(collection(db, `ids`)).id;
  const imageUrl = await uploadToCloudinary(image);

  await setDoc(doc(db, `categories/${newId}`), {
    ...data,
    image: imageUrl,
    id: newId,
    timestampCreate: Timestamp.now().toJSON(),
  });
};

export const deleteCategory = async ({ id }) => {
  if (!id) {
    throw new Error("Id is not found");
  }
  await deleteDoc(doc(db, `categories/${id}`));
};

interface CategoryData {
  name: string;
  slug: string;
  id: string;
}

// Define props expected by the function
interface CreateCategoryProps {
  data: CategoryData;
  image: File;
}

export const UpdateCategory = async ({
  data,
  image,
}: CreateCategoryProps): Promise<void> => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  const id = data.id;

  let imageUrlToUpdate = data.image; // Keep existing image by default

  if (image) {
    imageUrlToUpdate = await uploadToCloudinary(image);
  }

  await updateDoc(doc(db, `categories/${id}`), {
    ...data,
    image: imageUrlToUpdate,
    timestampUpdate: Timestamp.now().toJSON(),
  });
};
