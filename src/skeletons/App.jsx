import React from "react";
import { Col, Row, Skeleton, Space } from "antd";
import controlBarStyles from "../components/ControlBar/ControlBar.module.css";

const { controlBarContainer } = controlBarStyles;

const App = () => {
  return (
    <>
      <Row
        justify="space-between"
        align="center"
        className={controlBarContainer}
      >
        <Col>
          <Space>
            <Skeleton.Button active style={{ width: 230 }} />
            <Skeleton.Button active style={{ width: 130 }} />
            <Skeleton.Button active style={{ width: 70 }} />
          </Space>
        </Col>
        <Col>
          <Space style={{ paddingRight: 16 }}>
            <Skeleton.Avatar active shape="circle" />
            <Skeleton.Button active style={{ width: 55 }} />
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default App;
