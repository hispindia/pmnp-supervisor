import { generateUid, pickTranslation, TableColumn } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CHILD_VACCINES, FORM_ACTION_TYPES, HAS_INITIAN_NOVALUE, MEMBER_HOUSEHOLD_UID } from "../constants";

// Icon

import {
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
  HOUSEHOLD_INTERVIEW_TIME_DE_ID,
  MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
  MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
  MEMBER_TRACKED_ENTITY_TYPE_ID,
} from "@/constants/app-config";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";
import { usePushData } from "@/hooks/usePushData";
import { cn } from "@/libs/utils";
import { submitEvent } from "@/redux/actions/data";
import { getQuarterlyFromDate } from "@/utils/date";
import { transformEvent } from "@/utils/event";
import { Chip } from "@material-ui/core";
import { Button, Modal, Table } from "antd";
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears, toDate } from "date-fns";
import _ from "lodash";
import CaptureForm from "../CaptureForm";
import { transformData } from "../CascadeTable/utils";
import "../CustomStyles/css/bootstrap.min.css";
import {
  childHeathRules,
  childNutritionRules,
  demographicDetailRules,
  handleAgeAttrsOfTEI,
  handleAgeFields,
  handleZScore,
  hideSectionRules,
} from "./houseHoldMemberRules";
import "./interview-detail-table.css";
import { clearHiddenFieldData, generateTEIDhis2Payload, getFullName, updateMetadata } from "./utils";

const calculateAge = (dateOBbirth, currentDate) => {
  const years = differenceInYears(currentDate, dateOBbirth);
  const months = differenceInMonths(currentDate, dateOBbirth);
  const weeks = differenceInWeeks(currentDate, dateOBbirth);
  const days = differenceInDays(currentDate, dateOBbirth);

  return { years, months, weeks, days };
};

