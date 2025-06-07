import OrgUnitSelector from "@/components/OrgUnitSelector/OrgUnitSelector.component";
import { faSchoolFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Popover, Row } from "antd";

const OrgUnit = ({
  limit,
  selectedOrgUnit,
  orgUnitSelectorFilter,
  orgUnitLabel,
  handleSelectOrgUnit,
  buttonLabel,
  singleSelection,
}) => {
  return (
    <Row justify="left" align="middle">
      {/* <Col className="d-none d-sm-block">
        <Typography
          color="primary"
          style={{
            paddingRight: 8,
          }}
        >
          {orgUnitLabel}:{" "}
        </Typography>
      </Col> */}
      <Popover
        placement="bottomLeft"
        overlayInnerStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        trigger="click"
        content={
          <Col className="orgunit-selector-container">
            <OrgUnitSelector
              limit={limit}
              singleSelection={singleSelection}
              selectedOrgUnit={selectedOrgUnit}
              handleSelectOrgUnit={handleSelectOrgUnit}
              filter={orgUnitSelectorFilter}
            />
          </Col>
        }
      >
        <div className="button-container">
          <Button type="primary" icon={<FontAwesomeIcon icon={faSchoolFlag} fontSize={14} />}>
            {buttonLabel}
          </Button>
        </div>
      </Popover>
    </Row>
  );
};

export default OrgUnit;
