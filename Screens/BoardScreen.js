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

  onFinish = () => {
    this.state.user.reset().then(() => {
      const { navigate } = this.props.navigation;
      navigate('Home')
    })
  }

  render () {
    return (
      <Game
        height={5}
        width={11}
        user={this.state.user}
        room={this.state.room}
        onFinish={this.onFinish}
      ></Game>
    );
  }

  componentDidMount () {
    Orientation.lockToLandscape();
  }
}

const styles = StyleSheet.create({});