const HouseHoldMemberTable = ({ interviewData, onClose = () => {}, disabled }) => {
  const { t, i18n } = useTranslation();
  const { pustTei } = usePushData();
  const dispatch = useDispatch();
  const locale = i18n.language || "en";
  const interviewId = interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID];
  const { interviewCascadeData } = useInterviewCascadeData(interviewData);
  const { currentInterviewCascade } = useSelector((state) => state.data.tei.data);
  const { programMetadataMember, selectedOrgUnit } = useSelector((state) => state.metadata);

  const [originMetadata, stageDataElements] = convertOriginMetadata(programMetadataMember, interviewCascadeData);

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));
  const [dataValuesTranslate, setDataValuesTranslate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [formStatus, setFormStatus] = useState(FORM_ACTION_TYPES.NONE);

  const createColumns = () => {
    const noColumn = {
      title: t("Sr. No."),
      dataIndex: "key",
      key: "no",
      render: (key) => key + 1,
    };

    const statusColumn = {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (status, row) => {
        if (!row.ableToStart) return <Chip className="rounded font-medium !text-gray-500" size="small" label="NA" />;
        const completed = status === "COMPLETED";
        return (
          <Chip
            className={cn(
              "rounded font-medium",
              completed ? "!bg-green-100 !text-green-700" : "!bg-yellow-100 !text-yellow-700"
            )}
            size="small"
            label={completed ? t("Submitted") : t("Pending")}
          />
        );
      },
    };

    const actionColumn = {
      title: t("Action"),
      dataIndex: "status",
      key: "action",
      render: (status, row) => {
        if (!row.ableToStart) {
          return (
            <Button size="small" disabled className="font-medium">
              NA
            </Button>
          );
        }

        const completed = status === "COMPLETED";

        return (
          <Button size="small" type={completed ? "default" : "primary"}>
            {completed ? t("View") : t("Start")}
          </Button>
        );
      },
    };

    const displayList = ["Cn37lbyhz6f", "PIGLwIaw0wy", "Qt4YSwPxw0X", "QAYXozgCOHu"];

    let columns = metadata
      .filter((tea) => displayList.includes(tea.id))
      .map((tea) => {
        const teaObject = {
          title: pickTranslation(tea, i18n.language),
          dataIndex: tea.id,
          key: tea.id,
          valueSet: tea.valueSet,
          render: (value) => <TableColumn metadata={tea} value={value} />,
        };

        return teaObject;
      });

    const ageColumnsMapping = {
      Hc9Vgt4LXjb: "years",
      RoSxLAB5cfo: "months",
      Gds5wTiXoSK: "weeks",
    };

    const ageColumns = metadata
      .filter((tea) => Object.keys(ageColumnsMapping).includes(tea.id))
      .map((tea) => {
        const teaObject = {
          title: pickTranslation(tea, i18n.language),
          dataIndex: tea.id,
          key: tea.id,
          valueSet: tea.valueSet,
          render: (value, row, index) => {
            const dateOfBirth = new Date(row["fJPZFs2yYJQ"]);
            const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);
            const ages = calculateAge(dateOfBirth, eventDate);
            const ageValue = ages[ageColumnsMapping[tea.id]];

            return <TableColumn metadata={tea} value={ageValue} />;
          },
        };

        return teaObject;
      })
      .reverse();

    return [noColumn, ...columns, ...ageColumns, statusColumn, actionColumn];
  };

  const showData = useMemo(() => {
    return transformData(metadata, data, dataValuesTranslate, locale);
  }, [metadata, data, dataValuesTranslate, locale]);

  const handleEditRow = (e, row, rowIndex, type) => {
    // Update data
    let newData = _.cloneDeep(data);
    newData[rowIndex] = { ...row };

    setData(newData);

    let updatedMetadata = updateMetadata(metadata, newData);
    console.log("handleEditRow", { updatedMetadata, newData });
    setMetadata([...updatedMetadata]);

    // save event
    const interviewEvents = interviewCascadeData[selectedRowIndex]?.events || [];
    console.log({ interviewCascadeData, interviewEvents, rowIndex, selectedRowIndex, row });

    const demographicDataValues = {};
    stageDataElements[MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID].forEach((de) => {
      demographicDataValues[de.id] = row[de.id];
    });

    const scorecardSurveyDataValues = {};
    stageDataElements[MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID].forEach((de) => {
      scorecardSurveyDataValues[de.id] = row[de.id];
    });

    // init new event
    const trackedEntity = row.id;
    const enrollment = row.enrId;
    const occurredAt = interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID];
    const orgUnit = selectedOrgUnit.id;
    const program = programMetadataMember.id;

    const newEvent = {
      enrollment,
      occurredAt,
      program,
      orgUnit,
      trackedEntity,
      trackedEntityType: MEMBER_TRACKED_ENTITY_TYPE_ID,
      dueDate: occurredAt,
      status: "ACTIVE",
      _isDirty: true,
    };

    const status = type == "submit" ? "COMPLETED" : "ACTIVE";

    let demographicEventPayload;
    const foundDemographicEvent = interviewEvents.find((e) => e.programStage === MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID);
    if (!foundDemographicEvent) {
      demographicEventPayload = transformEvent({
        ...newEvent,
        event: generateUid(),
        dataValues: demographicDataValues,
        status,
        eventStatus: status,
        programStage: MEMBER_DEMOGRAPHIC_PROGRAM_STAGE_ID,
      });
    } else {
      demographicEventPayload = transformEvent({
        ...foundDemographicEvent,
        _isDirty: true,
        status,
        eventStatus: status,
        dataValues: demographicDataValues,
      });
    }
    // only push -> do not refresh tei
    dispatch(submitEvent(demographicEventPayload, false));

    let scorecardSurveyEventPayload;
    const foundScorecardSurveyEvent = interviewEvents.find(
      (e) => e.programStage === MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID
    );
    if (!foundScorecardSurveyEvent) {
      scorecardSurveyEventPayload = transformEvent({
        ...newEvent,
        event: generateUid(),
        dataValues: scorecardSurveyDataValues,
        status,
        eventStatus: status,
        programStage: MEMBER_SCORECARD_SURVEY_PROGRAM_STAGE_ID,
      });
    } else {
      scorecardSurveyEventPayload = transformEvent({
        ...foundScorecardSurveyEvent,
        _isDirty: true,
        status,
        eventStatus: status,
        dataValues: scorecardSurveyDataValues,
      });
    }

    // default refresh tei and loading for the last
    dispatch(submitEvent(scorecardSurveyEventPayload));

    // update member TEI
    const currentTei = newData[rowIndex];
    let updatedMemberTei = generateTEIDhis2Payload({
      teiData: currentTei,
      programMetadata: programMetadataMember,
      orgUnit,
    });

    pustTei({ currentTei: updatedMemberTei });

    const events = [demographicEventPayload, scorecardSurveyEventPayload];
    console.log("update member events:", { events, scorecardSurveyDataValues });
    // clearForm();
  };

  const editRowCallback = (metadataOrigin, previousData, data, code, value) => {
    // WARNING: if it's hidden, the data will be removed

    let metadata = (metaId) => {
      if (!metadataOrigin[metaId]) return;
      return metadataOrigin[metaId];
    };

    console.log("HouseHoldMemberTable", { previousData, data, code, value, interviewData });

    // stage
    metadata(HOUSEHOLD_INTERVIEW_ID_DE_ID).disabled = true;

    // Hide rest of the form if Membership status = "Deceased" or Migrated to "Non-PMNP Area" or "Not part of the HH"
    const hhMemberStatus = data["Rb0k4fOdysI"];

    if (hhMemberStatus === "001" || hhMemberStatus === "004" || hhMemberStatus === "002") {
      Object.keys(metadataOrigin).forEach((de) => {
        if (
          [
            HOUSEHOLD_INTERVIEW_ID_DE_ID,
            "Rb0k4fOdysI",
            "Hc9Vgt4LXjb",
            "RoSxLAB5cfo",
            "Gds5wTiXoSK",
            "ICbJBQoOsVt",
            "d2n5w4zpxuo",
            "xDSSvssuNFs",
            "X2Oln1OyP5o",
            "H42aYY9JMIR",
          ].includes(de) ||
          metadata(de).isAttribute
        ) {
          return;
        }
        metadata(de).hidden = true;
      });

      clearHiddenFieldData(metadataOrigin, data, (item) => (item.isAttribute ? false : true));

      // workaround for hidden section
      if (hhMemberStatus === "004") metadata("NrSC3yBU0AE").hidden = false;

      return;
    } else {
      Object.keys(metadataOrigin).forEach((de) => {
        if (!metadata(de).isAttribute) metadata(de).hidden = false;
      });
    }

    if (["004", "005", "006", "007"].includes(hhMemberStatus)) {
      metadata("NrSC3yBU0AE").hidden = false;
    } else {
      metadata("NrSC3yBU0AE").hidden = true;
    }

    // ages de
    metadata("d2n5w4zpxuo").hidden = true;
    metadata("xDSSvssuNFs").hidden = true;
    metadata("X2Oln1OyP5o").hidden = true;
    metadata("H42aYY9JMIR").hidden = true;

    data[HOUSEHOLD_INTERVIEW_ID_DE_ID] = interviewId;

    data["C4b8S7zjs0g"] = data[MEMBER_HOUSEHOLD_UID];
    metadata("C4b8S7zjs0g").disabled = true;

    metadata(HOUSEHOLD_INTERVIEW_TIME_DE_ID).disabled = true;
    data[HOUSEHOLD_INTERVIEW_TIME_DE_ID] = getQuarterlyFromDate(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    const eventDate = new Date(interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]);

    const dateOBbirth = new Date(data["fJPZFs2yYJQ"]);
    const ages = calculateAge(dateOBbirth, eventDate);
    const { years, months, weeks, days } = ages;

    const lmpDate = data["qlt8LOSENj8"] && new Date(data["qlt8LOSENj8"]);
    const aogInWeeks = differenceInWeeks(eventDate, lmpDate);

    // Populate Trimester based on AOG logic
    if (lmpDate && aogInWeeks >= 8 && aogInWeeks <= 40) {
      if (aogInWeeks >= 8 && aogInWeeks <= 13) {
        data["SCpNPXpe2Ls"] = "1"; // Trimester 1
      } else if (aogInWeeks > 13 && aogInWeeks <= 23) {
        data["SCpNPXpe2Ls"] = "2"; // Trimester 2
      } else if (aogInWeeks > 23 && aogInWeeks <= 40) {
        data["SCpNPXpe2Ls"] = "3"; // Trimester 3
      }
    } else {
      // Clear trimester if LMP is not valid or AOG is out of range
      data["SCpNPXpe2Ls"] = null;
    }

    // reset ZkoIX2TigZA
    metadata("ZkoIX2TigZA").hidden = false;
    // if ZkoIX2TigZA in hidden section will = true
    hideSectionRules(metadata, data, programMetadataMember, ages);
    // if lmpDate && aogInWeeks < 12 => ZkoIX2TigZA will = true
    if (lmpDate && aogInWeeks < 12) metadata("ZkoIX2TigZA").hidden = true;

    const aog1 = ["M5nofSFKw1e"];
    const aog23 = ["AZXJKuGOM6n", "MR4IiYlxfsx"];
    const aog45678 = ["ZMjGmieu8Iz", "Bdd2wmXbizw", "Plkdcpkb04F", "AG21Y0hmrAu", "RAWt5NBWtvB"];
    aog1.forEach(
      (de) =>
        (metadata(de).hidden =
          !lmpDate || data["wqR0L5WGV6S"] !== "true" || aogInWeeks < 8 || aogInWeeks > 40 || metadata(de).hidden)
    );
    aog23.forEach(
      (de) =>
        (metadata(de).hidden =
          !lmpDate || data["wqR0L5WGV6S"] !== "true" || aogInWeeks <= 13 || aogInWeeks > 40 || metadata(de).hidden)
    );
    aog45678.forEach(
      (de) =>
        (metadata(de).hidden =
          !lmpDate || data["wqR0L5WGV6S"] !== "true" || aogInWeeks <= 23 || aogInWeeks > 40 || metadata(de).hidden)
    );

    const aogPPW = [
      "l23OPIamSVU",
      "WdfB53AeOSD",
      "vPHSleGlsCM",
      "ciExesjoFlQ",
      "LrSJ5Je5N9B",
      "tTOMrF0wYr3",
      "Y2F9wTOlNMM",
      "Y3mZGw9YGqr",
    ];

    aogPPW.forEach((de) => (metadata(de).hidden = data["mT44qeiiVpv"] !== "true" || metadata(de).hidden));

    data["Hc9Vgt4LXjb"] = years;
    data["RoSxLAB5cfo"] = months;
    data["Gds5wTiXoSK"] = weeks;
    data["ICbJBQoOsVt"] = days;

    // z-score
    // Height	CY4OTulUceX
    // Weight	iFiOPAxrJIF
    // Age in months	RoSxLAB5cfo
    // Gender	Qt4YSwPxw0X
    metadata("TON0hSWcaw7").disabled = true; // HFA status
    metadata("Wj1Re9XKW5P").disabled = true; // WFA status
    metadata("RXWSlNxAwq1").disabled = true; // WFH status
    metadata("s3q2EVu3qe0").disabled = true; // MUAC status

    if (data["uYWxyRYP7GN"] && data["CY4OTulUceX"] && data["iFiOPAxrJIF"] && data["Qt4YSwPxw0X"]) {
      const monthsByLastMonitoring = differenceInMonths(new Date(data["uYWxyRYP7GN"]), dateOBbirth);

      handleZScore(data, {
        ageInMonths: monthsByLastMonitoring,
        heightInCm: data["CY4OTulUceX"],
        weight: data["iFiOPAxrJIF"],
        gender: data["Qt4YSwPxw0X"],
      });
    }

    // INT_Visit number
    data["Wdg76PCqsBn"] = interviewData["Wdg76PCqsBn"];

    demographicDetailRules(metadata, data, ages);
    childHeathRules(metadata, data, ages, code, CHILD_VACCINES);
    childNutritionRules(metadata, data, ages);
    handleAgeAttrsOfTEI(data, ages);
    clearHiddenFieldData(metadataOrigin, data, (item) => (item.isAttribute ? false : true));
    handleAgeFields(metadata, ages);

    // hide all attribute
    Object.keys(metadataOrigin).forEach((key) => {
      if (metadataOrigin[key].isAttribute) metadataOrigin[key].hidden = true;
    });

    if (!data["B3jiLplNUeS"]) data["B3jiLplNUeS"] = "na";
  };

  const clearForm = () => {
    setSelectedData({});
    setMetadata(_.cloneDeep(originMetadata));
    setSelectedRowIndex(null);
    setFormStatus(FORM_ACTION_TYPES.NONE);
  };

  const rowEvents = (row, rowIndex) => ({
    onClick: () => {
      if (!row.ableToStart) return;
      const rowData = data[rowIndex];
      console.log("selected", rowData);
      setSelectedData(rowData);
      setSelectedRowIndex(rowIndex);
      setFormStatus(FORM_ACTION_TYPES.EDIT);
    },
  });

  useEffect(() => {
    let tempDataValuesTranslate = metadata
      .filter((e) => e.valueSet && e.valueSet.length > 0)
      .reduce((obj, e) => {
        obj[e.code] = e.valueSet.reduce((ob, op) => {
          ob[op.value] = op.label;
          if (op.translations) {
            ob[op.value] = { ...op.translations, en: op.label };
          }
          return ob;
        }, {});
        return obj;
      }, {});

    setDataValuesTranslate(tempDataValuesTranslate);

    return () => {
      clearForm();
    };
  }, []);

  useEffect(() => {
    const cascadeData = interviewCascadeData.map((i) => i.memberData);
    // const sorted = _.sortBy(cascadeData, (item) => Number(item["QAYXozgCOHu"] || 0));
    setData(cascadeData);
    if (selectedRowIndex !== null) {
      setSelectedData(cascadeData[selectedRowIndex]);
    }
  }, [currentInterviewCascade, selectedRowIndex]);

  const rowClasses = (row, rowIndex) => {
    if (row.isSaved && row.status === "COMPLETED") {
      return "disabled-row";
    } else {
      return "open-row";
    }
  };

  // remove programSections
  const { programSections, ...formProgramMetadata } = programMetadataMember;

  return (
    <div className="interview-table">
      <Modal
        footer={null}
        open={formStatus === FORM_ACTION_TYPES.EDIT}
        onCancel={clearForm}
        forceRender={false}
        centered
        className="!w-full sm:!w-[90dvw] lg:!w-[80dvw] xxl:!w-[70dvw]"
        maskProps={{ className: "bg-transparent" }}
        title={
          <div>
            <p className="text-lg">{t("familyMemberDetails")}</p>
            <p className="text-base text-gray-500">
              {formStatus !== FORM_ACTION_TYPES.ADD_NEW && getFullName(selectedData)}
            </p>
          </div>
        }
      >
        <div className="h-[85dvh] overflow-y-auto overflow-x-hidden pb-6">
          {selectedData ? (
            <CaptureForm
              formProgramMetadata={formProgramMetadata}
              key={selectedData.updatedAt}
              locale={locale}
              metadata={metadata}
              rowIndex={selectedRowIndex}
              data={_.cloneDeep(selectedData)}
              formStatus={!disabled ? formStatus : FORM_ACTION_TYPES.VIEW}
              setFormStatus={setFormStatus}
              handleEditRow={handleEditRow}
              handleAddNewRow={() => {}}
              onCancel={clearForm}
              editRowCallback={editRowCallback}
              maxDate={new Date()}
              minDate={new Date(`1900-12-31`)}
              showSubmitButtons
              formName="HouseHoldMemberTable"
            />
          ) : null}
        </div>
      </Modal>
      <div className="overflow-x-auto">
        <Table
          onRow={rowEvents}
          showSorterTooltip={false}
          rowHoverable={false}
          columns={createColumns()}
          dataSource={showData}
          className="my-2 px-1"
          pagination={false}
        />
      </div>
    </div>
  );
};

