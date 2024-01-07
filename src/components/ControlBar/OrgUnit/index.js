import React from 'react';
import { Button, Col, Popover, Row } from 'antd';

import OrgUnitSelector from 'components/OrgUnitSelector/OrgUnitSelector.component';

const OrgUnit = ({
    selectedOrgUnit,
    orgUnitSelectorFilter,
    orgUnitLabel,
    handleSelectOrgUnit,
    buttonLabel,
}) => {
    return (
        <Row justify="center" align="middle">
            <Col>
                <div
                    style={{
                        paddingRight: 8,
                    }}
                >
                    {orgUnitLabel}:{' '}
                </div>
            </Col>
            {
                <Popover
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
