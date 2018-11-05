import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Card, CardItem, Icon, Right, Text, Body, Button } from 'native-base'
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'

export default class RoomScreen extends React.Component {
  roomObserver = null

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

    if (this.roomObserver) {
      this.roomObserver()
    }

    user.toInitialPosition().then(() => {
      navigate('Board', { user, room })
    })
  }
  init () {
    this.state.user.setReady().then(() => {
      this.roomObserver = this.state.room.watch(this.onUpdateRoom)
    })
  }
  joinToTeam (team) {
    this.state.user.joinToTeam(team).then(newUser => {})
  }
  getPlayerByTeam (team = null) {
    let players = this.state.players.filter(player => player.team === team)
    return <Card>{players.map(player => {
      return <CardItem key={`player_${player.id}`}>
        <Icon active name="logo-googleplus" />
        <Text>{player.name}</Text>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
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
            <CardItem onPress={() => this.joinToTeam(1)} button header bordered>
              <Text>Equipo 1</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                {this.getPlayerByTeam(1)}
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>#</Text>
            </CardItem>
          </Card>
          <Card style={{ flex: 1 }}>
            <CardItem onPress={() => this.joinToTeam(2)} button header bordered>
              <Text>Equipo 2</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                {this.getPlayerByTeam(2)}
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>#</Text>
            </CardItem>
          </Card>
        </View>
        <View>
          <Text>Room: {this.state.room.name}</Text>
          {state}
          <Text>Players</Text>

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
  onUpdateRoom = (newRoom) => {
    if (newRoom.ready) {
      this.onRoomReady()
    }
  }
  componentDidMount () {
    db.collection('players')
      .where('room', '==', this.state.room.id)
      .onSnapshot(querySnapshot => {
        var players = []
        querySnapshot.forEach(doc => {
          let data = doc.data()
          data.id = doc.id
          players.push(new Player(data))
        })
        this.setState(previousState => {
          previousState.players = players
          return previousState
        });
      })
  }
}

const styles = StyleSheet.create({});
