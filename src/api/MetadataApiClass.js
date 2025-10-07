import {
  defaultProgramTrackedEntityAttributeDisable,
  REPORT_ID_CONSTANT,
  REPORT_ID_CONSTANT_ATTRIBUTE_ID,
} from "@/components/constants";
import { MULTIPLE_SELECTION_ATTRIBUTE_ID, SELECT_SEARCHABLE_ATTRIBUTE_ID } from "@/constants/app-config";
import BaseApiClass from "./BaseApiClass";
import { pull } from "./Fetch";
export default class MetadataApiClass extends BaseApiClass {
  getReportId = async () => {
    const res = await pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/constants/" + REPORT_ID_CONSTANT,
      { paging: false },
      ["fields=id,name,attributeValues"],
    );

    const found = res.attributeValues.find((attribute) => attribute.attribute.id === REPORT_ID_CONSTANT_ATTRIBUTE_ID);
    if (found) {
      return found.value;
    }
    return null;
  };
  getMe = () =>
    pull(this.baseUrl, this.username, this.password, "/api/me", { paging: false }, [
      "fields=:all,userRoles[code,name,id]",
    ]);
  getPrograms = () => pull(this.baseUrl, this.username, this.password, "/api/programs", { paging: false }, []);

  getHeaderBarData = async () => {
    let headerBarData = {};
    const results = await Promise.all([
      pull(this.baseUrl, this.username, this.password, "/api/me", { paging: false }, []),
      pull(this.baseUrl, this.username, this.password, "/api/me/dashboard", { paging: false }, []),
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/dhis-web-commons/menu/getModules.action",
        { paging: false },
        [],
      ),
    ]);
    headerBarData.me = results[0];
    headerBarData.applicationTitle = "";
    headerBarData.dashboard = results[1];
    headerBarData.modules = results[2].modules.map((module) => {
      if (!module.namespace.includes("/")) {
        module.icon = "../../" + module.icon;
        module.defaultAction = "../../" + module.defaultAction;
      }
      return module;
    });
    return headerBarData;
  };

  getOrgUnitSelectorData = async ({ orgUnits, filter }) => {
    const me = await pull(this.baseUrl, this.username, this.password, "/api/me", { paging: false }, []);

    let data = {};
    data.tree = orgUnits.reduce((accumulator, currentOu) => {
      if (filter) {
        if (!filter.includes(currentOu.path)) {
          currentOu.children = currentOu.children
            .filter((c) => {
              return !filter.includes(c.path);
            })
            .sort(function (a, b) {
              var nameA = a.displayName.toUpperCase();
              var nameB = b.displayName.toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
          accumulator[`organisationUnits/${currentOu.id}`] = currentOu;
        }
      } else {
        currentOu.children = currentOu.children.sort(function (a, b) {
          var nameA = a.displayName.toUpperCase();
          var nameB = b.displayName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        accumulator[`organisationUnits/${currentOu.id}`] = currentOu;
      }
      return accumulator;
    }, {});
    data.roots = me.organisationUnits.map((ou) => ou.id);
    return data;
  };

  getUserOrgUnits = async () => {
    return pull(this.baseUrl, this.username, this.password, "/api/organisationUnits", { paging: false }, [
      "withinUserHierarchy=true",
      "fields=id,code,path,children[id,code,displayName,path],displayName,level,parent,translations",
    ]);
  };

  getProgramMetadata = async (program) => {
    const p = await pull(this.baseUrl, this.username, this.password, `/api/programs/${program}`, { paging: false }, [
      "fields=programSections[id,name,trackedEntityAttributes,displayName,displayFormName,translations],id,displayName,trackedEntityType,organisationUnits[id,displayName,code,path],programRuleVariables[name,programRuleVariableSourceType,dataElement,trackedEntityAttribute],programTrackedEntityAttributes[mandatory,displayInList,trackedEntityAttribute[description,fieldMask,attributeValues,id,displayName,displayFormName,translations,displayShortName,valueType,optionSet[id]]],programStages[programStageSections[id,dataElements,displayName,displayFormName,translations,],id,displayName,programStageDataElements[compulsory,dataElement[url,translations,attributeValues,id,displayName,displayFormName,displayShortName,description,valueType,optionSet[code,name,translations,options[code,name,translations,id,displayName,attributeValues],valueType,version,displayName,id,attributeValues]]",
    ]);

    return p;
  };

  getProgramMetadataFromCacher = async (cacherType) => {
    const program = await pull(this.baseUrl, this.username, this.password, `/api/routes/cacher/run`, {}, [
      `type=${cacherType}`,
    ]);

    return await this.convertProgramMetadata(program);
  };

  getProgramsMetadata = async () => {
    const programs = await pull(this.baseUrl, this.username, this.password, `/api/programs`, { paging: false }, [
      "fields=id",
    ]);

    const convertedData = {
      programs: [],
    };

    if (programs.programs) {
      for (let i = 0; i < programs.programs.length; i++) {
        convertedData.programs[i] = await this.getProgramMetadataFromCacher(`program_${programs.programs[i].id}`);
      }
    }

    return convertedData;
  };

  getOptionSets = async () => {
    return await pull(this.baseUrl, this.username, this.password, `/api/optionSets`, { paging: false }, [
      "fields=id,displayName,options[id,displayName,displayFormName,translations,code,sortOrder,style]",
    ]);
  };

  convertProgramMetadata = async (p) => {
    let optionSets = await this.getOptionSets();

    const programMetadata = {};
    programMetadata.id = p.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.trackedEntityType = p.trackedEntityType.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.programSections = p.programSections;
    const metaAttr =
      programMetadata.attributeValues?.reduce((prev, curr) => {
        prev[curr.attribute.id] = curr.value;
        return prev;
      }, {}) || {};
    programMetadata.attributeValues = metaAttr;
    programMetadata.trackedEntityAttributes = p.programTrackedEntityAttributes.map((ptea) => {
      const tea = {
        compulsory: ptea.mandatory,
        id: ptea.trackedEntityAttribute.id,
        displayName: ptea.trackedEntityAttribute.displayName,
        displayFormName: ptea.trackedEntityAttribute.displayFormName
          ? ptea.trackedEntityAttribute.displayFormName
          : ptea.trackedEntityAttribute.displayShortName,
        valueType: ptea.trackedEntityAttribute.valueType,
        valueSet: null,
        displayInList: ptea.displayInList,
        disabled: defaultProgramTrackedEntityAttributeDisable.includes(ptea.trackedEntityAttribute.id),
        translations: ptea.trackedEntityAttribute.translations,
        fieldMask: ptea.trackedEntityAttribute.fieldMask,
        description: ptea.trackedEntityAttribute.description,
      };

      const foundAttr = ptea.trackedEntityAttribute.attributeValues.find(
        (attr) => attr.attribute.id === MULTIPLE_SELECTION_ATTRIBUTE_ID,
      );
      const foundSearchableAttr = ptea.trackedEntityAttribute.attributeValues.find(
        (attr) => attr.attribute.id === SELECT_SEARCHABLE_ATTRIBUTE_ID,
      );

      if (foundAttr && foundAttr.value === "true") {
        tea.isMultipleTrueOnlyDes = true;
      }

      if (foundSearchableAttr && foundSearchableAttr.value === "true") {
        tea.isSelectSearchable = true;
      }

      if (ptea.trackedEntityAttribute.optionSet) {
        tea.valueSet = optionSets.optionSets
          .find((os) => os.id === ptea.trackedEntityAttribute.optionSet.id)
          .options.map((o) => {
            return {
              value: o.code,
              label: o.displayFormName,
              color: o.style?.color || null,
              translations: o.translations,
            };
          });
      }
      return tea;
    });

    programMetadata.programStages = p.programStages.map((ps) => {
      const programStage = {
        id: ps.id,
        displayName: ps.displayName,
        dataElements: ps.programStageDataElements.map((psde) => {
          const dataElement = {
            compulsory: psde.compulsory,
            id: psde.dataElement.id,
            displayName: psde.dataElement.displayName,
            displayFormName: psde.dataElement.displayFormName
              ? psde.dataElement.displayFormName
              : psde.dataElement.displayShortName,
            description: psde.dataElement.description,
            valueSet: null,
            url: psde.dataElement.url,
            valueType: psde.dataElement.valueType,
            translations: psde.dataElement.translations,
            fieldMask: psde.dataElement.fieldMask,
          };

          const foundAttr = psde.dataElement.attributeValues.find(
            (attr) => attr.attribute.id === MULTIPLE_SELECTION_ATTRIBUTE_ID,
          );
          const foundSearchableAttr = psde.dataElement.attributeValues.find(
            (attr) => attr.attribute.id === SELECT_SEARCHABLE_ATTRIBUTE_ID,
          );

          if (foundAttr && foundAttr.value === "true") {
            dataElement.isMultipleTrueOnlyDes = true;
          }

          if (foundSearchableAttr && foundSearchableAttr.value === "true") {
            dataElement.isSelectSearchable = true;
          }

          if (psde.dataElement.optionSet) {
            dataElement.valueSet = optionSets.optionSets
              .find((os) => os.id === psde.dataElement.optionSet.id)
              .options.map((o) => {
                return {
                  value: o.code,
                  label: o.displayName,
                  color: o.style?.color || null,
                  translations: o.translations,
                };
              });
          }
          return dataElement;
        }),
        programStageSections: ps.programStageSections,
      };
      return programStage;
    });

    // programMetadata.programRules = programRules.programRules;
    programMetadata.programRuleVariables = p.programRuleVariables;

    return programMetadata;
  };

  getOrgUnitGroups = () =>
    pull(this.baseUrl, this.username, this.password, "/api/organisationUnitGroups", { paging: false }, [
      "fields=id,displayName,access,organisationUnits[id,displayName,path]",
      "filter=access.read:eq:true",
    ]);

  getOrgUnitLevels = () =>
    pull(this.baseUrl, this.username, this.password, "/api/organisationUnitLevels", { paging: false }, [
      "fields=id,displayName,level",
      "filter=access.read:eq:true",
    ]);

  getTrackedEntityAttributes = async () =>
    pull(this.baseUrl, this.username, this.password, "/api/trackedEntityAttributes", { paging: false });

  getTrackerDataElements = async () =>
    pull(this.baseUrl, this.username, this.password, "/api/dataElements", { paging: false }, [
      "filter=domainType:eq:TRACKER",
    ]);

  getUsers = async () =>
    pull(this.baseUrl, this.username, this.password, "/api/users", {
      paging: false,
    });
}
