import { pull } from "./Fetch";
import dev_data from "./dev_data";
import BaseApiClass from "./BaseApiClass";
import { defaultProgramTrackedEntityAttributeDisable, HAS_INITIAN_NOVALUE } from "@/components/constants";
export default class MetadataApiClass extends BaseApiClass {
  getMe = () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/me",
      { paging: false },
      []
    );
  getPrograms = () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/programs",
      { paging: false },
      []
    );

  getHeaderBarData = async () => {
    let headerBarData = {};
    const results = await Promise.all([
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/api/me",
        { paging: false },
        []
      ),
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/api/me/dashboard",
        { paging: false },
        []
      ),
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/dhis-web-commons/menu/getModules.action",
        { paging: false },
        []
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
    // const orgUnits = await pull(
    //   this.baseUrl,
    //   this.username,
    //   this.password,
    //   "/api/organisationUnits",
    //   { paging: false },
    //   [
    //     "withinUserHierarchy=true",
    //     "fields=id,code,displayName,path,children[id,code,displayName,path]",
    //   ]
    // );
    const me = await pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/me",
      { paging: false },
      []
    );

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
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnits",
      { paging: false },
      [
        "withinUserHierarchy=true",
        "fields=id,code,path,children[id,code,displayName,path],displayName,level,parent,translations",
      ]
    );
  };

  getProgramMetadata = async (program) => {
    const p = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/programs/${program}`,
      { paging: false },
      [
        "fields=programSections[id,name,trackedEntityAttributes,displayName],id,displayName,trackedEntityType,organisationUnits[id,displayName,code,path],programRuleVariables[name,programRuleVariableSourceType,dataElement,trackedEntityAttribute],programTrackedEntityAttributes[mandatory,displayInList,trackedEntityAttribute[id,displayName,displayFormName,displayShortName,valueType,optionSet[id]]],programStages[programStageSections[id,dataElements,displayName],id,displayName,programStageDataElements[compulsory,dataElement[translations,attributeValues,id,displayName,displayFormName,displayShortName,description,valueType,optionSet[code,name,translations,options[code,name,translations,id,displayName,attributeValues],valueType,version,displayName,id,attributeValues]]",
      ]
    );

    return await this.convertProgramMetadata(p);
  };

  getProgramsMetadata = async () => {
    const programs = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/programs`,
      { paging: false },
      [
        "fields=programSections[id,name,trackedEntityAttributes,displayName],id,displayName,trackedEntityType,organisationUnits[id,displayName,code,path],programRuleVariables[name,programRuleVariableSourceType,dataElement,trackedEntityAttribute],programTrackedEntityAttributes[*,mandatory,displayInList,trackedEntityAttribute[*,id,displayName,displayFormName,displayShortName,valueType,optionSet[id,code,name,translations,attributeValues,sortOrder,options[id,code,name,translations,attributeValues,sortOrder]]]],programStages[programStageSections[id,dataElements,displayName],id,displayName,programStageDataElements[compulsory,dataElement[translations,attributeValues,id,displayName,displayFormName,displayShortName,description,valueType,optionSet[code,name,translations,options[code,name,translations,id,displayName,attributeValues],valueType,version,displayName,id,attributeValues]]",
      ]
    );

    if (programs.programs) {
      for (let i = 0; i < programs.programs.length; i++) {
        programs.programs[i] = await this.convertProgramMetadata(
          programs.programs[i]
        );
      }
    }

    return programs;
  };

  getOptionSets = async () => {
    return await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/optionSets`,
      { paging: false },
      ["fields=id,displayName,options[id,displayName,code,sortOrder]"]
    );
  };

  convertProgramMetadata = async (p) => {
    const programRules = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/programRules`,
      { paging: false },
      [`filter=program.id:eq:${p.id}`, `fields=*,programRuleActions[*]`]
    );

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // Set the expiration time to 1 hour from now

    const cacheOptions = JSON.parse(localStorage.getItem("optionSets"));

    let optionSets = null;
    if (
      cacheOptions &&
      cacheOptions.expiration &&
      new Date().getTime() < cacheOptions.expiration
    ) {
      optionSets = cacheOptions.value;
    } else {
      optionSets = await pull(
        this.baseUrl,
        this.username,
        this.password,
        `/api/optionSets`,
        { paging: false },
        ["fields=id,displayName,options[id,displayName,code,sortOrder]"]
      );

      const newCacheOptions = {
        value: optionSets,
        expiration: expirationDate.getTime(),
      };

      localStorage.setItem("optionSets", JSON.stringify(newCacheOptions));
    }


    const programMetadata = {};
    programMetadata.id = p.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.trackedEntityType = p.trackedEntityType.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.programSections = p.programSections;
    programMetadata.trackedEntityAttributes =
      p.programTrackedEntityAttributes.map((ptea) => {
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
        };
        if (ptea.trackedEntityAttribute.optionSet) {
          tea.valueSet = optionSets.optionSets
            .find((os) => os.id === ptea.trackedEntityAttribute.optionSet.id)
            .options.map((o) => {
              return { value: o.code, label: o.displayName };
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
            valueType: psde.dataElement.valueType,
            valueSet: null,
          };
          if (psde.dataElement.optionSet) {
            dataElement.valueSet = optionSets.optionSets
              .find((os) => os.id === psde.dataElement.optionSet.id)
              .options.map((o) => {
                return { value: o.code, label: o.displayName };
              });
          }
          return dataElement;
        }),
        programStageSections: ps.programStageSections,
      };
      return programStage;
    });

    programMetadata.programRules = programRules.programRules;
    programMetadata.programRuleVariables = p.programRuleVariables;

    return programMetadata;
  };

  getOrgUnitGroups = () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnitGroups",
      { paging: false },
      [
        "fields=id,displayName,access,organisationUnits[id,displayName,path]",
        "filter=access.read:eq:true",
      ]
    );

  getOrgUnitLevels = () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnitLevels",
      { paging: false },
      ["fields=id,displayName,level", "filter=access.read:eq:true"]
    );

  getTrackedEntityAttributes = async () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/trackedEntityAttributes",
      { paging: false }
    );

  getTrackerDataElements = async () =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/dataElements",
      { paging: false },
      ["filter=domainType:eq:TRACKER"]
    );

  getUsers = async () =>
    pull(this.baseUrl, this.username, this.password, "/api/users", {
      paging: false,
    });
}
