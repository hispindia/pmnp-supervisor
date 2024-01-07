// node_modules
import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import Portal from "../Portal/Portal.jsx";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faTimes } from "@fortawesome/free-solid-svg-icons";

// Styles
import styles from "./FormContainer.module.css";
const { statisticBtn, closeBtn } = styles;

const Statistic = ({
  components,
  handleChangeStep,
  history,
  handleSaveButton,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button
        variant="info"
        className={statisticBtn}
        onClick={(e) => handleChangeStep(3)}
      >
        <FontAwesomeIcon icon={faChartBar} size="lg" />
      </Button>

      <Button
        variant="contained"
        color="default"
        className={closeBtn}
        disableElevation
        onClick={(e) => {
          // handleSaveButton(true);
          history.replace(`/list`);
        }}
      >
        {/* {t("close")} */}
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </Button>
      {/* <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Summary Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>{components.map((c) => c)}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

Statistic.propTypes = {};

export default Statistic;
