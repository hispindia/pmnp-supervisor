import React from "react";
import { Skeleton, Space } from "antd";

const TeiList = () => {
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
      <Space>
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 32,
          }}
        />
        <Skeleton.Button
          active
          style={{
            width: 110,
          }}
        />
      </Space>
    </div>
  );
};

export default TeiList;
