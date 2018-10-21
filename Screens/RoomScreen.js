import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Card, CardItem, Icon, Right, Text, Body, Button } from 'native-base'
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'

export default class RoomScreen extends React.Component {
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
  }
  init () {
    const { navigate } = this.props.navigation;

    const { user } = this.state
    const { room } = this.state

    navigate('Board', { user, room })
    this.joinToTeam = this.joinToTeam.bind(this);
  }
  joinToTeam (team) {
    let data = this.state.user.getAttributes()
    data.team = team
    db.collection('players').doc(this.state.user.id)
      .set(data)
      .then(() => {})
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
