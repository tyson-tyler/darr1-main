"use client";

import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
export default function MyRating({ value }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  if (!visible) {
    return <></>;
  }
  return (
    <Rating
      name="product-rating"
      defaultValue={value}
      precision={0.5}
      readOnly
    />
  );
}
