import PropTypes from "prop-types";

export default {
  data: PropTypes.shape({
    applicationTitle: PropTypes.string.isRequired,
    me: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    modules: PropTypes.array.isRequired
  })
};
