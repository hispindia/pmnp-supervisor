import { Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Table } from "antd";
import { useTranslation } from "react-i18next";
import "./DuplicateTable.module.css";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: "1200px",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "10px 0 10px 0",
  },
  header: {
    padding: theme.spacing(1),
    borderTop: "1px solid #e0e0e0",
  },
  tableContainer: {
    flex: 1,
    padding: theme.spacing(1),
    overflow: "auto",
    position: "relative",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    flexDirection: "column",
  },
  loadingText: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const DuplicateTable = ({ members = [], visible = true, loading = false }) => {
  const classes = useStyles();

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Barangay Code",
      dataIndex: "barangayCode",
      key: "barangayCode",
      width: 120,
    },
    {
      title: "PMNP ID",
      dataIndex: "pmnpId",
      key: "pmnpId",
      width: 200,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: 150,
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      width: 80,
      render: (sex) => (sex === "1" ? "Female" : sex === "0" ? "Male" : sex),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
      render: (date) => {
        if (!date) return "";
        try {
          return new Date(date).toLocaleDateString();
        } catch (e) {
          return date;
        }
      },
    },
    {
      title: "Relationship",
      dataIndex: "relationship",
      key: "relationship",
      width: 150,
      render: (relationshipCode) => {
        // Map relationship codes to display names
        const relationshipMap = {
          1: "Head",
          2: "Spouse",
          3: "Son/Daughter",
          4: "Son/Daughter-in-law",
          5: "Grandchild",
          6: "Parent",
          7: "Parent-in-law",
          8: "Other relative",
          9: "Non-relative",
        };
        return relationshipMap[relationshipCode] || relationshipCode;
      },
    },
  ];

  // Sample data structure transformation
  const tableData = members.map((member, index) => ({
    key: member.id || index,
    index: index,
    barangayCode: member.barangayCode || "",
    pmnpId: member.pmnpId || "",
    firstName: member.firstName || "",
    lastName: member.lastName || "",
    sex: member.sex || "",
    dateOfBirth: member.dateOfBirth || "",
    relationship: member.relationship || "",
  }));

  if (!visible) {
    return null;
  }

  return (
    <Paper className={classes.container} elevation={3}>
      {/* Header */}
      <Box className={classes.header}>
        <Typography variant="h6" component="h6">
          Review Possible Duplicates
        </Typography>
      </Box>

      {/* Table Container */}
      <Box className={classes.tableContainer}>
        {loading ? (
          <div className={classes.loadingContainer}>
            <Spin size="large" />
            <Typography variant="body2" className={classes.loadingText}>
              Loading possible duplicates...
            </Typography>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{
              x: "max-content",
              y: "calc(90vh - 200px)",
            }}
            size="small"
            bordered
            rowClassName="duplicate-table-row"
          />
        )}
      </Box>
    </Paper>
  );
};

export default DuplicateTable;
