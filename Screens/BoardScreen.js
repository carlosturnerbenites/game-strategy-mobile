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

  onFinish = () => {
    this.state.user.reset().then((user) => {
      const { navigate } = this.props.navigation;
      navigate('Home', { user })
    })
  }

  render () {
    return (
      <Game
        user={this.state.user}
        room={this.state.room}
        onFinish={this.onFinish}
      ></Game>
    );
  }
}

const styles = StyleSheet.create({});
