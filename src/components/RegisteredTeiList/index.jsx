import { DeleteTwoTone, LinkOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { useTranslation } from "react-i18next";
import { TableColumn, TableFilter } from "../../utils";
import "./index.css";
import { isImmutableYear } from "@/utils/event";
import { useSelector } from "react-redux";
import { HOUSEHOLD_SURVEY_PROGRAM_STAGE_ID } from "@/constants/app-config";

const RegisteredTeiList = ({
  teis,
  page,
  pageSize,
  total,
  trackedEntityAttributes,
  onDeleteTei,
  onFilter,
  onChangePage,
  onSort,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const { immutableYear } = useSelector((state) => state.metadata);

  const deleteColumn = {
    width: 56,
    key: "deleteKey",
    render: (text, record, index) => (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "20px",
          height: "20px",
        }}
      >
        <Popconfirm
          placement="bottomLeft"
          title={t("deleteDialogTitle")}
          onConfirm={() => onDeleteTei(record)}
          okText={t("yes")}
          cancelText={t("no")}
        >
          <Button
            icon={<DeleteTwoTone twoToneColor="#cf1322" />}
            type="text"
            size="small"
            danger
            disabled={record?.BUEzQEErqa7 ? isImmutableYear(record.BUEzQEErqa7, immutableYear) : false}
          />
        </Popconfirm>
      </div>
    ),
  };

  const reportObject = {
    dataIndex: "report",
    title: t("Report"),
    key: "report",
    render: (text, record, index) => {
      return (
        <a
          href={`/pmnp_is/dhis-web-reports/index.html#/standard-report/view/W3Ryrjl5sbd?event=${record.theLatestHHSurveyEvent}&tei=${record.teiId}`}
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

  const createDataSource = () => {
    const columns = createColumns();

    const data = teis.instances.map((tei, index) => {
      const rowObject = {
        key: index,
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
        rowObject[column.dataIndex] = attribute ? attribute.value : "";
      });

      rowObject.updatedAt = tei.updatedAt;
      return rowObject;
    });

    return data;
  };

  return (
    <Table
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            onRowClick(record, rowIndex, event);
          },
        };
      }}
      // sticky
      // tableLayout={"fixed"}
      columns={[deleteColumn, reportObject].concat(createColumns())}
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
  );
};

export default RegisteredTeiList;
