import React from "react";
import Form from "./components/form";
import Catergories from "./components/ListView";

const page = () => {
  return (
    <div className="flex md:flex-row flex-col mt-5 gap-4 w-full">
      <Form />
      <Catergories />
    </div>
  );
};

export default page;
