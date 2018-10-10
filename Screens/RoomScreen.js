import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base'

export default class RoomScreen extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Content>
          <Text>Room</Text>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});
