import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// ✅ Define the type
export type Collection = {
  id: string;
  title: string;
  subtitle: string;
  imageURL: string;
};

// ✅ Use type-safe data extraction
export const getCollection = async ({
  id,
}: {
  id: string;
}): Promise<Collection | null> => {
  const data = await getDoc(doc(db, `collections/${id}`));
  if (data.exists()) {
    const docData = data.data() as Omit<Collection, "id">;
    return {
      id: data.id,
      ...docData,
    };
  } else {
    return null;
  }
};

export const getCollections = async (): Promise<Collection[]> => {
  const list = await getDocs(collection(db, "collections"));
  return list.docs.map((snap) => {
    const data = snap.data() as Omit<Collection, "id">;
    return {
      id: snap.id,
      ...data,
    };
  });
};
