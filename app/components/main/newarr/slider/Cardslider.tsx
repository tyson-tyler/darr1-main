import Image from "next/image";
import React from "react";

type CardInfo = {
  title: string;
  desc: string;
  image: string;
};

const Cardslider = ({ title, desc, image }: CardInfo) => {
  return (
    <div className="flex justify-center items-center flex-col gap-3  rounded-md mt-[70px] ">
      <Image
        src={image}
        alt="hello"
        width={1300}
        height={1500}
        className="object-cover w-[500px] h-[600px] rounded-xl"
      />
      <h2 className="text-2xl text-white">{title}</h2>

      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
};

export default Cardslider;
