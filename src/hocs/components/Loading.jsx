import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "./Container";

function Loading(props) {
    return (
        <Container>
            <CircularProgress {...props} />
        </Container>
    );
}

Loading.propTypes = {};
Loading.defaultProps = {};

export default Loading;
