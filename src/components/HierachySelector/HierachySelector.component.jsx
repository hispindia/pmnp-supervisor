import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./HierachySelector.styles.css";

const HierachySelector = ({ config }) => {
  const { labels, hierachy, initSelections, select, disabled } = config;
  const [selectorOptions, setSelectorOptions] = useState([[], [], []]);
  const [selections, setSelections] = useState([]);
  useEffect(() => {
    selectorOptions[0] = hierachy.filter((item) => {
      return item.path.split("/").length === 1;
    });
    setSelectorOptions([...selectorOptions]);
    init();
  }, [JSON.stringify(initSelections)]);

  const init = () => {
    if (initSelections.length !== 0) {
      let flag = 0;
      initSelections.forEach((selection, index) => {
        const s = hierachy.find((item) => item.value === selection);
        if (!s) return;
        flag++;
        handleSelect(s, index, true);
      });
      if (flag === 0) {
        setSelections([]);
      }
    }
  };

  const generateNextSelectorOptions = (selected, index) => {
    const options = hierachy.filter((item) => {
      return (
        item.path.includes(selected.path) &&
        item.path.split("/").length === index + 2
      );
    });
    selectorOptions[index + 1] = options;
    setSelectorOptions([...selectorOptions]);
    for (let i = index + 1; i < labels.length; i++) {
      selections[i] = null;
    }
    setSelections([...selections]);
  };

  const handleSelect = (selected, index, isInit) => {
    if (!selected) {
      for (let i = index; i < labels.length; i++) {
        selections[i] = null;
        if (i !== index) {
          selectorOptions[i] = [];
        }
      }
      setSelections([...selections]);
      if (isInit === undefined) {
        select(selections);
      }
      setSelectorOptions([...selectorOptions]);
      return;
    }
    if (selections[index] && selections[index].value === selected.value) return;
    selections[index] = selected;
    setSelections([...selections]);
    if (isInit === undefined) {
      select(selections);
    }
    generateNextSelectorOptions(selected, index);
  };

  return (
    <div className="hierachy-selector">
      {labels.map((label, index) => {
        return (
          <div key={label} className="hierachy-selector-item">
            <div className="hierachy-selector-label">{label}</div>
            <Select
              isDisabled={disabled}
              value={selections[index]}
              onChange={(selected) => {
                handleSelect(selected, index);
              }}
              placeholder={"-"}
              isClearable={true}
              options={selectorOptions[index]}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HierachySelector;
