import AddNewFamilyButtonContainer from "../../containers/ControlBar/AddNewFamilyButton";
import styles from "./ControlBar.module.css";

/* REDUX */
import ListButtonContainer from "@/containers/ControlBar/ListButton";
import OfflineModeButton from "@/containers/ControlBar/OfflineModeButton";
import PushToServerButton from "@/containers/ControlBar/PushToServerButton";
import { MenuOutlined, RightOutlined } from "@ant-design/icons";
import { Typography } from "@material-ui/core";
import { Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { useState } from "react";
import OrgUnitContainer from "../../containers/ControlBar/OrgUnit";
import ReportButtonContainer from "../../containers/ControlBar/ReportButton";
import RightSideButtonsContainer from "../../containers/ControlBar/RightSideButtonsContainer";
import { setSelectedOrgUnit } from "../../redux/actions/metadata";
import { useUser } from "@/hooks/useUser";
import LanguageSelectionButton from "./LanguageSelectionButton";
import manifest from "../../../manifest.webapp.json";

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
    key: "3",
    label: <ListButtonContainer />,
  },
  {
    key: "4",
    label: <OfflineModeButton />,
  },
  {
    key: "5",
    label: <PushToServerButton />,
  },
  {
    key: "6",
    label: (
      <div onClick={(e) => e.stopPropagation()}>
        <LanguageSelectionButton />
      </div>
    ),
  },
  {
    key: "7",
    label: (
      <div className="d-flex align-items-center">
        <span className="text-muted font-medium">v{manifest.version}</span>
      </div>
    ),
  },
];

const ControlBar = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { selectedOrgUnit, orgUnits } = useSelector((state) => state.metadata);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Button>
                    <MenuOutlined />
                  </Button>
                </a>
              </Dropdown>
            </div>

            <div className="mr-3 d-none d-lg-block">
              <AddNewFamilyButtonContainer />
            </div>

            <div className="d-none d-lg-block">
              <ListButtonContainer />
            </div>
          </div>

          <div className="d-flex align-items-center">
            <Typography color="primary" style={{ paddingTop: 2 }}>
              <>
                User: &nbsp;
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {user?.displayName || user?.name || "Unknown User"}
                </span>
              </>
            </Typography>

            {orgUnitLabel.length > 0 && (
              <>
                <div
                  style={{
                    width: "2px",
                    height: "20px",
                    background: "#f68e22",
                    margin: "0 12px",
                  }}
                />

                <Typography color="primary" style={{ paddingRight: 8, paddingTop: 2 }}>
                  {orgUnitLabel.map((name, index) => (
                    <>
                      {name} {index < orgUnitLabel.length - 1 && <RightOutlined style={{ fontSize: 12 }} />}
                    </>
                  ))}
                </Typography>
              </>
            )}
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
