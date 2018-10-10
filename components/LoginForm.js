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
      username: 'Player 1',
      password: null,
      loading: false
    }
    this.login = this.login.bind(this);
  }
  alertLoginError () {
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

    db.collection('players').where('name', '==', this.state.username)
      .limit(1)
      .get()
      .then(querySnapshot => {
        this.setState({ loading: false })
        let doc = querySnapshot.docs[0]
        if (doc) {
          let data = doc.data()
          data.id = doc.id
          try {
            // await
            AsyncStorage.setItem('user', JSON.stringify(data));
          } catch (error) {
            Toast.show({
              text: 'Error save user on storage',
              buttonText: 'Okay',
              type: "warning"
            })
          }

          Toast.show({
            text: 'Logged',
            buttonText: 'Okay',
            type: "success"
          })
          let user = new Player(data)
          navigate('Home', { user })
        } else {
          this.alertLoginError()
        }
      }).catch(error => {
        this.setState({ loading: false })
        this.alertLoginError()
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
      const result = await AsyncStorage.getItem('user')
      const { navigate } = this.props.navigation;

      let data = JSON.parse(result);
      if (data) {
        Toast.show({
          text: 'User in session',
          buttonText: 'Okay',
          type: "success"
        })
        let user = new Player(data)
        console.log('user', user)
        navigate('Home', { user })
      }
    } catch (error) {
      // Error saving data
      console.warn('error', error)
    }
  }
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({});
