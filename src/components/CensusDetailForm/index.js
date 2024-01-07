import React, { useEffect, useMemo } from 'react';
import { Anchor, Button, Card, Col, Form, Row, Table } from 'antd';
import InputField from '../CustomAntForm/InputField';
import SideBarContainer from '../../containers/SideBar';
import withDhis2FormItem from '../../hocs/withDhis2Field';
import CFormControl from '../CustomAntForm/CFormControl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

/* style */
import './index.css';

const CensusDetailForm = ({ onSubmit, values }) => {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const dataElements = useSelector(
        (state) => state.metadata.programMetadata.programStages[0].dataElements
    );
    console.log({ dataElements });

    const Dhis2FormItem = useMemo(
        () => withDhis2FormItem(dataElements)(CFormControl),
        []
    );

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(values);
    }, [values]);

    // useEffect(() => {
    //     form.setFieldsValue(initialValues);
    // }, [initialValues]);

    const columns = [
        {
            dataIndex: 'label',
            key: 'label',
            render: (value, row, index) => {
                const { type, styles } = row;
                return {
                    children: value,
                    props: {
                        colSpan: type === 'title' ? 4 : 1,
                        style: styles,
                    },
                };
            },
        },
        {
            dataIndex: 'input1',
            key: 'input1',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {
                        colSpan: getInputRowSpan(row, true),
                    },
                };
            },
        },
        {
            dataIndex: 'input2',
            key: 'input2',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {
                        colSpan: getInputRowSpan(row),
                    },
                };
            },
        },
        {
            dataIndex: 'input3',
            key: 'input3',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {
                        colSpan: getInputRowSpan(row),
                    },
                };
            },
        },
    ];

    const getInputRowSpan = (row, isFirstInput = false) => {
        const { type, uid } = row;
        return type === 'title' ? 0 : uid ? (isFirstInput ? 3 : 0) : 1;
    };

    const tableRenderData = [
        {
            type: 'data',
            name: t('1. How many babies born alive in the family?'),
            uid: 'skFDIWZmgTC',
            styles: {},
        },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow2'),
        //     uid: 'AB4m6KuUXF8',
        //     styles: {},
        // },
        {
            type: 'title',
            name: t('2. Location of birth (Including alive and stillbith)'),
            styles: {},
        },
        {
            type: 'data',
            name: t('ກ. Home?'),
            uid: 'jxfyOMxkbIw',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຂ. Health Center?'),
            uid: 'XM59B0Lw2Md',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຄ. District Hospital'),
            uid: 'y3h4wxW3w50',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ງ. Provincial Hospital'),
            uid: 'ispm3X8fxSY',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຈ. Central Hospital'),
            uid: 'U4fdHCMef6x',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ສ. Private clinic/Private hospital'),
            uid: 'SJ0Cvi4jeGy',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຊ. Overseas'),
            uid: 'DZqf1SBDDqv',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຍ. Other'),
            uid: 'w19F9i9XORa',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'title',
            name: t('3. Who assisted the birth(s)?'),
            styles: {},
        },
        {
            type: 'data',
            name: t('ກ. Self (No assistance)'),
            uid: 'hRlVw3IeQ45',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຂ. Husband or relative'),
            uid: 'c8E0s3lqCmD',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຄ. Village health volunteer'),
            uid: 'iYpP9mXDw1W',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ງ. Skilled birth attendant (Nurse, Mid wife, Doctor)'),
            uid: 'FOTKm0DKO4Q',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຈ. Other than specify above'),
            uid: 'YIg4eMjDYLg',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t(
                '4. How many babies born dead (stillbirth) from in the family?'
            ),
            uid: 'QteYoL0Yy6K',
            styles: {},
        },
        {
            type: 'data',
            name: t('5. How many children under one year died in family?'),
            uid: 'm5y4aLbmIOO',
            styles: {},
        },
        {
            type: 'data',
            name: t('6. How many children age one to 4 years died?'),
            uid: 'akAYIsCrRwV',
            styles: {},
        },
        {
            type: 'data',
            name: t('7. How many children age 5 to 19 years died?'),
            uid: 'mPTyd0nP5Xx',
            styles: {},
        },
        {
            type: 'data',
            name: t(
                '8. How many women died due to pregnancy, delivery or within 42 days after giving birth?'
            ),
            uid: 'LmGX6VpLkIX',
            styles: {},
        },
        {
            type: 'data',
            name: t('9. How many people died in total in the family?'),
            uid: 'p2P8g0MnDBK',
            styles: {},
        },

        {
            type: 'title',
            name: t('10. Family Planning'),
            styles: {},
        },
        {
            type: 'data',
            name: t(
                '10.1. How many women(15-49 years) currently using family planning and main method?'
            ),
            uid: 'ztDjhjZoEGe',
            styles: {},
        },
        {
            type: 'data',
            name: t('ກ. contraceptive pill'),
            uid: 'w73XYMu84K1',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຂ. depose(injectable)'),
            uid: 'W5hvU3H2QY5',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຄ. condom(male/female)'),
            uid: 'S1WAIB8yKgF',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ງ. Implant'),
            uid: 'ZXOAIBtP7ag',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຈ. IUD'),
            uid: 'nZWuXN9NcOB',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ສ. emergency pill'),
            uid: 'gFg12NU3oJu',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຊ. sterilization(men&women)'),
            uid: 'TcsUpke05hG',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ຍ. other modern contraceptive'),
            uid: 'iR1xbBp4DbI',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('ດ. other traditional methods'),
            uid: 'q8XozNLbeO9',
            styles: {
                paddingLeft: '50px',
            },
        },

        // 10.2. How many women(15-49 years) currently using family planning and where?
        {
            type: 'data',
            name: t(
                '10.2. How many women(15-49 years) currently using family planning and where?'
            ),
            uid: 'IDz3cuoy2Ix',
        },
        {
            type: 'data',
            name: t('in public facility'),
            uid: 'rHsyapbYSIW',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('at private clinic/pharmacy'),
            uid: 'rHsyapbYSIW',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('from outreach/VHV'),
            uid: 'rHsyapbYSIW',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('Overseas'),
            uid: 'rHsyapbYSIW',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('Other'),
            uid: 'rHsyapbYSIW',
            styles: {
                paddingLeft: '50px',
            },
        },

        // Family Drinking Water Source
        {
            type: 'title',
            name: t(
                '11. What is the primary source of drinking water does the family use and it is within 30min of reach?'
            ),
        },
        {
            type: 'data',
            name: t('Pied water'),
            uid: 'vbeBy5pTcsh',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('Tube-well/borehole'),
            uid: 'DOJ1KXBIaHJ',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('Protected well/spring'),
            uid: 'c3VITy8MoRr',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('Bottled water'),
            uid: 'ymrnL6wFesR',
            styles: {
                paddingLeft: '50px',
            },
        },
        {
            type: 'data',
            name: t('River/lake or other source'),
            uid: 'KO8EZJGbBcK',
            styles: { paddingLeft: '50px' },
        },

        // Family Toilet
        {
            type: 'title',
            name: t('12. What kind of toilet is used by the family?'),
            // uid: 'BDi5vJcbiMv',
            styles: {},
        },
        {
            type: 'data',
            name: t('Dry latrine(including dig and cover)'),
            uid: 'qxeroTrT6i0',
            styles: { paddingLeft: '50px' },
        },
        {
            type: 'data',
            name: t('Pour-flush into open drain'),
            uid: 'FLYIWIldscU',
            styles: { paddingLeft: '50px' },
        },
        {
            type: 'data',
            name: t('Pour-flush into the system'),
            uid: 'QXvfmgXP35s',
            styles: { paddingLeft: '50px' },
        },
        {
            type: 'data',
            name: t('There is a toilet but not using'),
            uid: 'Uk1QRspFIKO',
            styles: { paddingLeft: '50px' },
        },
        {
            type: 'data',
            name: t('Shared toilet'),
            uid: 'PQaXSiUfEeT',
            styles: { paddingLeft: '50px' },
        },
        {
            type: 'data',
            name: t('Open defecation'),
            uid: 'uB1AkpztVHH',
            styles: { paddingLeft: '50px' },
        },

        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow42'),
        //     uid: 'j7cW1UaMa63',
        //     styles: {},
        // },

        // {
        //     type: 'title',
        //     name: t('CensusDetailFormRow43'),
        //     styles: {},
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow44'),
        //     some: 'Gxezw4UQoXw',
        //     alot: 'wIzDqcKjmkN',
        //     thirdRowTitle: t('CantSeeAtAll'),
        //     thirdRowId: 'YEU5VICXNwZ',
        //     styles: {
        //         paddingLeft: '50px',
        //     },
        // },
        // {
        //     type: 'title',
        //     name: t('CensusDetailFormRow45'),
        //     styles: {
        //         paddingLeft: '50px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow46'),
        //     some: 'x93PtyuyJ6P',
        //     alot: 'Fjhjy1sAfoH',
        //     thirdRowTitle: t('CantHear'),
        //     thirdRowId: 'GHiu2Bv4pB2',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow47'),
        //     some: 'SFtjfOMOqhC',
        //     alot: 'huimFcUSvAj',
        //     thirdRowTitle: t('CantSpeak'),
        //     thirdRowId: 'jKCzLrcr7N1',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow48'),
        //     some: 'A6wiJF60Dxq',
        //     alot: 'kgDUjmHDJtD',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'PtedVjCU0X6',
        //     styles: {
        //         paddingLeft: '50px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow49'),
        //     some: 'Hyaa1lln5gc',
        //     alot: 'W4oKLRaCF0w',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'Zd72t9Bu4le',
        //     styles: {
        //         paddingLeft: '50px',
        //     },
        // },
        // {
        //     type: 'title',
        //     name: t('CensusDetailFormRow50'),
        //     styles: {
        //         paddingLeft: '50px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow51'),
        //     some: 'V1lWBXRaFOl',
        //     alot: 'UzQ1LqhXavz',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'uQHuVw0nNpf',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow52'),
        //     some: 'PpmAQlkz248',
        //     alot: 'k1kP5jCQNLv',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'dwAJpsKxrAo',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow53'),
        //     some: 'ZXUtPf4bF6q',
        //     alot: 'qhC2MsiSSKF',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'mLCpxxrrc9z',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow54'),
        //     some: 'bUcwd5hJBV8',
        //     alot: 'SAnc2g0SP9n',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'zbBfUQI4mbt',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
        // {
        //     type: 'data',
        //     name: t('CensusDetailFormRow55'),
        //     some: 'C54AYCGZ4yz',
        //     alot: 'TbO68eaqTma',
        //     thirdRowTitle: t('CantDoAtAll'),
        //     thirdRowId: 'DTGiBP2EZbm',
        //     styles: {
        //         paddingLeft: '75px',
        //     },
        // },
    ];

    const dependentFields = tableRenderData.map((d) => d.uid);

    const dataSource = tableRenderData.map((row, index) => {
        const { uid, some, alot, thirdRowTitle, thirdRowId, name, type } = row;
        switch (type) {
            case 'title': {
                return {
                    ...row,
                    key: index,
                    label: name,
                };
            }
            default: {
                if (uid) {
                    return {
                        ...row,
                        key: index,
                        label: name,
                        input1: (
                            <Dhis2FormItem noStyle id={uid}>
                                <InputField size="small" />
                            </Dhis2FormItem>
                        ),
                    };
                } else {
                    return {
                        ...row,
                        key: index,
                        label: name,
                        input1: (
                            <Dhis2FormItem
                                displayFormName={t('some')}
                                id={some}
                            >
                                <InputField size="small" />
                            </Dhis2FormItem>
                        ),
                        input2: (
                            <Dhis2FormItem
                                displayFormName={t('alot')}
                                id={alot}
                            >
                                <InputField size="small" />
                            </Dhis2FormItem>
                        ),
                        input3: (
                            <Dhis2FormItem
                                displayFormName={t(thirdRowTitle)}
                                id={thirdRowId}
                            >
                                <InputField size="small" />
                            </Dhis2FormItem>
                        ),
                    };
                }
            }
        }
    });

    return (
        <Form
            initialValues={{}}
            form={form}
            onFinish={(fieldsValue) => {
                onSubmit(fieldsValue);
            }}
        >
            <Row wrap={false} gutter={1}>
                <Col className="leftBar">
                    <Row justify="center">
                        <Button type="primary" htmlType="submit">
                            {t('save')}
                        </Button>
                    </Row>

                    <SideBarContainer />
                </Col>
                <Col className="rightBar">
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        showHeader={false}
                        dataSource={dataSource}
                        columns={columns}
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default CensusDetailForm;
