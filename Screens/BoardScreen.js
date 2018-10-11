import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Text } from 'native-base'
import Game from 'strategyMobile/components/Game/Game';

export default class BoardScreen extends React.Component {
  constructor(props) {
    super(props)
    const { navigation } = props;

    const user = navigation.getParam('user', null);
    const room = navigation.getParam('room', null);

    this.state = {
      user,
      room
    }
  }

  render () {
    return (
      <Game
        height={5}
        width={5}
        user={this.state.user}
        room={this.state.room}
      ></Game>
    );
  }
}

const styles = StyleSheet.create({});
