// node_modules
import { generateUid } from "@/utils";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Alert from "@material-ui/lab/Alert";
import i18n from "i18next";
import _ from "lodash";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";

// Import utils

// Dialog
import Dialog from "@material-ui/core/Dialog";

//Icon
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import EventIcon from "@material-ui/icons/Event";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

// Date Picker
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "moment/locale/lo";

// Local modules
import { AppContext } from "../App/App.context";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.jsx";
import FamilyMemberForm from "../FamilyMemberForm/FamilyMemberForm";
import CensusDetailForm from "../OldCensusDetailForm/CensusDetailForm";
import ProfileForm from "../OldProfileForm/ProfileForm";
import AgeGroupTable from "./AgeGroupTable.jsx";
import Ethnicity from "./Ethnicity.jsx";
import Insurance from "./Insurance.jsx";
import Statistic from "./Statistic.jsx";
import SummaryToolBar from "./SummaryToolBar.jsx";

// Portal
import Portal from "../Portal/Portal.jsx";

// Styles
import styles from "./FormContainer.module.css";

// notistack
import { useSnackbar } from "notistack";

const numOfStep = 2;

import { useApi, useEvent, useProfile } from "hooks";

const {
  formContainer,
  stepperContainer,
  entryFormContainer,
  yearSelectionContainer,
  yearSelectionItem,
  yearSelected,
  yearText,
  yearDeleteItem,
  yearAddButton,
  syncButton,
  incompleteButton,
  statisticBtn,
  closeBtn,
  summaryContainer,
  summaryTools,
} = styles;

