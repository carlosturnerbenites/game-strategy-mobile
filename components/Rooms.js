import React from 'react';
import { StyleSheet, View } from 'react-native';
import { db } from 'strategyMobile/firebase/index.js';
import Room from 'strategyMobile/api/Models/Room'
import { Text, CardItem, Icon, Right, Card } from 'native-base'
import { withNavigation } from 'react-navigation';

class Rooms extends React.Component {
  constructor(props) {
    super(props)
    const { navigation } = props;
    const user = navigation.getParam('user', null);
    // check user
    this.state = {
      user: user,
      rooms: []
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

    user.joinToRoom(room.id)
      .then(newUser => {
        const { navigate } = this.props.navigation;
        navigate('Room', { room, user })
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
