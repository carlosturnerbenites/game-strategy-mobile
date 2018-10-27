import React from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'
import { Button, Text, Form, Item, Label, Input, Toast, Root, Container } from 'native-base'
import { withNavigation } from 'react-navigation';

class LoginForm extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      username: 'P 1',
      password: null,
      loading: false
    }
    this.login = this.login.bind(this);
  }
  alertLoginError (err) {
    console.error(err)
    Alert.alert(
      'Error',
      'Cannot Login',
      [
        { text: 'OK', onPress: () => { } },
      ],
      { cancelable: false }
    )
  }
  login () {
    const { navigate } = this.props.navigation;

    this.setState({ loading: true })
    Player.findByName(this.state.username)
      .then(user => {
        this.setState({ loading: false })
        AsyncStorage.setItem('name', user.name);
        Toast.show({
          text: 'Logged',
          buttonText: 'Okay',
          type: "success"
        })
        user.reset().then(newUser => {
          navigate('Home', { user: newUser })
        })
      })
      .catch(err => {
        this.setState({ loading: false })
        this.alertLoginError(err)
      })
  }
  render () {
    if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="#0000ff" />
      )
    }
    return (
      <Root>
      <Container>
        <Form>
          <Item
            floatingLabel
          >
            <Label>Username</Label>
            <Input
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Password</Label>
            <Input
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              secureTextEntry
            />
          </Item>
          <View style={{ flexDirection: "row", flex: 1, justifyContent: 'center', marginTop: 10 }}>
            <Button block onPress={this.login} primary><Text> Ingresar </Text></Button>
          </View>
        </Form>
      </Container>
      </Root>
    );
  }
  async componentDidMount () {
    try {
      const name = await AsyncStorage.getItem('name')
      const { navigate } = this.props.navigation;

      if (name) {
        Player.findByName(name)
          .then(user => {
            user.reset().then(newUser => {
              navigate('Home', { user: newUser })
            })
          })
          .catch(err => {
              this.alertLoginError(err)
          })
      }
    } catch (error) {
      console.warn('error', error)
    }
  }
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({});
