/* Components */
import SideBar from '../../components/SideBar';
import withSkeletonLoading from '../../hocs/withSkeletonLoading';
import TeiListSkeleton from '../../skeletons/TeiList';

import { useSelector } from 'react-redux';
import './index.css';

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
