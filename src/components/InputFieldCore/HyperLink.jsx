import { InfoCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const HyperLink = ({ hyperlink, base64 }) => {
  const { offlineStatus } = useSelector((state) => state.common);

  if (base64) {
    return (
      <a href={base64.base64Image} download={base64.name || "downloaded-file.png"}>
        <InfoCircleOutlined />
      </a>
    );
  }

  // if (!hyperlink || offlineStatus) {
  //   return null;
  // }

  // return (
  //   <a href={hyperlink} target="_blank" rel="noopener noreferrer">
  //     <InfoCircleOutlined />
  //   </a>
  // );
};

export default HyperLink;
