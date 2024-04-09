import React from "react";
import PropTypes from "prop-types";
import Container from "./components/Container";
import { Spin } from "antd";

const withSkeletonLoading =
  (Skeleton = () => "Loading...") =>
  (Component) => {
    const SkeletonLoading = ({ loading, mask, loaded, ...props }) => {
      if (!loading && !loaded) {
        return null;
      }

      if ((loading && !mask) || (mask && !loaded)) {
        return <Skeleton />;
      }

      return (
        <div
          style={
            loading
              ? {
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  height: "100%",
                  maxHeight: "calc(100vh - 104px)",
                }
              : {}
          }
        >
          {loading && (
            <Container
              style={{
                position: "absolute",
                zIndex: 110,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <Spin spinning />
            </Container>
          )}
          <Component {...props} />
        </div>
      );
    };
    // SkeletonLoading.propTypes = {
    //   loading: PropTypes.bool.isRequired,
    //   loaded: PropTypes.bool.isRequired,
    //   mask: PropTypes.bool,
    // };
    // SkeletonLoading.propTypes = {
    //   mask: false,
    //   loaded: false,
    // };
    return SkeletonLoading;
  };

export default withSkeletonLoading;
