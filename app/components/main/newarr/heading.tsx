import React from "react";

type HeadingProps = {
  title: string;
  desc: string;
};

const Heading1 = ({ title, desc }: HeadingProps) => {
  return (
    <div className="mt-[80px] mb-2 flex justify-center items-center flex-col gap-2">
      <h1 className="text-6xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
};

export default Heading1;
