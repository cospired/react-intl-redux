import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { actions } from './actions';

class ConnectedIntlProvider extends React.Component {

  componentWillMount() {

    const { autodetect, detectBrowserLocale } = this.props;
    if (autodetect) {
      detectBrowserLocale();
    }
  }

  render() {

    const {
      // deconstructed to have a clean props object
      autodetect, // eslint-disable-line no-unused-vars
      detectBrowserLocale, // eslint-disable-line no-unused-vars
      ...elementProps
    } = this.props;

    return <IntlProvider { ...elementProps } />;
  }
}

ConnectedIntlProvider.propTypes = {
  autodetect: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.objectOf(PropTypes.string),
  detectBrowserLocale: PropTypes.func.isRequired
};

ConnectedIntlProvider.defaultProps = {
  autodetect: false,
  messages: {}
};

ConnectedIntlProvider.displayName = 'ConnectedIntlProvider';

function mapStateToProps(state, _ownProps) {

  const { locale } = state.intl;

  return {
    locale,
    messages: state.intl.messages[locale]
  };
}

function mapDispatchToProps(dispatch, _ownProps) {

  return {
    detectBrowserLocale: () => dispatch(actions.detectBrowserLocale())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedIntlProvider);
