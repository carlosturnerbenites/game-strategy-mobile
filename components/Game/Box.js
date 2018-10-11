import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      player: props.player
    }
  }
  render () {
    let player = <Text></Text>
    if (this.state.player) {
      player = <Text>{this.state.player.name}</Text>
    }
    return (
      <View>
        {player}
        <Text>{this.state.box.x}, {this.state.box.y}</Text>
      </View>
    );
  }
  componentWillReceiveProps (nextProps) {
    // if (nextProps.palyer !== this.state.palyer) {
    this.setState({
      box: nextProps.box,
      player: nextProps.player
    });
  }
  componentDidMount () {
  }
}

const styles = StyleSheet.create({});
