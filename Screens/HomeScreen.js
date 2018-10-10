import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content } from 'native-base'

import Rooms from 'strategyMobile/components/Rooms';

export default class HomeScreen extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Content>
          <Rooms></Rooms>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});
