import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content } from 'native-base'
import Logout from 'strategyMobile/components/Logout';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Text, Item, Input, Label, Button } from 'native-base'
import Rooms from 'strategyMobile/components/Rooms';
import Room from 'strategyMobile/api/Models/Room'

export default class HomeScreen extends React.Component {
  constructor(pros) {
    super(pros)
    this.state = {
      form: {
        name: ''
      }
    }
  }
  createRoom = () => {
    let { name } = this.state.form
    Room.create({ name }).then(room => {
    })
  }
  render () {
    return (
      <Grid>
        <Row size={70}>
          <Col>
            <Rooms></Rooms>
          </Col>
        </Row>

        <Row size={30} style={{ flexDirection: 'column'}} >
          <Row>
            <Col size={4}>
              <Item fixedLabel>
                <Label>Nombre</Label>
                <Input onChangeText={(name) => this.setState({ form: { name } })} />
              </Item>
            </Col>
            <Col size={1}>
              <Button onPress={this.createRoom} primary block>
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
}

const styles = StyleSheet.create({});
