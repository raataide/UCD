import React, { Component } from "react";
import { View, Animated, StyleSheet, TextInput } from "react-native";
import { string, func, object, number, bool } from "prop-types";

export class FloatingTitleTextInputField extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string.isRequired,
    updateMasterState: func.isRequired,
    keyboardType: string,
    secureTextEntry: bool,
    autoCompleteType: string,
    titleActiveSize: number, // to control size of title when field is active
    titleInActiveSize: number, // to control size of title when field is inactive
    titleActiveColor: string, // to control color of title when field is active
    titleInactiveColor: string, // to control color of title when field is active
    textInputStyles: object,
    otherTextInputProps: object,
    otherViewProps: object,
  };

  static defaultProps = {
    keyboardType: "default",
    secureTextEntry: false,
    autoCompleteType: "off",
    titleActiveSize: 14,
    titleInActiveSize: 15,
    titleActiveColor: "black",
    titleInactiveColor: "dimgrey",
    textInputStyles: {},
    otherViewProps: {},
  };

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
    };
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
      }).start();
    }
  };

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
      }).start();
    }
  };

  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props;
    updateMasterState(attrName, updatedValue);
  };

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    const {
      titleActiveColor,
      titleInactiveColor,
      titleActiveSize,
      titleInActiveSize,
    } = this.props;

    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
    };
  };

  render() {
    return (
      <View style={[Styles.container, this.props.otherViewProps]}>
        <Animated.Text
          style={[Styles.titleStyles, this._returnAnimatedTitleStyles()]}
          pointerEvents="none"
        >
          {this.props.title}
        </Animated.Text>
        <TextInput
          value={this.props.value}
          style={[Styles.textInput, this.props.textInputStyles]}
          underlineColorAndroid="transparent"
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onChangeText={this._onChangeText}
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.props.secureTextEntry}
          {...this.props.otherTextInputProps}
        />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    width: "100%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    height: 60,
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 10,
  },
  textInput: {
    fontSize: 20,
    color: "black",
    paddingLeft: 5,
  },
  titleStyles: {
    fontSize: 50,
    position: "absolute",
    left: 3,
  },
});
