import React from 'react';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';

const gridContainerStyle = makeStyles({
    root: {
        height: '100%',
    },
});

function Container(props) {
    const style = gridContainerStyle();
    return (
        <Grid
            classes={style}
            container
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {props.children}
        </Grid>
    );
}

Container.propTypes = {};
Container.defaultProps = {};

export default Container;
