import { Popconfirm } from "antd";

const withDeleteConfirmation =
  (Component) =>
  ({
    onCancel,
    onDelete,
    onClick,
    cancelText,
    deleteText,
    messageText,
    ...props
  }) => {
    const handleClick = (event) => {
      onClick && onClick(event);
    };

    const handleClose = (e) => {};

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Popconfirm
          placement="bottomLeft"
          title={messageText}
          onConfirm={(e) => {
            onDelete && onDelete(e);
            handleClose(e);
          }}
          okText={deleteText}
          cancelText={cancelText}
        >
          <Component onClick={handleClick} {...props} />
        </Popconfirm>
      </div>
    );
  };

export default withDeleteConfirmation;
