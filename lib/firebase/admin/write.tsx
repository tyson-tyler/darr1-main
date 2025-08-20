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
  email: string;
}

// Define props expected by the function
interface CreateCategoryProps {
  data: CategoryData;
  image: File;
}

export const createNewAdmin = async ({
  data,
  image,
}: CreateCategoryProps): Promise<void> => {
  if (!image) {
    throw new Error("Image is required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("email is required");
  }

  const newId = data?.email;
  const imageUrl = await uploadToCloudinary(image);

  await setDoc(doc(db, `admins/${newId}`), {
    ...data,
    image: imageUrl,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("Id is not found");
  }
  await deleteDoc(doc(db, `admins/${id}`));
};

interface CategoryData {
  name: string;

  id: string;
  email: string;
}

// Define props expected by the function
interface CreateCategoryProps {
  data: CategoryData;
  image: File;
}

export const UpdateAdmin = async ({
  data,
  image,
}: CreateCategoryProps): Promise<void> => {
  if (!data?.name) {
    throw new Error("Name is required");
  }

  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data.id;

  let imageUrlToUpdate = data.image; // Keep existing image by default

  if (image) {
    imageUrlToUpdate = await uploadToCloudinary(image);
  }

  if (id === data?.email) {
    await updateDoc(doc(db, `admins/${id}`), {
      ...data,
      image: imageUrlToUpdate,
      timestampUpdate: Timestamp.now(),
    });
  } else {
    const newId = data?.email;
    await deleteDoc(doc(db, `admins/${id}`));

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      image: imageUrlToUpdate,
      timestampUpdate: Timestamp.now(),
    });
  }
};
