import AddNewFamilyButtonContainer from "../../containers/ControlBar/AddNewFamilyButton";
import styles from "./ControlBar.module.css";

/* REDUX */
import { Button, Dropdown } from "antd";
import { connect } from "react-redux";
import { setSelectedOrgUnit } from "../../redux/actions/metadata";
import { MenuOutlined } from "@ant-design/icons";
import OrgUnitContainer from "../../containers/ControlBar/OrgUnit";
import ReportButtonContainer from "../../containers/ControlBar/ReportButton";
import RightSideButtonsContainer from "../../containers/ControlBar/RightSideButtonsContainer";
import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import ListButtonContainer from "@/containers/ControlBar/ListButton";

const { controlBarContainer } = styles;

const items = [
  {
    key: "1",
    label: <AddNewFamilyButtonContainer />,
  },
  {
    key: "2",
    label: <ReportButtonContainer />,
  },
  {
    key: "5",
    label: <ListButtonContainer />,
  },
  {
    key: "3",
    label: <OfflineModeButton />,
  },
  {
    key: "4",
    label: <PushToServerButton />,
  },
];

const ControlBar = () => {
  return (
    <>
      <div className={controlBarContainer}>
        <div className="d-flex">
          <div className="mr-3">
            <OrgUnitContainer />
          </div>

          <div className="d-lg-none">
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

          <div className="mr-3 d-none d-lg-block">
            <AddNewFamilyButtonContainer />
          </div>

          <div className="mr-3 d-none d-lg-block">
            <ReportButtonContainer />
          </div>

          <div className="d-none d-lg-block">
            <ListButtonContainer />
          </div>
        </div>

        <RightSideButtonsContainer />
      </div>
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
