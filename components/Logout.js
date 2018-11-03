import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Button, Text, Container } from 'native-base'
import { withNavigation } from 'react-navigation';

class Logout extends React.Component {
  constructor(pros) {
    super(pros)

    this.logout = this.logout.bind(this)
  }
  async logout () {
    await AsyncStorage.removeItem('name')
    const { navigate } = this.props.navigation;
    navigate('Login')
  }
  render () {
    return (
      <Container>
        <Button block onPress={this.logout} primary><Text> Salir </Text></Button>
      </Container>
    );
  }
}

export default withNavigation(Logout);

const styles = StyleSheet.create({});