const FormContainer = ({ programMetadata, data: json, setIsLoading }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedYearRow, setSelectedYearRow] = useState(null);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isYearEditPickerOpen, setIsYearEditPickerOpen] = useState(false);
  const [selectedEditRowYear, setSelectedEditRowYear] = useState(null);
  const { tei, orgUnit, program, minDate, maxDate } = useContext(AppContext);
  const [selectedYearPicker, setSelectedYearPicker] = useState(
    moment(`01/01/${maxDate}`, "DD/MM/YYYY").endOf("year").format("YYYY-MM-DD")
  );

  const [currentTei, setCurrentTei] = useState(null);
  const [disableCompleteBtn, setDisableCompleteBtn] = useState(false);
  //Delete Dialog
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [completeDialogIsOpen, setCompleteDialogIsOpen] = useState(false);
  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null);
  const [currentErn, setCurrentErn] = useState(null);
  const [warningText, setWarningText] = useState(null);
  const [editable, setEditable] = useState(false);
  const {
    profile,
    initProfile,
    changeProfile,
    changeProfileAttributeValue,
    setProfileDirty,
    transformProfile,
    changeEnrollment,
  } = useProfile(null);

  const {
    event,
    initEvent,
    getEvent,
    clearEvent,
    changeEvent,
    changeEventDataValue,
    setEventDirty,
    transformEvent,
  } = useEvent(null);

  const [events, setEvents] = useState([]);
  const { dataApi } = useApi();
  const history = useHistory();
  const { t } = useTranslation();
  const steps = [
    t("familyRegistration"),
    t("familyMembers"),
    t("censusDetails"),
    t("summary"),
  ];

  const saveProfileInfo = async (saveInBackground = false) => {
    if (!profile.isPass) {
      return (
        !saveInBackground &&
        enqueueSnackbar(t("Please fulfill registration form!"), {
          variant: "warning",
          autoHideDuration: 3000,
        })
      );
    }
    // new TEI && validation
    if (profile._isDirty && profile.isPass) {
      setEditable(false);
      if (profile.isNew) {
        changeEnrollment(
          "enrolledAt",
          `${moment(profile.enrollment.enrolledAt).year()}-12-31`
        );
        changeEnrollment(
          "incidentDate",
          `${moment(profile.enrollment.enrolledAt).year()}-12-31`
        );
        await dataApi.pushTrackedEntityInstance(
          transformProfile(),
          program.selectedProgram
        );
        // TODO
        //Auto generate occurredAt correspond to enrolledAt
        handleAddSelectedYear(moment(profile.enrollment.enrolledAt).year());

        changeProfile("isNew", false);
        !saveInBackground &&
          enqueueSnackbar(t("Family registered."), {
            variant: "success",
            autoHideDuration: 3000,
          });
      } else {
        await dataApi.putTrackedEntityInstance(
          transformProfile(),
          program.selectedProgram
        );
        // enqueueSnackbar(t("Family edited."), {
        //   variant: "success",
        //   autoHideDuration: 3000,
        // });
      }
      setProfileDirty(false);
    }
  };

  const handleChangeStep = async (stepIndex) => {
    // CHANGE step

    if (stepIndex == activeStep) return;

    if (activeStep == 0 && editable) {
      return enqueueSnackbar("Please save form first!", {
        variant: "warning",
        autoHideDuration: 3000,
      });
    }

    if (stepIndex > 3 /* max step*/) {
      handleSaveButton();
      return;
    }

    switch (activeStep) {
      case 0:
        if (profile.isPass) {
          setActiveStep(stepIndex);
        }
        await saveProfileInfo();
        break;
      case 1:
        setActiveStep(stepIndex);
        if (event._isDirty) {
          // PUSH event of TEI Family
          await dataApi.pushEvents(transformEvent());

          // // PUSH TEI of member
          // await dataApi.pushTrackedEntityInstance(
          //   transformProfile(),
          //   "xvzrp56zKvI"
          // );

          updateCurrentEventToEventList();

          setEventDirty(false);
          // enqueueSnackbar(t("Family member added."), {
          //   variant: "success",
          //   autoHideDuration: 3000,
          // });
        }
        break;
      case 2:
        setActiveStep(stepIndex);
        if (event._isDirty) {
          await dataApi.pushEvents(transformEvent());
          setEventDirty(false);
          // enqueueSnackbar(t("Family member added."), {
          //   variant: "success",
          //   autoHideDuration: 3000,
          // });
        }
        break;
      case 3:
        setActiveStep(stepIndex);
        break;
      default:
        break;
    }
  };

  const handleChangeYearRow = (index) => {
    if (index === selectedYearRow) return;

    updateCurrentEventToEventList();
    if (selectedYearRow != null && selectedYearRow >= 0) {
      handleSaveButton();
    }

    handleInitEvent({ ...events[index] });
    setSelectedYearRow(index);
  };

  const handleCompleteToggle = () => {
    setCompleteDialogIsOpen(true);
  };

  const updateCurrentEventToEventList = () => {
    if (selectedYearRow != null && selectedYearRow >= 0) {
      let indexOfObject = events.findIndex((x) => x.event == event.event);
      let updatedEvents = _.clone(events);
      updatedEvents[indexOfObject] = transformEvent();
      setEvents([...updatedEvents]);
      return updatedEvents;
    }
    return null;
  };

  const handleCompleteToggleConfirm = async (e) => {
    try {
      // PUSH event
      changeEvent("status", event.status == "ACTIVE" ? "COMPLETED" : "ACTIVE");
      await dataApi.pushEvents(transformEvent());

      updateCurrentEventToEventList();

      enqueueSnackbar(t("Changed to " + event.status), {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleInitProfile = (json, enrollmentId) => {
    if (json) {
      initProfile({ ...json, ...{ isPass: true } });
    } else {
      initProfile({
        isNew: true,
        trackedEntity: tei.selectedTei,
        orgUnit: orgUnit.selectedOrgUnit.id,
        trackedEntityType: programMetadata.trackedEntityType,
        enrollments: [
          {
            enrollment: enrollmentId,
            trackedEntity: tei.selectedTei,
            orgUnit: orgUnit.selectedOrgUnit.id,
            program: program.selectedProgram,
            enrolledAt: moment().subtract(2, "year").format("YYYY-MM-DD"),
            incidentDate: moment().subtract(2, "year").format("YYYY-MM-DD"),
          },
        ],
      });
    }
  };

  const handleInitEvent = (json, enrollmentId, year) => {
    console.log("handleInitEvent", json);
    if (json) {
      initEvent(json);
    } else {
      initEvent({
        event: generateUid(),
        trackedEntity: tei.selectedTei,
        orgUnit: orgUnit.selectedOrgUnit.id,
        program: program.selectedProgram,
        programStage: "vY4mlqYfJEH",
        enrollment: enrollmentId,
        occurredAt: moment().format("YYYY-MM-DD"),
        dueDate: moment().format("YYYY-MM-DD"),
        dataValues: [],
      });
    }
  };

  const handleDeleteEvent = (e, event) => {
    e.stopPropagation();
    setDialogIsOpen(true);
    setSelectedDeleteEvent(event);
  };

  const handleTransformEvent = (initEv) => {
    const temp = { ...initEv };
    temp.dataValues = temp.dataValues
      ? initEv.dataValues.reduce((accumulator, currentDataValue) => {
          accumulator[currentDataValue.dataElement] = currentDataValue.value;
          return accumulator;
        }, {})
      : {};
    return temp;
  };

  const transformedEvents = useMemo(() => {
    return events.map((e) => {
      return handleTransformEvent(e);
    });
  }, [JSON.stringify(events)]);

  const handleDeleteEventConfirm = async (event) => {
    try {
      let payload = { events: [{ event: event }] };
      let result = await dataApi.deleteEvent(payload);
      if (result) {
        setSelectedDeleteEvent(null);
        setSelectedYearRow(null);
        handleClearForm();
        setEvents([...events.filter((e) => e.event !== event)]);

        enqueueSnackbar(t("Deleted!"), {
          variant: "warning",
          autoHideDuration: 3000,
        });
      } else {
        //TODO - handle delete failed
        enqueueSnackbar(t("Delete failed!"), {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClearForm = () => {
    setSelectedYearRow(null);
    clearEvent();
  };

  const setDataToTEI = async (curEvents) => {
    let ids = ["oC9jreyd9SD"];
    let lastestEvent = getLastestEvent(curEvents);
    let dataValues = null;
    if (lastestEvent) {
      dataValues = lastestEvent.dataValues.filter((e) =>
        ids.includes(e.dataElement)
      );
      if (dataValues && dataValues.length > 0) {
        let cascadeData = JSON.parse(dataValues[0].value);
        cascadeData = cascadeData.dataVals.filter(
          (e) => e["Relation with head"] == "Head of family"
        );
        if (cascadeData && cascadeData.length > 0) {
          if (
            profile.attributes["IEE2BMhfoSc"] != cascadeData[0]["First name"]
          ) {
            changeProfileAttributeValue(
              "IEE2BMhfoSc",
              cascadeData[0]["First name"]
            ); // Firstname
          }
          if (
            profile.attributes["IBLkiaYRRL3"] != cascadeData[0]["Last name"]
          ) {
            changeProfileAttributeValue(
              "IBLkiaYRRL3",
              cascadeData[0]["Last name"]
            ); // Lastname
          }

          // PUSH to sever
          // await dataApi.putTrackedEntityInstance(
          //   transformProfile(),
          //   program.selectedProgram
          // );
          // setProfileDirty(false);
        }
      }
    }
  };

  const handleAddSelectedYear = (year) => {
    // SAVE current event before onChange to new added event
    handleSaveButton();

    //
    updateCurrentEventToEventList();
    let existedYear = events.map((e) => moment(e.occurredAt).year());

    if (!existedYear.includes(year)) {
      setSelectedYearPicker(`${year}-12-31`);
      setIsYearPickerOpen(false);
      setWarningText(null);

      let ids = ["oC9jreyd9SD"];
      let previousDataValues = getLastestEvent();

      // clone from previous event if it's exist - and clone active user only
      let isCloned = false;
      let dataValues = null;

      if (previousDataValues) {
        isCloned = true;
        dataValues = previousDataValues.dataValues.filter((e) =>
          ids.includes(e.dataElement)
        );
        if (dataValues && dataValues.length > 0) {
          let cascadeData = JSON.parse(dataValues[0].value);
          cascadeData = cascadeData.dataVals.filter(
            (e) => e["Status"] != "Dead" && e["Status"] != "Transferred"
          );

          // Add data of CascadeTable
          dataValues[0].value = JSON.stringify({
            dataVals: cascadeData,
          });
        }
      }

      // init new event
      let newEv = {
        _isDirty: true,
        event: generateUid(),
        trackedEntity: tei.selectedTei,
        orgUnit: orgUnit.selectedOrgUnit.id,
        program: program.selectedProgram,
        programStage: "vY4mlqYfJEH",
        enrollment: currentErn,
        occurredAt: `${year}-12-31`,
        dueDate: `${year}-12-31`,
        status: "ACTIVE",
        dataValues: dataValues && dataValues.length > 0 ? dataValues : [],
      };

      // push to event list
      handleClearForm();
      setEvents([...events, newEv]);
      handleInitEvent({ ...newEv });
    } else {
      setWarningText(`${year} ${t("already exists.")}`);
    }
  };

  const getLastestEvent = (paramEvents = null) => {
    let tempEvents = paramEvents ? paramEvents : events;
    let listEvents = _.clone(
      tempEvents.sort(function (a, b) {
        var keyA = new Date(a.occurredAt),
          keyB = new Date(b.occurredAt);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })
    );
    return listEvents.pop();
  };

  const handleEditEventDate = async (eventID, year) => {
    let existedYear = events.map((e) => moment(e.occurredAt).year());
    if (!existedYear.includes(year)) {
      changeEvent("occurredAt", `${year}-12-31`);

      let indexOfObject = events.findIndex((x) => x.event == eventID);
      let updatedEvents = _.clone(events);
      updatedEvents[indexOfObject] = transformEvent();
      setEvents([...updatedEvents]);

      setIsYearEditPickerOpen(false);
      setSelectedEditRowYear(null);
      setWarningText(null);

      // push to event list
      // PUSH event
      await dataApi.pushEvents(transformEvent());
      setEventDirty(false);
      // enqueueSnackbar(t("Family member added."), {
      //   variant: "success",
      //   autoHideDuration: 3000,
      // });
    } else {
      setWarningText(`${year} ${t("already exists.")}`);
    }
  };

  const handleSaveButton = async (saveInBackground = false) => {
    console.log("Saving...");
    // if (!profile.isPass) {
    //   !saveInBackground &&
    //     enqueueSnackbar(t("Please fulfill registration form!"), {
    //       variant: "warning",
    //       autoHideDuration: 3000,
    //     });
    // }

    // FIX - Multiple save

    // if (profile._isDirty && profile.isPass) {
    //   if (profile.isNew) {
    //     await dataApi.pushTrackedEntityInstance(
    //       transformProfile(),
    //       program.selectedProgram
    //     );
    //     changeProfile("isNew", false);
    //   } else {
    //     await dataApi.putTrackedEntityInstance(
    //       transformProfile(),
    //       program.selectedProgram
    //     );
    //   }
    //   setProfileDirty(false);
    //   !saveInBackground &&
    //     enqueueSnackbar(t("Family registered."), {
    //       variant: "success",
    //       autoHideDuration: 3000,
    //     });
    // }

    if (event._isDirty) {
      // PUSH event
      await dataApi.pushEvents(transformEvent());
      setEventDirty(false);
      // !saveInBackground &&
      //   enqueueSnackbar(t("Family member added."), {
      //     variant: "success",
      //     autoHideDuration: 3000,
      //   });
    }
  };

  const buttonNext = (newProps = {}) => {
    return (
      <Button
        size="small"
        variant="contained"
        color="primary"
        className={syncButton}
        disabled={
          (event.status != "ACTIVE" && activeStep != 0) ||
          (activeStep == 0 && editable)
        }
        endIcon={activeStep != numOfStep && <NavigateNextIcon />}
        onClick={(e) => handleChangeStep(activeStep + 1)}
        // disableElevation
        {...newProps}
      >
        {activeStep == numOfStep ? t("save") : t("next")}
      </Button>
    );
  };

  const buttonAddYear = () => {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          onClick={(e) => setIsYearPickerOpen(true)}
          // disableElevation
          disabled
        >
          {t("addYear")}
        </Button>

        <Dialog
          open={isYearPickerOpen}
          onClose={(e) => setIsYearPickerOpen(false)}
          aria-labelledby="Year Picker"
        >
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            locale={i18n.language || "en"}
          >
            <>
              <DatePicker
                id="addDatePicker"
                // autoOk
                variant="static"
                views={["year"]}
                label="Year only"
                value={moment(selectedYearPicker)}
                onChange={(date) => handleAddSelectedYear(moment(date).year())}
                // clearLabel={React.createElement("span", null, t("resetFilter"))}
                // cancelLabel={React.createElement("span", null, t("cancel"))}
                // clearLabel={React.createElement("span", null, "Limpar")}
                // cancelLabel={React.createElement("span", null, "Cancelar")}
                minDate={new Date(profile.enrollment.enrolledAt)}
                maxDate={new Date(`${maxDate}-12-31`)}
              />
              {warningText && <Alert severity="error">{warningText}</Alert>}
            </>
          </MuiPickersUtilsProvider>
        </Dialog>
      </>
    );
  };

  const buttonEditYearOnClick = (e, eventID) => {
    e.stopPropagation();
    setIsYearEditPickerOpen(true);
    setSelectedEditRowYear(eventID);
  };

  const buttonEditYear = (eventID) => {
    return (
      <>
        <IconButton
          className={`${yearDeleteItem}`}
          color="primary"
          disableFocusRipple={true}
          disableRipple={true}
          disabled={event.status != "ACTIVE"}
          onClick={(e) => buttonEditYearOnClick(e, eventID)}
        >
          <EventIcon fontSize="small" />
        </IconButton>
      </>
    );
  };

  useEffect(() => {
    // save new added event
    let index = events.length - 1;
    handleInitEvent({ ...events[index] });
    setSelectedYearRow(index);
    handleChangeYearRow(index);
    setEvents([...events]);
    handleSaveButton();
  }, [events.length]);

  useEffect(() => {
    updateCurrentEventToEventList();
    if (selectedYearRow != null && selectedYearRow >= 0) {
      handleSaveButton();
    }
  }, [event.event]);

  useEffect(() => {
    let updatedEvents = updateCurrentEventToEventList();
    if (updatedEvents) {
      setDataToTEI(updatedEvents);
      // Immediately save after add/edit/delete members
      handleSaveButton(true);
    }
  }, [event.dataValues && event.dataValues.oC9jreyd9SD]); //oC9jreyd9SD

  useEffect(() => {
    let updatedEvents = updateCurrentEventToEventList();
  }, [JSON.stringify(event)]);

  useEffect(() => {
    const saveTEIName = async () => {
      if (profile.attributes) {
        console.log("Save TEI");
        setIsLoading(true);
        await saveProfileInfo(true);
        setIsLoading(false);
      }
    };
    saveTEIName();
  }, [
    profile.attributes && profile.attributes.IBLkiaYRRL3,
    profile.attributes && profile.attributes.IEE2BMhfoSc,
  ]);

  useEffect(() => {
    const enrollmentId = generateUid();
    setCurrentErn(enrollmentId);
    if (json.httpStatusCode === 404) {
      handleInitProfile(null, enrollmentId); // create new TEI && ENR
    } else {
      // handle init exist TEI to form
      if (json.enrollments.length > 0 && json.enrollments[0].events[0]) {
        // exist at least an event
        handleInitProfile(json, json.enrollments[0].enrollment);
        setEvents([...json.enrollments[0].events]);
        const eventIndex = json.enrollments[0].events.length - 1;
        setSelectedYearRow(eventIndex);
        handleInitEvent({ ...json.enrollments[0].events[eventIndex] });
      } else {
        // there is no event
        handleInitProfile(json, enrollmentId);
      }
    }
  }, []);
  return (
    <div className={formContainer}>
      {activeStep !== 0 && event.status && (
        <Portal id="complete-button">
          <Button
            variant="contained"
            color="primary"
            className={event.status != "ACTIVE" && incompleteButton}
            disabled={disableCompleteBtn}
            // disableElevation
            onClick={handleCompleteToggle}
          >
            {event.status == "ACTIVE" ? t("complete") : t("inComplete")}
          </Button>
        </Portal>
      )}

      <ConfirmDialog
        title={event.status == "ACTIVE" ? t("complete") : t("inComplete")}
        open={completeDialogIsOpen}
        setOpen={setCompleteDialogIsOpen}
        onConfirm={(e) => handleCompleteToggleConfirm()}
      >
        {event.status == "ACTIVE" ? t("CompleteEvent") : t("IncompleteEvent")}
      </ConfirmDialog>

      {/* <Portal id="close-button"> */}
      {/* <Button
        variant="contained"
        color="default"
        className={closeBtn}
        disableElevation
        onClick={(e) => {
          handleSaveButton(true);
          history.replace(`/list`);
        }}
      >
        {t("close")}
      </Button> */}
      {/* </Portal> */}

      <div className={stepperContainer}>
        <Tabs
          value={activeStep}
          onChange={(event, step) => {
            handleChangeStep(step);
          }}
        >
          {steps.map((label, index) => (
            <Tab label={label} hidden={index == 3} />
          ))}
        </Tabs>
      </div>
      <div className={entryFormContainer}>
        {activeStep === 0 && (
          <>
            {/* <div className={yearSelectionContainer}></div> */}
            <ProfileForm
              programMetadata={programMetadata}
              profile={profile}
              changeProfile={changeProfile}
              changeProfileAttributeValue={changeProfileAttributeValue}
              changeEnrollment={changeEnrollment}
              externalComponents={{ nextButton: buttonNext() }}
              editable={editable}
              setEditable={setEditable}
              saveProfileInfo={saveProfileInfo}
            />
          </>
        )}
        {[1, 2].includes(activeStep) && (
          <div className={yearSelectionContainer}>
            {activeStep == numOfStep && (
              <div className={yearAddButton}>{buttonNext()}</div>
            )}
            <div className={yearAddButton}>{buttonAddYear()}</div>
            {/* Delete Event */}
            <ConfirmDialog
              title={t("deleteEvent")}
              open={dialogIsOpen}
              setOpen={setDialogIsOpen}
              onConfirm={(e) => handleDeleteEventConfirm(selectedDeleteEvent)}
            >
              {t("isDeleteEvent")}
            </ConfirmDialog>
            {/* Edit Event Date */}
            <Dialog
              open={isYearEditPickerOpen}
              onClose={(e) => setIsYearEditPickerOpen(false)}
              aria-labelledby="Year Picker"
            >
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                locale={i18n.language || "en"}
              >
                <>
                  <DatePicker
                    id="editDatePicker"
                    // autoOk
                    variant="static"
                    views={["year"]}
                    label="Year only"
                    value={moment(event.occurredAt)}
                    onChange={(date) =>
                      handleEditEventDate(
                        selectedEditRowYear,
                        moment(date).year()
                      )
                    }
                    // clearLabel={React.createElement(
                    //   "span",
                    //   null,
                    //   t("resetFilter")
                    // )}
                    // cancelLabel={React.createElement("span", null, t("cancel"))}
                    minDate={new Date(profile.enrollment.enrolledAt)}
                    maxDate={new Date(`${maxDate}-12-31`)}
                  />
                  {warningText && <Alert severity="error">{warningText}</Alert>}
                </>
              </MuiPickersUtilsProvider>
            </Dialog>
            {events.map((event, index) => {
              const year = moment(event.occurredAt).format("YYYY");

              return (
                <div
                  className={`${yearSelectionItem} ${
                    selectedYearRow === index && yearSelected
                  }`}
                  onClick={() => {
                    handleChangeYearRow(index);
                  }}
                >
                  <div className={`${yearText}`}>{year}</div>
                  <ButtonGroup
                    color="primary"
                    size="small"
                    variant="text"
                    aria-label="outlined primary button group"
                  >
                    {selectedYearRow == index && buttonEditYear(event.event)}
                    {selectedYearRow == index && (
                      <IconButton
                        className={`${yearDeleteItem}`}
                        disableFocusRipple={true}
                        disableRipple={true}
                        disabled={event.status != "ACTIVE"}
                        color="secondary"
                        onClick={(e) => handleDeleteEvent(e, event.event)}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ButtonGroup>
                </div>
              );
            })}
          </div>
        )}
        {activeStep === 1 && (
          <>
            <FamilyMemberForm
              currentEvent={event}
              blockEntry={event.status != "ACTIVE"}
              changeEvent={changeEvent}
              changeEventDataValue={changeEventDataValue}
              programMetadata={programMetadata}
              externalComponents={{ nextButton: buttonNext() }}
              events={events}
              setDisableCompleteBtn={setDisableCompleteBtn}
            />
          </>
        )}
        {activeStep === 2 && event.occurredAt && (
          <CensusDetailForm
            currentEvent={event}
            blockEntry={event.status != "ACTIVE"}
            changeEvent={changeEvent}
            changeEventDataValue={changeEventDataValue}
            programMetadata={programMetadata}
          />
        )}
        {activeStep === 3 && event.occurredAt && (
          <>
            <div className={summaryContainer}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container justify="center" spacing={2}>
                    <Grid item xs={4}>
                      <AgeGroupTable transformedEvents={transformedEvents} />
                    </Grid>
                    <Grid item xs={4}>
                      <Ethnicity transformedEvents={transformedEvents} />
                    </Grid>
                    <Grid item xs={4}>
                      <Insurance transformedEvents={transformedEvents} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div className={summaryTools}>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <SummaryToolBar />
              </Grid>
            </div>
          </>
        )}
      </div>

      {[0, 1, 2, 3].includes(activeStep) && (
        <Statistic
          // className={statisticBtn}
          handleSaveButton={handleSaveButton}
          history={history}
          components={[]}
          handleChangeStep={handleChangeStep}
        ></Statistic>
      )}
    </div>
  );
};

export default FormContainer;
