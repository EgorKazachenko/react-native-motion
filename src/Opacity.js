import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  opacityMin: PropTypes.number,
  duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  animateOnDidMount: PropTypes.bool,
  delay: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  containerStyles: PropTypes.object,
};
const defaultProps = {
  opacityMin: 0,
  duration: 500,
  animateOnDidMount: false,
  delay: 0,
  useNativeDriver: false,
  containerStyles: {},
};

class Opcaity extends PureComponent {
  constructor(props) {
    super(props);

    const { opacityMin } = props;

    this.state = {
      opacityValue: new Animated.Value(opacityMin),
    };
  }
  componentDidMount() {
    const { animateOnDidMount } = this.props;

    if (animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.show(this.props);
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { isHidden } = this.props;

    if (!prevProps.isHidden && isHidden) {
      this.hide(this.props);
    }
    if (prevProps.isHidden && !isHidden) {
      this.show(this.props);
    }
  }
  show(props) {
    const { opacityValue } = this.state;
    const { onShowDidFinish, ...rest } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        ...rest,
      }),
    ]).start(() => {
      if (onShowDidFinish) {
        onShowDidFinish(props);
      }
    });
  }
  hide(props) {
    const { opacityValue } = this.state;
    const { opacityMin, onHideDidFinish, ...rest } = props;

    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: opacityMin,
        ...rest,
      }),
    ]).start(() => {
      if (onHideDidFinish) {
        onHideDidFinish(props);
      }
    });
  }
  render() {
    const { children, containerStyles } = this.props;
    const { opacityValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      ...containerStyles,
    };

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  }
}

Opcaity.propTypes = propTypes;
Opcaity.defaultProps = defaultProps;

export default Opcaity;
