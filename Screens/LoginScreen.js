import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content } from 'native-base'

import LoginForm from 'strategyMobile/components/LoginForm';

export default class LoginScreen extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Content>
          <LoginForm></LoginForm>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});
