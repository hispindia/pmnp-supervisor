import React from "react";
import { Skeleton } from "antd";

const Form = () => {
  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
      }}
    >
      <Skeleton
        active
        paragraph={{
          rows: 20,
        }}
      />
    </div>
  );
};

export default Form;
