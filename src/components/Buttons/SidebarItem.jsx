import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import moment from "moment";
import EditYearButton from "./EditYearButton.jsx";
import DeleteButton from "./DeleteButton.jsx";

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { isImmutableYear } from "@/utils/event.js";

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
  const { immutableYear } = useSelector((state) => state.metadata);

  const itemsByYear = events.reduce((items, event) => {
    const year = moment(event.occurredAt).format("YYYY");

    if (!items.hasOwnProperty(year)) {
      items[year] = event;
    }

    return items;
  }, {});

  return (
    <List component="nav" aria-label="main mailbox folders">
      {events?.length > 0 ? (
        Object.keys(itemsByYear).map((year, idx) => {
          return (
            <ListItem
              key={year}
              button
              selected={selectedItem.year === year}
              onClick={() => onChangeFamily(idx, year, 0)}
            >
              <ListItemText primary={year} />
              {selectedItem.year === year &&
              !isImmutableYear(year, immutableYear) ? (
                <ListItemSecondaryAction>
                  <DeleteButton
                    event={itemsByYear[year]}
                    onHandleDelete={onDeleteEventFamily}
                  />
                </ListItemSecondaryAction>
              ) : null}
            </ListItem>
          );
        })
      ) : (
        <ListItemText
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          primary={"No data"}
        />
      )}
    </List>
  );
};

export default SidebarItem;

// {events?.length > 0 ? (
//     events.map((event, index) => {
//         const year = moment(event.occurredAt).format('YYYY');
//         return (
//             <ListItem
//                 button
//                 selected={selectedItem.index === index}
//                 onClick={() => onChangeFamily(index, year, 1)}
//             >
//                 <ListItemText primary={year} />
//                 {selectedItem.index === index && (
//                     <ListItemSecondaryAction>
//                         {/* <EditYearButton
//                             event={event}
//                             selectedYear={selectedItem.year}
//                             warningText={warningText}
//                             maxDate={maxDate}
//                             minDate={minDate}
//                             setWarningText={setWarningText}
//                             handleEditEventDate={
//                                 handleEditEventDate
//                             }
//                         /> */}
//                         <DeleteButton
//                             event={event}
//                             index={index}
//                             onHandleDelete={onDeleteEventFamily}
//                         />
//                     </ListItemSecondaryAction>
//                 )}
//             </ListItem>
//         );
//     })
// ) : (
//     <ListItemText primary={'No data'} />
// )}
