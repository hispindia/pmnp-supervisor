import React from 'react';
/* REDUX */
/*       */

/* Components */
import FamilyMemberFormLayout from '../../components/FamilyMemberLayout';

import withSkeletonLoading from '../../hocs/withSkeletonLoading';
import FIForm from '../../skeletons/TeiList';

const LoadingFamilyMemberFormLayout = withSkeletonLoading(FIForm)(
    FamilyMemberFormLayout
);

const FMLayout = ({}) => {
    return (
        <LoadingFamilyMemberFormLayout
            loading={false}
            loaded={true}
            mask={true}
        />
    );
};

export default FMLayout;