const convertOriginMetadata = (programMetadataMember, cascadeMembers) => {
  const metadata = [];
  const stageDataElements = {};

  const trackedEntityAttributes = programMetadataMember.trackedEntityAttributes.map((attr) => ({
    ...attr,
    code: attr.id,
    hidden: true,
    isAttribute: true,
  }));

  metadata.push(...trackedEntityAttributes);

  const valueSetListOfFemales = createValueSet(cascadeMembers, "PIGLwIaw0wy", "Cn37lbyhz6f");

  const programStagesDataElements = programMetadataMember.programStages.reduce((acc, stage) => {
    stage.dataElements.forEach((de) => {
      // Drop down for mother’s name
      if (de.id === "q0WEgMBwi0p") {
        de.valueSet = valueSetListOfFemales;
      }

      de.code = de.id;
      de.hidden = HAS_INITIAN_NOVALUE.includes(de.id);
    });

    stageDataElements[stage.id] = [...stage.dataElements];

    return [...acc, ...stage.dataElements];
  }, []);

  metadata.push(...programStagesDataElements);

  return [metadata, stageDataElements];
};

export default HouseHoldMemberTable;

const createValueSet = (cascadeMembers, labelID, valueID) => {
  return cascadeMembers.reduce((acc, curr) => {
    const label = curr[labelID];
    const value = curr[valueID];

    acc.push({
      value,
      label,
    });

    return acc;
  }, []);
};
