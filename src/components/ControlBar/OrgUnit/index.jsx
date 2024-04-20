import { Button, Col, Popover, Row } from "antd";
import OrgUnitSelector from "@/components/OrgUnitSelector/OrgUnitSelector.component";

const OrgUnit = ({
  selectedOrgUnit,
  orgUnitSelectorFilter,
  orgUnitLabel,
  handleSelectOrgUnit,
  buttonLabel,
}) => {
  return (
    <Row justify="center" align="middle">
      <Col className="d-none d-sm-block">
        <div
          style={{
            paddingRight: 8,
          }}
        >
          {orgUnitLabel}:{" "}
        </div>
      </Col>
      {
        <Popover
          overlayInnerStyle={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          trigger="click"
          content={
            <Col className="orgunit-selector-container">
              <OrgUnitSelector
                selectedOrgUnit={selectedOrgUnit}
                handleSelectOrgUnit={handleSelectOrgUnit}
                filter={orgUnitSelectorFilter}
              />
            </Col>
          }
        >
          <div className="button-container">
            <Button type="default">{buttonLabel}</Button>
          </div>
        </Popover>
      }
    </Row>
  );
};

export default OrgUnit;
