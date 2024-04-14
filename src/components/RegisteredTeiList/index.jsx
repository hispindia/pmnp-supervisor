import React from "react";
import { Button, Popconfirm } from "antd";
import Table from "ant-responsive-table";
import "./index.css";
import { TableColumn, TableFilter } from "../../utils";
import { DeleteTwoTone } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

/* Components */

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
  const deleteColumn = {
    width: 72,
    render: (text, record, index) => {
      return (
        <div onClick={(e) => e.stopPropagation()}>
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
              danger
            />
          </Popconfirm>
        </div>
      );
    },
    showOnResponse: true,
    showOnDesktop: true,
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
          filterDropdown: (
            <TableFilter
              placeholder={tea.displayFormName}
              metadata={tea}
              onFilter={onFilter}
            />
          ),
          showOnResponse: true,
          showOnDesktop: true,
          render: (value) => <TableColumn metadata={tea} value={value} />,
        };
        return teaObject;
      });
    const lastUpdatedObject = {
      title: t("lastUpdated"),
      dataIndex: "lastupdated",
      key: "lastupdated",
      sorter: true,
      // filterDropdown: TableFilter(null, onFilter, {
      //   name: "lastupdated",
      //   type: "DATE",
      // }),
      render: (value) => (
        <TableColumn
          metadata={null}
          external={{ name: "lastupdated", type: "DATE" }}
          value={value}
        />
      ),
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

      columns.forEach((column) => {
        const attribute = tei.attributes.find((attr) => {
          return attr.attribute === column.dataIndex;
        });
        rowObject[column.dataIndex] = attribute ? attribute.value : "";
      });
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
        rowObject[column.dataIndex] =
          columnIndex !== -1 ? row[columnIndex] : "";
      });
      return rowObject;
    });

    return data;
  };

  return (
    <Table
      antTableProps={{
        onRow: (record, rowIndex) => {
          return {
            onClick: (event) => {
              onRowClick(record, rowIndex, event);
            },
          };
        },
        sticky: true,
        columns: [deleteColumn].concat(createColumns()),
        dataSource: createDataSource(),
        scroll: { y: "calc(100vh - 268px)" },
        bordered: true,

        pagination: {
          position: ["bottomCenter"],
          showSizeChanger: true,
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: onChangePage,
        },
        onChangePage: onChangePage,
        onChange: (
          pagination,
          filters,
          sorter,
          { currentDataSource: [], action }
        ) => {
          if (action === "sort") {
            onSort(sorter);
          }
        },
      }}
      mobileBreakPoint={768}

      // onRow={(record, rowIndex) => {
      //   return {
      //     onClick: (event) => {
      //       onRowClick(record, rowIndex, event);
      //     },
      //   };
      // }}
      // sticky
      // tableLayout={"fixed"}
      // columns={[deleteColumn].concat(createColumns())}
      // dataSource={createDataSource()}
      // scroll={{ y: "calc(100vh - 268px)" }}
      // bordered={true}
      // pagination={{
      //   position: ["bottomCenter"],
      //   showSizeChanger: true,
      //   current: page,
      //   pageSize: pageSize,
      //   total: total,
      //   onChange: onChangePage,
      // }}
      // onChange={(
      //   pagination,
      //   filters,
      //   sorter,
      //   { currentDataSource: [], action }
      // ) => {
      //   if (action === "sort") {
      //     onSort(sorter);
      //   }
      // }}
      // onChangePage={onChangePage}
    />
  );
};

export default RegisteredTeiList;
