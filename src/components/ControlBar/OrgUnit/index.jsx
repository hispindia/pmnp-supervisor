import { Button, Col, Popover, Row } from "antd";
import OrgUnitSelector from "@/components/OrgUnitSelector/OrgUnitSelector.component";

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
            <Button type="default">{buttonLabel}</Button>
          </div>
        </Popover>
      }
    </Row>
  );
};

export default OrgUnit;
