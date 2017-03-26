import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Platform, Dimensions, NativeModules, NativeEventEmitter} from 'react-native';
import {KeyboardTrackingView} from 'react-native-keyboard-tracking-view';
import CustomKeyboardView from './CustomKeyboardView';

const IsIOS = Platform.OS === 'ios';
const ScreenSize = Dimensions.get('window');

export default class KeyboardAccessoryView extends Component {
  static propTypes = {
    renderContent: PropTypes.func,
    trackInteractive: PropTypes.bool,
    onHeightChanged: React.PropTypes.func,
    kbInputRef: React.PropTypes.object,
    kbComponent: React.PropTypes.string,
    kbInitialProps: React.PropTypes.object,
    onItemSelected: React.PropTypes.func,
    onIOSKeyboardResigned: React.PropTypes.func,
  };
  static defaultProps = {
    trackInteractive: false,
  }

  constructor(props) {
    super(props);

    if(IsIOS && NativeModules.CustomInputController) {
      const CustomInputControllerEvents = new NativeEventEmitter(NativeModules.CustomInputController);
      CustomInputControllerEvents.addListener('keyboardResigned', (params) => {
        if(this.props.onIOSKeyboardResigned) {
          this.props.onIOSKeyboardResigned();
        }
      });
    }
  }

  render() {
    const ContainerComponent = (IsIOS && KeyboardTrackingView) ? KeyboardTrackingView : View;
    return (
      <ContainerComponent
        style={styles.trackingToolbarContainer}
        onLayout={event => this.props.onHeightChanged && this.props.onHeightChanged(event.nativeEvent.layout.height)}
        trackInteractive={this.props.trackInteractive}
      >
        {this.props.renderContent && this.props.renderContent()}
        <CustomKeyboardView inputRef={this.props.kbInputRef} component={this.props.kbComponent} initialProps={this.props.kbInitialProps} onItemSelected={this.props.onItemSelected}/>
      </ContainerComponent>
    );
  }
}

const styles = StyleSheet.create({
  trackingToolbarContainer: {
    ...Platform.select({
      ios: {
        width: ScreenSize.width,
        position: 'absolute',
        bottom: 0,
        left: 0,
      }
    })
  },
});