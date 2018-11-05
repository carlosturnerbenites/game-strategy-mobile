import React from 'react';
import { StyleSheet } from 'react-native';
import { db } from 'strategyMobile/firebase/index.js';
import Room from 'strategyMobile/api/Models/Room'
import { Text, CardItem, Icon, Right, Card } from 'native-base'
import { withNavigation } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';

class Rooms extends React.Component {
  roomsWatcher = null

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
    this.roomsWatcher = Room.watch(this.onUpdateRooms)
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
  render () {
    /*if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="#0000ff" />
      )
    }*/
    let rooms = this.state.rooms.map(room => {
        return <CardItem key={`room_${room.id}`} button onPress={(e) => this.joinToRoom(room)}>
          <Icon active name="logo-googleplus" />
          <Text>{room.name}</Text>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      })

    return (
      <Card>
        {rooms}
      </Card>
    );
  }
  componentDidMount () {
    this.loadRooms()
  }
  unsub () {
    if (this.roomsWatcher) { this.roomsWatcher() }
  }
  componentWillUnmount () {
    this.unsub()
  }
}

export default withNavigation(Rooms);

const styles = StyleSheet.create({});
