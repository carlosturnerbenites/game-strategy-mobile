import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      box: props.box,
      player: props.player,
      traps: props.traps
    }
  }
  render () {
    let player = <Text></Text>
    if (this.state.player) {
      if (this.state.player.alive) {
        player = <Text style={{color: "green"}}>{this.state.player.name}</Text>
      } else {
        player = <Text style={{color: "red"}}>{this.state.player.name}</Text>
      }
    }
    let traps = this.state.traps.map(trap => {
      return <Text key={`key_${trap.id}`}>X</Text>
    })
    return (
      <View>
        {player}
        <View>{traps}</View>
        <Text>{this.state.box.x}, {this.state.box.y}</Text>
      </View>
    );
  }
  componentWillReceiveProps (nextProps) {
    // if (nextProps.palyer !== this.state.palyer) {
    this.setState({
      box: nextProps.box,
      player: nextProps.player,
      traps: nextProps.traps
    });
  }
  componentDidMount () {
  }
}

const styles = StyleSheet.create({});
