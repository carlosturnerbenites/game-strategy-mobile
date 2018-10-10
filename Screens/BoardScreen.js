import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base'

export default class BoardScreen extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Content>
          <Text>Board</Text>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});
