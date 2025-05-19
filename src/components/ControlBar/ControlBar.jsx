import AddNewFamilyButtonContainer from "../../containers/ControlBar/AddNewFamilyButton";
import styles from "./ControlBar.module.css";

/* REDUX */
import ListButtonContainer from "@/containers/ControlBar/ListButton";
import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Dropdown } from "antd";
import { connect, useSelector } from "react-redux";
import OrgUnitContainer from "../../containers/ControlBar/OrgUnit";
import ReportButtonContainer from "../../containers/ControlBar/ReportButton";
import { setSelectedOrgUnit } from "../../redux/actions/metadata";
import RightSideButtonsContainer from "../../containers/ControlBar/RightSideButtonsContainer";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const { controlBarContainer, antBreadcrumbSeparator } = styles;

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
  const { t } = useTranslation();
  const { selectedOrgUnit, orgUnits } = useSelector((state) => state.metadata);

  const orgUnitLabel = selectedOrgUnit?.path
    ? selectedOrgUnit.path
        .split("/")
        .map((id) => id && orgUnits.find((ou) => ou.id === id)?.displayName)
        .slice(2)
    : [];

  return (
    <>
      <div className={controlBarContainer}>
        <div>
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

            {/* <div className="mr-3 d-none d-lg-block">
            <ReportButtonContainer />
          </div> */}

            <div className="d-none d-lg-block">
              <ListButtonContainer />
            </div>
          </div>

          <Typography color="primary" style={{ paddingRight: 8, paddingTop: 2 }}>
            {orgUnitLabel.map((name, index) => (
              <>
                {" "}
                {name} {index < orgUnitLabel.length - 1 && <RightOutlined style={{ fontSize: 12 }} />}
              </>
            ))}
          </Typography>
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
