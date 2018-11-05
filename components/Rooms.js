import React from 'react';
import { StyleSheet, View } from 'react-native';
import { db } from 'strategyMobile/firebase/index.js';
import Room from 'strategyMobile/api/Models/Room'
import { Text, CardItem, Icon, Right, Card, Item, Input, Label, Button } from 'native-base'
import { withNavigation } from 'react-navigation';

class Rooms extends React.Component {
  constructor(props) {
    super(props)
    const { navigation } = props;
    const user = navigation.getParam('user', null);
    // check user
    this.state = {
      user: user,
      rooms: [],
      form: {
        name: ''
      }
    }
  }
  onUpdateRooms = (rooms) => {
    this.setState(previousState => {
      previousState.rooms = rooms
      return previousState
    });
  }
  loadRooms () {
    Room.watch(this.onUpdateRooms)
  }
  joinToRoom (room) {
    const { user } = this.state
    user.reset().then(newUser => {
      user.joinToRoom(room.id)
        .then(newUser => {
          const { navigate } = this.props.navigation;
          navigate('Room', { room, user })
        })
    })
  }
  createRoom = () => {
    let { name } = this.state.form
    Room.create({name}).then(room => {
    })
  }
  render () {
    /*if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="#0000ff" />
      )
    }*/
    let rooms = <View>
      {
        this.state.rooms.map(room => {
          return <CardItem key={`room_${room.id}`} button onPress={(e) => this.joinToRoom(room)}>
            <Icon active name="logo-googleplus" />
            <Text>{room.name}</Text>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </CardItem>
        })
      }
      <View>
        <Text>{this.state.form.name}</Text>
        <Item fixedLabel>
          <Label>Username</Label>
          <Input onChangeText={(name) => this.setState({ form: { name } })} />
        </Item>
        <Button onPress={this.createRoom} rounded light>
          <Text>Crear</Text>
        </Button>
      </View>
    </View>

    return (
      <View>
        <Text>Welcome {this.state.user.name}</Text>
        <Card>
          {rooms}
        </Card>
      </View>
    );
  }
  componentDidMount () {
    this.loadRooms()
  }
}

export default withNavigation(Rooms);

const styles = StyleSheet.create({});
