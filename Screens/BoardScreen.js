import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Text } from 'native-base'
import Game from 'strategyMobile/components/Game/Game';
import Orientation from 'react-native-orientation';

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

  componentDidMount () {
    Orientation.lockToLandscape();
  }
}

const styles = StyleSheet.create({});
