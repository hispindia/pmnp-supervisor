import moment from "moment";
import React from "react";
import InputField from "../components/InputField";
import { DatePicker, Input, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Search } = Input;

const sample = (d, fn = Math.random) => {
  if (d.length === 0) {
    return;
  }
  return d[Math.round(fn() * (d.length - 1))];
};

export const generateUid = (limit = 11, fn = Math.random) => {
  const allowedLetters = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ].join("");
  const allowedChars = ["0123456789", allowedLetters].join("");
  const arr = [sample(allowedLetters, fn)];
  for (let i = 0; i < limit - 1; i++) {
    arr.push(sample(allowedChars, fn));
  }

  return arr.join("");
};

export const convertValue = (valueType, value) => {
  switch (valueType) {
    case "TEXT":
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
    case "EMAIL":
    case "LONG_TEXT":
      return value;
    case "DATE":
      return moment(value).format("YYYY-MM-DD");
    case "DATETIME":
      return moment(value);
    case "TIME":
      return moment(value);
    case "BOOLEAN":
      return value;
    case "TRUE_ONLY":
      return value;
    case "AGE":
      return moment(value);
    default:
      return <span>UNSUPPORTED VALUE TYPE</span>;
  }
};

export const convertValueBack = (valueType, value) => {
  switch (valueType) {
    case "TEXT":
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
    case "EMAIL":
    case "LONG_TEXT":
      return value;
    case "DATE":
      return moment(value).format("YYYY-MM-DD");
    case "DATETIME":
      return moment(value);
    case "TIME":
      return moment(value);
    case "BOOLEAN":
      return value + "";
    case "TRUE_ONLY":
      return value ? value + "" : "";
    case "AGE":
      return moment(value).format("YYYY-MM-DD");
    default:
      return <span>UNSUPPORTED VALUE TYPE</span>;
  }
};

export const generateDhis2Payload = (data, programMetadata) => {
  const newData = JSON.parse(JSON.stringify(data));
  let { currentTei, currentEnrollment, currentEvents } = newData;
  currentTei.attributes = Object.keys(currentTei.attributes).map(
    (attribute) => {
      const attributeMetadata = programMetadata.trackedEntityAttributes.find(
        (attr) => attr.id === attribute
      );
      return {
        attribute,
        value: convertValueBack(
          attributeMetadata.valueType,
          currentTei.attributes[attribute]
        ),
        valueType: attributeMetadata.valueType,
        displayName: attributeMetadata.displayName,
        lastUpdated: currentTei.lastUpdated,
      };
    }
  );
  currentEnrollment.enrolledAt = moment(currentEnrollment.enrolledAt).format(
    "YYYY-MM-DD"
  );
  currentEnrollment.incidentDate = moment(
    currentEnrollment.incidentDate
  ).format("YYYY-MM-DD");

  currentEvents = currentEvents.map((event) => {
    const programStage = programMetadata.programStages.find(
      (ps) => ps.id === event.programStage
    );

    event.dataValues = Object.keys(event.dataValues).map((dataElement) => {
      const dataElementMetadata = programStage.dataElements.find(
        (de) => de.id === dataElement
      );
      return {
        dataElement,
        value: convertValueBack(
          dataElementMetadata.valueType,
          event.dataValues[dataElement]
        ),
      };
    });
    event.occurredAt = moment(event.occurredAt).format("YYYY-MM-DD");
    event.dueDate = moment(event.dueDate).format("YYYY-MM-DD");
    return event;
  });

  return { currentTei, currentEnrollment, currentEvents };
};

export const TableColumn = ({ metadata, external, value }) => {
  const { t } = useTranslation();
  if (external) {
    switch (external.type) {
      case "DATE":
        return value ? moment(value).format("DD/MM/YYYY") : "";
      default:
        return value ? value : "";
    }
  } else {
    if (metadata.valueSet) {
      let find = metadata.valueSet.find((e) => {
        return e.value === value;
      });
      if (find) {
        value = find.label;
      }
      return value;
    } else {
      switch (metadata.valueType) {
        case "TRUE_ONLY":
        case "BOOLEAN":
          if (value === true || value === "true") {
            value = t("yes");
          }
          if (value === false || value === "false") {
            value = t("no");
          }
          return value ? value : "";
        case "DATE":
          return value ? moment(value).format("YYYY-MM-DD") : "";
        default:
          return value ? value : "";
      }
    }
  }
};

export const TableFilter = ({ metadata, onFilter, external, placeholder }) => {
  const { t } = useTranslation();
  if (external) {
    switch (external.type) {
      case "DATE":
        return (
          <div style={{ padding: "20px" }}>
            <DatePicker
              id={external.name}
              style={{ width: 250 }}
              onChange={(value) => {
                onFilter(
                  value ? moment(value).format("YYYY-MM-DD") : value,
                  external.name
                );
              }}
            />
          </div>
        );
      default:
        return null;
    }
  } else {
    if (metadata.valueSet) {
      return (
        <div style={{ padding: "20px" }}>
          <Select
            style={{ width: 250 }}
            allowClear
            showSearch
            placeholder={placeholder}
            onChange={(value) => {
              onFilter(value, metadata.id);
            }}
          >
            {metadata.valueSet.map((option) => {
              return <Option value={option.value}>{option.label}</Option>;
            })}
          </Select>
        </div>
      );
    } else {
      switch (metadata.valueType) {
        case "TRUE_ONLY":
        case "BOOLEAN":
          return (
            <div style={{ padding: "20px" }}>
              <Select
                style={{ width: 250 }}
                allowClear
                placeholder={placeholder}
                onChange={(value) => {
                  onFilter(value, metadata.id);
                }}
              >
                <Option value="true">{t("yes")}</Option>
                <Option value="false">{t("no")}</Option>
              </Select>
            </div>
          );
        case "DATE":
          return (
            <div style={{ padding: "20px" }}>
              <DatePicker
                id={metadata.id}
                style={{ width: 250 }}
                onChange={(value) => {
                  onFilter(
                    value ? moment(value).format("YYYY-MM-DD") : value,
                    metadata.id
                  );
                }}
              />
            </div>
          );
        default:
          // render = (<Input style={{ width: 200 }} placeholder="Text Here..." allowClear onChange={onFilter}/>)
          return (
            <div style={{ padding: "20px" }}>
              <Search
                id={metadata.id}
                placeholder={placeholder}
                allowClear
                onSearch={(value) => {
                  onFilter(value, metadata.id);
                }}
                style={{ width: 250 }}
              />
            </div>
          );
      }
    }
  }
};

export const generateEditableDataValueCells = (metadata, mutateDataValue) => {
  let render = (value, record) => {
    return (
      <InputField
        value={value}
        valueSet={metadata.valueSet ? metadata.valueSet : null}
        // label={metadata.displayFormName}
        valueType={metadata.valueType}
        onChange={(value) => {
          mutateDataValue(record.eventId, metadata.id, value);
        }}
      />
    );
  };
  return render;
};

export const returnFilterString = (arr) => {
  let filterString = "";
  arr.forEach((e) => {
    filterString += `&attribute=${e.teiId}:LIKE:${e.value}`;
  });
  return filterString;
};

export const onKeyDown = (event, pattern) => {
  const alwaysAllowed = [
    "Backspace",
    "Tab",
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Delete",
    "Meta",
  ];

  if (!alwaysAllowed.includes(event.key) && !pattern.test(event.key)) {
    event.preventDefault();
  }
};
