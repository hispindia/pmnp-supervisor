import { useEffect, useState } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { Button, Table, Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { TableColumn, TableFilter } from "../../utils";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../InputField";
import { HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID, DATA_COLLECT_ATTRIBUTE_ID,HOUSEHOLD_PROGRAM_ID } from "@/constants/app-config";
import { HH_STATUS_ATTR_ID } from "../constants";
import { Chip } from "@material-ui/core";
import { submitDataValues, submitEventData } from "../../redux/actions/data";
import { getTeisSucceed, setSelectedTeis } from "@/redux/actions/teis";
import { dataApi } from "@/api";
import { DATACOLLECTERCOUNT } from "@/redux/types/teis";

const RegisteredTeiListAssign = ({
  user,
  users,
  teis,
  page,
  pageSize,
  total,
  trackedEntityAttributes,
  onFilter,
  onChangePage,
  onSort,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reportId = useSelector((state) => state.common.reportId);
  const { selectedOrgUnit } = useSelector((state) => state.metadata);
  const programStages = useSelector((state) => state.metadata.programMetadata.programStages);
  const AgginedHouseHoldCount = [];
  const { selectedList } = useSelector((state) => state.teis);
  const [assignedTo, setAssignedTo] = useState("");
  const [disabledAssign, setDisabledAssign] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [count, setCount] = useState([]);
  const CountList = useSelector((state) => state.teis);

  const submitSuperisorRole = () => {
    dispatch(
      submitEventData({
        teiList: teis.instances,
        supervisor: user.username,
        orgUnit: selectedOrgUnit.id,
        assignedTo,
        selectedList,
      })
    );
  };

  const handleAssignedList = (list) => {
    var selectedTeis = selectedList;
    list.forEach((li) => {
      var tei = selectedTeis.find((tei) => tei.teiId == li.teiId);
      if (!tei) selectedTeis.push(li);
    });
    dispatch(setSelectedTeis(selectedTeis));
  };

  useEffect(() => {
    if (selectedRows.length && assignedTo) setDisabledAssign(false);
    else setDisabledAssign(true);
  }, [selectedRows, assignedTo]);


  useEffect(() => {
    if (assignedTo) {
      dispatch({
        type: DATACOLLECTERCOUNT,
        payload: {
          ou: selectedOrgUnit.id,
          program: HOUSEHOLD_PROGRAM_ID,
          assignedTo:assignedTo,
        },
      });
    }
  }, [assignedTo]);

  const pushDataCollector = (val, attr, index) => {
    const modifiedList = teis;
    //this will select the value from the option
    // console.log("modified list",modifiedList)
    // const dataCollectorIndex = modifiedList.instances[index].attributes.findIndex(attr=> attr.attribute==DATA_COLLECT_ATTRIBUTE_ID);
    // const hhStatusIndex = modifiedList.instances[index].attributes.findIndex(attr=> attr.attribute=="CNqaoQva9S2");
    // if(dataCollectorIndex != '-1') {
    //   if(!val) val = '';
    //   modifiedList.instances[index].attributes[dataCollectorIndex].value = val;

    // }
    //  if(hhStatusIndex!=-1) {
    //   modifiedList.instances[index].attributes[hhStatusIndex].value = '';
    //  }
    //this will select the value from the option
    dispatch(
      submitDataValues({
        teiId: teis.instances[index].trackedEntity,
        orgUnit: selectedOrgUnit.id,
        attribute: attr,
        value: val,
      })
    );
    dispatch(getTeisSucceed({ ...modifiedList }));
  };

  // const AssignInterviewer = {
  //   title: 'Assigned Data Collector',
  //   dataIndex: DATA_COLLECT_ATTRIBUTE_ID,
  //   key: DATA_COLLECT_ATTRIBUTE_ID,
  //    filterDropdown: <TableFilter placeholder={HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID} metadata={DATA_COLLECT_ATTRIBUTE_ID} onFilter={onFilter} />,
  //   render: (value, _, index) => (
  //     <div
  //       onClick={(e) => e.stopPropagation()}
  //     >

  //        <InputField value={value} onChange={(e) => pushDataCollector(e, DATA_COLLECT_ATTRIBUTE_ID,index)} valueSet={users}  />
  //     </div>
  //   )// remove this will default selected value in the option
  // };



  const customMetadata = {
    id: "AaFN0HwuzeK",
    displayFormName: "Assigned Data Collector",
    valueSet: [...users.map((user) => ({
      value: user.username,
      label: user.name,
    })), {value: "Not Assigned", label: "Not Assigned"}],
  };

  const AssignInterviewer = {
    title: customMetadata.displayFormName,
    dataIndex: customMetadata.id,
    key: customMetadata.id,
    sorter: true,
    filterDropdown: (
      <TableFilter placeholder={customMetadata.displayFormName} metadata={customMetadata} onFilter={onFilter} />
    ),
    render: (value) => {
      const matched = customMetadata.valueSet.find((item) => item.value === value);
      return <span>{matched?.label || value}</span>;
    },
  };

  // const AssignInterviewer = {
  //   title: customMetadata.displayFormName,
  //   dataIndex: customMetadata.id,
  //   key: customMetadata.id,
  //   sorter: true,
  //   filterDropdown: (
  //     <TableFilter
  //       placeholder={customMetadata.displayFormName}
  //       metadata={customMetadata} // Pass custom metadata object here
  //       onFilter={onFilter}
  //     />
  //   ),
  //   render: (value) => {
  //     const matched = customMetadata.valueSet.find(item => item.value === value);
  //     return <span>{matched?.label || value}</span>;
  //   },
  // };

  const reportObject = {
    dataIndex: "report",
    title: t("Report"),
    key: "report",
    render: (text, record, index) => {
      return (
        <a
          href={`../../../dhis-web-reports/index.html#/standard-report/view/${reportId}?event=${record.theLatestHHSurveyEvent}&tei=${record.teiId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LinkOutlined twoToneColor="#1677ff" />
        </a>
      );
    },
  };

  const createColumns = () => {
    let columns = trackedEntityAttributes
      .filter((tea) => tea.displayInList)
      .map((tea) => {
        const teaObject = {
          title: tea.displayFormName,
          dataIndex: tea.id,
          key: tea.id,
          sorter: true,
          valueSet: tea.valueSet,
          filterDropdown: <TableFilter placeholder={tea.displayFormName} metadata={tea} onFilter={onFilter} />,
          render: (value) => <TableColumn metadata={tea} value={value} />,
        };

        return teaObject;
      });

    const lastUpdatedObject = {
      title: t("lastUpdated"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      // filterDropdown: TableFilter(null, onFilter, {
      //   name: "lastupdated",
      //   type: "DATE",
      // }),
      render: (value) => {
        return <TableColumn metadata={null} external={{ name: "updatedAt", type: "DATE" }} value={value} />;
      },
    };
    columns.unshift(lastUpdatedObject);

    return columns;
  };

  // const createDataSource = () => {
  //   const columns = createColumns();

  //   const data = teis.instances.map((tei, index) => {
  //     const rowObject = {
  //       key: index,
  //     };

  //     rowObject.teiId = tei.trackedEntity;

  //     columns.forEach((column) => {
  //       const attribute = tei.attributes.find((attr) => {
  //         return attr.attribute === column.dataIndex;
  //       });
  //       rowObject[column.dataIndex] = attribute ? attribute.value : "";
  //     });

  //     rowObject.updatedAt = tei.updatedAt;
  //     return rowObject;
  //   });

  //   return data;
  // };

  const createDataSource = () => {
    const columns = createColumns();

    const data = teis.instances.map((tei, index) => {
      const rowObject = {
        key: `${index}`,
      };

      rowObject.teiId = tei.trackedEntity;

      if (tei.enrollments && tei.enrollments.length > 0) {
        const enrolment = tei.enrollments[0];
        const HHSurveyEvents = enrolment.events.filter((event) => {
          return event.programStage === HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID;
        });

        const theLatestHHSurveyEvent = HHSurveyEvents.sort((a, b) => {
          return new Date(b.occurredAt) - new Date(a.occurredAt);
        });

        if (theLatestHHSurveyEvent.length > 0) {
          rowObject.theLatestHHSurveyEvent = theLatestHHSurveyEvent[0].event;
        }
      }

      columns.forEach((column) => {
        const attribute = tei.attributes.find((attr) => {
          return attr.attribute === column.dataIndex;
        });

        if (column.key === HH_STATUS_ATTR_ID && attribute?.value) {
          const option = column.valueSet && column.valueSet.find((o) => o.value === attribute.value);

          rowObject["CNqaoQva9S2"] = (
            <Chip
              size="small"
              style={{ backgroundColor: option?.color, color: option?.color && "#fff", borderRadius: 4 }}
              label={option ? option.label : ""}
            />
          );
          return;
        }

        rowObject[column.dataIndex] = attribute ? attribute.value : "";
      });

      const dataCollector = tei.attributes.find((attr) => {
        return attr.attribute === DATA_COLLECT_ATTRIBUTE_ID;
      });

      if (dataCollector) {
        rowObject[DATA_COLLECT_ATTRIBUTE_ID] = dataCollector ? dataCollector.value : "";
      }

      rowObject.updatedAt = tei.updatedAt;
      return rowObject;
    });

    return data;
  };

  const createDataSourceQuery = () => {
    const columns = createColumns();

    const data = teis.rows.map((row, index) => {
      const rowObject = {
        key: index,
      };

      const teiIdIndex = teis.headers.findIndex((h) => h.name === "instance");
      rowObject.teiId = row[teiIdIndex];

      columns.forEach((column) => {
        const columnIndex = teis.headers.findIndex((h) => {
          return h.name === column.dataIndex;
        });
        rowObject[column.dataIndex] = columnIndex !== -1 ? row[columnIndex] : "";
      });
      return rowObject;
    });

    return data;
  };

  return (
    <>
      <div>
        <InputField
          label={"Assigned By"}
          value={user.username}
          valueSet={[{ label: user.username, value: user.username }]}
          disabled
        />
        <InputField
          label={"Assigned To"}
          value={assignedTo}
          valueSet={users}
          onChange={(val) => {
            setAssignedTo(val);
          }}
        />
        <div style={{ display: "flex" }}>
          <Button type="primary" disabled={disabledAssign} onClick={submitSuperisorRole}>
            Assign
          </Button>
         {assignedTo ?  <span style={{padding:'8px'}}>Household assigned : {CountList?.assignedHouseHoldcount?.trackedEntityInstances?.length}</span> : ""}
        </div>
      </div>

      <Divider />
      <div
        style={{
          display: "flex",
          gap: "16px", // Adjust gap as needed
          // padding: '5px',
          alignItems: "center",
        }}
      >
        <Typography>
          <span style={{ fontWeight: "bold" }}>Approved : </span>{" "}
          {CountList?.hhStatusList?.approved?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>Ongoing : </span> 
          {CountList?.hhStatusList?.onGoing?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>Needs Update : </span>{" "}
          {CountList?.hhStatusList?.needsUpdate?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>Pending : </span> 
          {CountList?.hhStatusList?.pending?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>Refused : </span> 
          {CountList?.hhStatusList?.refused?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>Submitted : </span>{" "}
          {CountList?.hhStatusList?.submitted?.instances?.length}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>For Masterlist Update: </span>{" "}
          {CountList?.hhStatusList?.synced?.instances?.length}
        </Typography>
         <Typography>
          <span style={{ fontWeight: "bold" }}>Non-Eligible : </span>{" "}
          {CountList?.hhStatusList?.noneligible?.instances?.length}
        </Typography>
         <Typography>
          <span style={{ fontWeight: "bold" }}>Duplicate : </span>{" "}
          {CountList?.hhStatusList?.duplicate?.instances?.length}
        </Typography>
         <Typography>
          <span style={{ fontWeight: "bold" }}>Migrated : </span>{" "}
          {CountList?.hhStatusList?.migrated?.instances?.length}
        </Typography>
         <Typography>
          <span style={{ fontWeight: "bold" }}>Other : </span>{" "}
          {CountList?.hhStatusList?.other?.instances?.length}
        </Typography>
        {/* <Typography><span style={{fontWeight:'bold'}}>Selected Row Count:</span>{selectedRows?.length}</Typography> */}
      </div>

      <Table
        rowSelection={{
          preserveSelectedRowKeys: true,
          selectedRowKeys: selectedRows,
          onChange: (keys, rows, info) => {
            setSelectedRows(keys);
            handleAssignedList(rows);
            console.log(info);
          },
          // getCheckboxProps: (data) => ({
          //   disabled: data[DATA_COLLECT_ATTRIBUTE_ID] ? true : false
          // })// check box Check will work after remove this
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              onRowClick(record, rowIndex, event);
            },
          };
        }}
        // sticky
        // tableLayout={"fixed"}
        rowHoverable={false}
        columns={[reportObject].concat(createColumns()).concat(AssignInterviewer)}
        dataSource={createDataSource()}
        scroll={{ /*y: "calc(100vh - 268px)",*/ x: 900 }}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: onChangePage,
        }}
        onChange={(pagination, filters, sorter, { currentDataSource: [], action }) => {
          if (action === "sort") {
            onSort(sorter);
          }
        }}
        onChangePage={onChangePage}
      />
    </>
  );
};

export default RegisteredTeiListAssign;
