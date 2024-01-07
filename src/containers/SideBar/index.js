import React, { useEffect, useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EventIcon from '@material-ui/icons/Event';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import moment from 'moment';

/* Components */
import SideBar from '../../components/SideBar';
import withSkeletonLoading from '../../hocs/withSkeletonLoading';
import TeiListSkeleton from '../../skeletons/TeiList';

import './index.css';
import { useSelector } from 'react-redux';

const LoadingSideBar = withSkeletonLoading(TeiListSkeleton)(SideBar);

const SideBarContainer = ({ events }) => {
    const { currentEvents } = useSelector((state) => state.data.tei.data);
    return (
        <LoadingSideBar
            loading={false}
            loaded={true}
            mask={true}
            events={currentEvents}
        />
    );
};

LoadingSideBar.propTypes = {
    //   rtlActive: PropTypes.bool,
    //   handleDrawerToggle: PropTypes.func,
    //   bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
    //   logo: PropTypes.string,
    //   image: PropTypes.string,
    //   logoText: PropTypes.string,
    //   routes: PropTypes.arrayOf(PropTypes.object),
    //   open: PropTypes.bool,
};

export default SideBarContainer;
