import React from 'react';
import { StyleSheet, View, ActivityIndicator, ToastAndroid } from 'react-native';
import { Container, Card, CardItem, Icon, Text, Fab, List, ListItem, Body, Right } from 'native-base'
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
    this.cancel = this.cancel.bind(this);
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
    this.state.user.setReady().then((user) => {
      this.setState({ user })
      this.roomWatcher = this.state.room.watch(this.onUpdateRoom)
    }).catch(err => {
      ToastAndroid.show('Aun no esta listo', ToastAndroid.SHORT);
    })
  }
  cancel () {
    this.state.user.setReady(false).then((user) => {
      this.setState({ user })
      if (this.roomWatcher) this.roomWatcher()
    })
  }
  joinToTeam (team) {
    this.state.user.joinToTeam(team).then(user => {
      this.setState({ user })
    }).catch(err => {
      ToastAndroid.show('No se puede unir al equipo', ToastAndroid.SHORT);
    })
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
    if (this.state.user.ready) {
      let playersState = this.state.players.map((player, index) => {
        let icon
        if (player.ready) {
          icon = <Icon style={{ color: 'green' }} name="checkmark-circle" />
        } else {
          icon = <Icon style={{ color: 'red' }} name="close-circle" />
        }
        return (<CardItem key={`plaer_state_${index}`}>

            <Text style={{margin: 2}}>
              {icon}
              {player.name}
            </Text>

            <Text style={{margin: 2}}>
              <Icon name="people"></Icon>
              {player.team}
            </Text>
          </CardItem>)
      })
      return (
        <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />

          <Text>Listo, Esperando a Jugadores ...</Text>

          <Card>
            {playersState}
          </Card>

          <Fab
            direction="up"
            style={{ backgroundColor: 'red' }}
            position="bottomRight"
            onPress={this.cancel}>
            <Icon name="close-circle" />
          </Fab>
        </Container>
      )
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
          <Card>
            <CardItem>
              {this.getPlayerByTeam(-1)}
            </CardItem>
          </Card>

          <Fab
            direction="up"
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={this.init}>
            <Icon name="checkmark-circle" />
          </Fab>

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
