import { Button } from "antd";
import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";

// Icons
import { CloseOutlined } from "@ant-design/icons";

const DeleteConfirmationButton = withDeleteConfirmation(Button);

const DeleteButton = ({ event, onHandleDelete }) => {
  return (
    <DeleteConfirmationButton
      // className={`${yearDeleteItem}`}
      // disableFocusRipple={true}
      // disableRipple={true}
      // disabled={event.status != "ACTIVE"}
      danger
      messageText={"This process cannot be undone!"}
      cancelText={"Cancel"}
      deleteText={"Delete"}
      onClick={(e) => e.stopPropagation()}
      onDelete={(e) => {
        onHandleDelete(e, event.event);
      }}
      type="link"
      icon={<CloseOutlined style={{ fontSize: "16px", color: "" }} />}
    ></DeleteConfirmationButton>
  );
};

export default DeleteButton;
