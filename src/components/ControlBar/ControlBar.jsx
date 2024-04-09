import AddNewFamilyButtonContainer from '../../containers/ControlBar/AddNewFamilyButton';
import appStyles from '../App/App.module.css';
import styles from './ControlBar.module.css';

/* REDUX */
import { connect } from 'react-redux';
import OrgUnit from '../../containers/ControlBar/OrgUnit';
import ReportButtonContainer from '../../containers/ControlBar/ReportButton';
import RightSideButtonsContainer from '../../containers/ControlBar/RightSideButtons';
import { setSelectedOrgUnit } from '../../redux/actions/metadata';
/*       */

const { controlBarContainer } = styles;

const { appContentContainer } = appStyles;

const ControlBar = () => {
    return (
        <>
            <div className={controlBarContainer}>
                <div>
                    <OrgUnit />
                </div>
                <div>
                    <AddNewFamilyButtonContainer />
                </div>
                <div>
                    <ReportButtonContainer />
                </div>

                <RightSideButtonsContainer />
            </div>
            {/*<div className={appContentContainer} />*/}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        metadata: state.metadata,
    };
};

const mapDispatchToProps = { setSelectedOrgUnit };

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
