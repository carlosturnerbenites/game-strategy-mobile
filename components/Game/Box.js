import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'native-base'

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      player: props.player,
      traps: props.traps,
      showTraps: props.showTraps
    }
  }
  render () {
    let player = <Text></Text>
    if (this.state.player) {
      if (this.state.player.alive) {
        player = <Icon style={{ fontSize: 27, color: 'green' }} name={this.state.player.icon}></Icon>
      } else {
        player = <Icon style={{ fontSize: 27, color: 'red' }} name={this.state.player.icon}></Icon>
      }
    }
    let traps
    if (this.state.showTraps) {
      traps = this.state.traps.map((trap, index) => {
        return <Icon key={index} style={{ fontSize: 14, color: 'red' }} name="flame"></Icon>
      })
    }
    return (
      <View style={{ flexDirection: "row", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {player}
        {traps}
      </View>
    );
  }
  componentWillReceiveProps (nextProps) {
    // if (nextProps.palyer !== this.state.palyer) {
    this.setState({
      box: nextProps.box,
      player: nextProps.player,
      traps: nextProps.traps,
      showTraps: nextProps.showTraps,
    });
  }
  componentDidMount () {
  }
}

const styles = StyleSheet.create({});
