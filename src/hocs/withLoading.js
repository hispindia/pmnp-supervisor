import React from 'react';
import Container from './components/Container';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import Loading from './components/Loading';
import CircularProgress from '@material-ui/core/CircularProgress';

const withLoading = (Component) => {
    const EnhancedComponent = ({
        isLoading,
        errorMessage,
        percent,
        variant,
        mask,
        data,
        ...props
    }) => {
        if (errorMessage)
            return (
                <Container>
                    <Alert severity="error">{errorMessage}</Alert>
                </Container>
            );
        if ((isLoading && !mask) || (mask && !data)) {
            return <Loading size={60} variant={variant} value={percent} />;
        }
        return (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: isLoading ? 'hidden' : 'auto',
                }}
            >
                {isLoading && (
                    <Container
                        style={{
                            position: 'absolute',
                            zIndex: 110,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(255,255,255,0.8)',
                        }}
                    >
                        <CircularProgress
                            size={60}
                            variant={variant}
                            value={percent}
                        />
                    </Container>
                )}
                <Component data={data} {...props} />
            </div>
        );
    };
    EnhancedComponent.propTypes = {
        isLoading: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string,
        percent: PropTypes.number,
        variant: PropTypes.oneOf(['determinate', 'indeterminate', 'static']),
        mask: PropTypes.bool.isRequired,
        data: PropTypes.any,
    };
    EnhancedComponent.propTypes = {
        errorMessage: null,
        percent: 0,
        variant: 'indeterminate',
        mask: false,
        data: null,
    };
    return EnhancedComponent;
};

export default withLoading;
