import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import moment from 'moment';
import EditYearButton from './EditYearButton.jsx';
import DeleteButton from './DeleteButton.jsx';

import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';

const SidebarItem = ({
    events,
    selectedItem,
    onChangeFamily,
    onDeleteEventFamily,
    handleEditEventDate,
    setWarningText,
    warningText,
    maxDate,
    minDate,
}) => {
    return (
        <List component="nav" aria-label="main mailbox folders">
            {events && events.length > 0 ? (
                events.map((event, index) => {
                    const year = moment(event.eventDate).format('YYYY');
                    return (
                        <ListItem
                            button
                            selected={selectedItem.index === index}
                            onClick={() => onChangeFamily(index, year)}
                        >
                            <ListItemText primary={year} />
                            {selectedItem.index === index && (
                                <ListItemSecondaryAction>
                                    {/* <EditYearButton
                                        event={event}
                                        selectedYear={selectedItem.year}
                                        warningText={warningText}
                                        maxDate={maxDate}
                                        minDate={minDate}
                                        setWarningText={setWarningText}
                                        handleEditEventDate={
                                            handleEditEventDate
                                        }
                                    /> */}
                                    <DeleteButton
                                        event={event}
                                        index={index}
                                        onHandleDelete={onDeleteEventFamily}
                                    />
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    );
                })
            ) : (
                <ListItemText primary={'No data'} />
            )}
        </List>
    );

    // return events.map((event, index) => {
    //   return (
    //     <div>
    //       <div className="yearText">{year}</div>
    //       <ButtonGroup
    //         color="primary"
    //         size="small"
    //         variant="text"
    //         aria-label="outlined primary button group"
    //       >
    //         {/* {selectedYearRow == index && buttonEditYear(event.event)} */}(
    //         <EditYearButton event={event} />
    //         {/* {selectedYearRow == index && ( */}
    //         <IconButton
    //           className="yearDeleteItem"
    //           disableFocusRipple={true}
    //           disableRipple={true}
    //           // disabled={event.status != "ACTIVE"}
    //           color="secondary"
    //           // onClick={(e) => handleDeleteEvent(e, event.event)}
    //         >
    //           <ClearIcon fontSize="small" />
    //         </IconButton>
    //         {/* )} */}
    //       </ButtonGroup>
    //     </div>
    //   );
    // });
};

export default SidebarItem;
