import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Card, CardItem, Icon, Right, Text, Button } from 'native-base'
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
  }
  render () {
    let players = this.state.players.map(player => {
        return <CardItem key={`player_${player.id}`}>
          <Icon active name="logo-googleplus" />
          <Text>{player.name}</Text>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      })
    return (
      <Container>
        <Text>Room: {this.state.room.name}</Text>

        <Text>Players</Text>

        <Card>
          {players}
        </Card>

        <Button
          onPress={this.init}
        >
        <Text>Iniciar</Text>
        </Button>
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
