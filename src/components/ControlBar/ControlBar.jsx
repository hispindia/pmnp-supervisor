import AddNewFamilyButtonContainer from "../../containers/ControlBar/AddNewFamilyButton";
import styles from "./ControlBar.module.css";

/* REDUX */
import { Button, Dropdown } from "antd";
import { connect } from "react-redux";
import OrgUnit from "../../containers/ControlBar/OrgUnit";
import ReportButtonContainer from "../../containers/ControlBar/ReportButton";
import RightSideButtonsContainer from "../../containers/ControlBar/RightSideButtons";
import { setSelectedOrgUnit } from "../../redux/actions/metadata";
import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import { MenuOutlined } from "@ant-design/icons";

const { controlBarContainer } = styles;

const items = [
  {
    key: "1",
    label: <AddNewFamilyButtonContainer />,
  },
  {
    key: "2",
    label: <OfflineModeButton />,
  },
  {
    key: "3",
    label: <PushToServerButton />,
  },
];

const ControlBar = () => {
  return (
    <>
      <div className={controlBarContainer}>
        <div className="d-flex">
          <div className="mr-3">
            <OrgUnit />
          </div>

          <div className="d-md-none">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              //   dropdownRender={(menu) => <div>{cloneElement(menu)}</div>}
            >
              <a onClick={(e) => e.preventDefault()}>
                {/* hamburger icon */}

                <Button>
                  <MenuOutlined />
                </Button>
              </a>
            </Dropdown>
          </div>

          <div className="mr-3 d-none d-md-block">
            <AddNewFamilyButtonContainer />
          </div>

          <div className="d-none d-lg-block">
            <ReportButtonContainer />
          </div>
        </div>

        <RightSideButtonsContainer />
      </div>

      {/*<div className={appContentContainer} />*/}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    metadata: state.metadata,
  };
};

const mapDispatchToProps = { setSelectedOrgUnit };

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
