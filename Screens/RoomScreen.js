import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Card, CardItem, Icon, Right, Text, Body, Button } from 'native-base'
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'

export default class RoomScreen extends React.Component {
  roomWatcher = null
  playersWatcher = null

  constructor(props) {
    super(props)

    const { navigation } = props;

    const user = navigation.getParam('user', null);
    const room = navigation.getParam('room', null);

    this.state = {
      user,
      room,
      players: []
    }
    this.init = this.init.bind(this);
    this.joinToTeam = this.joinToTeam.bind(this)
  }
  onRoomReady () {
    const { navigate } = this.props.navigation;

    const { user } = this.state
    const { room } = this.state

    this.unsub()

    user.toInitialPosition().then(() => {
      navigate('Board', { user, room })
    })
  }
  unsub () {
    if (this.roomWatcher) { this.roomWatcher() }
    if (this.playersWatcher) { this.playersWatcher() }
  }
  init () {
    this.state.user.setReady().then(() => {
      this.roomWatcher = this.state.room.watch(this.onUpdateRoom)
    })
  }
  joinToTeam (team) {
    this.state.user.joinToTeam(team).then(newUser => {})
  }
  getPlayerByTeam (team = null) {
    let players = this.state.players.filter(player => player.team === team)
    return <Card>{players.map(player => {
      return <CardItem key={`player_${player.id}`}>
        <Icon name={player.icon} />
        <Text>{player.name}</Text>
      </CardItem>
    })}
    </Card>
  }
  render () {

    let state = <Text></Text>
    if (this.state.room.ready) {
      state = <Text>Esperan ...</Text>
    }
    return (
      <Container style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'row'}}>
          <Card style={{ flex: 1}}>
            <CardItem onPress={() => this.joinToTeam(1)} button header >
              <Text>Equipo 1</Text>
            </CardItem>
            <CardItem >
              {this.getPlayerByTeam(1)}
            </CardItem>
          </Card>
          <Card style={{ flex: 1 }}>
            <CardItem onPress={() => this.joinToTeam(2)} button header >
              <Text>Equipo 2</Text>
            </CardItem>
            <CardItem >
              {this.getPlayerByTeam(2)}
            </CardItem>
          </Card>
        </View>
        <View>
          {state}
          {this.getPlayerByTeam(-1)}

          <Button
            onPress={this.init}
          >
          <Text>Iniciar</Text>
          </Button>

        </View>
      </Container>
    )
  }
  onUpdateRoom = (room) => {
    this.setState({ room })
    if (room.ready) {
      this.onRoomReady()
    }
  }
  onUpdatePlayer = (players) => {
    this.setState({ players });
  }
  componentDidMount () {
    this.state.room.reset()
    this.playersWatcher = Player.watchByRoom(this.state.room.id, this.onUpdatePlayer)
  }
  componentWillUnmount () {
    this.unsub()
  }
}

const styles = StyleSheet.create({});
