import React from 'react';
import { StyleSheet, AsyncStorage, View } from 'react-native';
import { Container, Content } from 'native-base'
import Logout from 'strategyMobile/components/Logout';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Text, Item, Input, Label, Button, Icon } from 'native-base'
import Rooms from 'strategyMobile/components/Rooms';
import Room from 'strategyMobile/api/Models/Room'
import { db } from 'strategyMobile/firebase/index.js';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    const { navigation } = props;
    const user = navigation.getParam('user', null);

    this.state = {
      user,
      form: {
        name: ''
      }
    }
  }
  createRoom = () => {
    let { name } = this.state.form
    Room.create({ name, icon: 'grid' }).then(room => {
    })
  }
  render () {
    let currentUser = <View>
      <Text>
        <Icon name={this.state.user.icon}></Icon>
        {this.state.user.name}
      </Text>
    </View>

    return (
      <Grid>
        <Row size={70}>
          <Col>
            {currentUser}
            <Rooms></Rooms>
          </Col>
        </Row>

        <Row size={30} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
          <Row>
            <Col size={4}>
              <Item fixedLabel regular>
                <Label>Nombre</Label>
                <Input onChangeText={(name) => this.setState({ form: { name } })} />
              </Item>
            </Col>
            <Col size={1}>
              <Button onPress={this.createRoom} success block>
                <Text>Crear</Text>
              </Button>
            </Col>
          </Row>
          <Row>
            <Logout />
          </Row>
        </Row>
      </Grid>
    )
  }
  async componentDidMount () {
    const config = await AsyncStorage.getItem('config')
    if (config === null) {
      db
        .collection('config')
        .doc('default')
        .get()
        .then(doc => {
          AsyncStorage.setItem('config', JSON.stringify(doc.data()));
        })
    }
  }
}

const styles = StyleSheet.create({});
