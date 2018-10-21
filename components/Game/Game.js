import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'
import Room from 'strategyMobile/api/Models/Room'
import Box from 'strategyMobile/components/Game/Box.js'
import Board from 'strategyMobile/api/Models/Board'

export default class Game extends React.Component {
  getTestBoard (props) {
    return new Board({
      height: props.height,
      width: props.width,
      id: "aXrKA0GOaMWFmF0WgMPW",
      time: 10
    })
  }
  getTestUser () {
    return new Player({
      id: "AXtnNEfxqqKgHxA2H4Ey",
      alive: true,
      lives: 10,
      name: "P 1",
      room: "default",
      team: 1,
      x: 1,
      y: 2
    })
  }
  getTestRoom () {
    return new Room({
      board: "aXrKA0GOaMWFmF0WgMPW",
      name: "Default",
      size: 3
    })
  }
  constructor(props) {
    super(props)

    const user = this.getTestUser() // props.user
    const room = this.getTestRoom() // props.room
    const board = this.getTestBoard(props)

    this.state = {
      board,
      players: [],
      traps: [],
      user,
      room,
      configuring: false, // true,
      play: true, // true,
      counter: null,
      time: null
    }

    this.onClickBox = this.onClickBox.bind(this);
  }
  timeConfiguring = () => {
    this.setState({ configuring: true, play: true })

    var counter = 10;
    let interval = setInterval(() => {
      // console.log('counter', counter)
      this.setState({ counter })
      counter--
      if (counter <= 0) {
        this.setState({ configuring: false })
        clearInterval(interval)
        this.timerGame()
      }
    }, 1000);
  }
  evaluateGame = () => {
    this.alert('El juego termino')
  }
  timerGame = () => {
    this.setState({ play: true })
    let board = this.state.board;
    let intervalGame = setInterval(() => {
      board.time--
      console.log('board.time', board.time)
      if (board.time <= 0) {
        clearInterval(intervalGame)
        this.setState({ play: false })
        this.evaluateGame()
      }
      this.setState({ board })
    }, 1000);
  }
  loadBoard () {
    /*
    db.collection('boards').doc(this.room.board)
      .get()
      .then(doc => {
        let data = doc.data()

        this.initConfigBoard()

        db.collection('boards')
          .doc(this.room.board)
          .collection('traps')
          .onSnapshot(querySnapshot => {
            var traps = []
            querySnapshot.forEach(doc => {
              let data = doc.data()
              traps.push(data)
            })
            this.traps = traps
          })
      })
    */
  }
  alert (msg = 'Hola') {
    Alert.alert(
      'Title',
      msg,
      [{ text: 'OK', onPress: () => { } }],
      { cancelable: false }
    )
  }
  moveTo (box) {
    let user = this.state.user

    if (!user.alive) {
      return this.alert('You Dead')
    }
    if (user.x === box.x && user.y === box.y) {
      return this.alert('No mover en en mismo lugar')
    }
    if (
      (box.x > user.x + 1 || box.x < user.x - 1) ||
      (box.y > user.y + 1 || box.y < user.y - 1)
    ) {
      return this.alert('Mov fuera de rango')
    }

    let traps = this.state.traps.filter(trap => trap.x === box.x && trap.y === box.y)
    console.log('traps on box', traps)
    if (traps.length > 0) {
      if (traps.length > user.lives) {
        user.lives = 0
      } else {
        user.lives -= traps.length
      }
    }

    if (user.lives === 0) {
      user.alive = false
    }

    user.x = box.x
    user.y = box.y

    let data = this.state.user.getAttributes()

    db.collection('players').doc(this.state.user.id)
      .set(data)
      .then(() => {
        this.alert('Click de Juego')
      })
  }
  setTrap (box) {
    this.alert('Click de configuración')
    db
      .collection('boards')
      .doc(this.state.room.board)
      .collection('traps')
      .add({
        x: box.x,
        y: box.y
      })
  }
  onClickBox (box) {
    if (!this.state.play) return this.alert('Game End')

    if (this.state.configuring) {
      this.setTrap(box)
    } else {
      this.moveTo(box)
    }
  }
  render () {
    let user = <Text></Text>
    if (this.state.user) {
      user = <Text>{this.state.user.name}</Text>
    }
    let timer = <Text></Text>
    if (this.state.configuring) {
      timer = <Text>Tiempo: {this.state.counter}</Text>
    }
    let timerGame = <Text></Text>
    if (this.state.play) {
      timerGame = <Text>Tiempo Juego: {this.state.board.time}</Text>
    }
    return (
      <View style={styles.container}>
        <View>{timerGame}</View>
        <View>{timer}</View>
        <View>
          <Text>{user}</Text>
        </View>
        <View style={styles.container}>
          {
            this.state.board.matrix.map((row, iRow) => {
              return (<View
                style={styles.row}
                key={`row_${iRow}`}
              >
                {
                  row.map((box, iCol) => {
                    return <View key={`col_${iCol}`}><TouchableOpacity
                      onPress={() => this.onClickBox(box)}
                      style={styles.box}
                      key={`col_${iCol}`}
                    >
                      <Box
                        box={box}
                        player={this.state.players.find(player => player.x === box.x && player.y === box.y)}
                        traps={this.state.traps.filter(trap => trap.x === box.x && trap.y === box.y)}
                        showTraps={this.state.configuring && this.state.play}
                      ></Box>
                    </TouchableOpacity></View>
                  })
                }
              </View>)
            })
          }
        </View>
      </View>
    );
  }
  onUpdatePlayer = (players) => {
    this.setState(previousState => {
      previousState.players = players
      return previousState
    });
  }
  onUpdateBoard = (newBoard) => {
    // this.setState({ time: newBoard.time })
  }
  onUpdateTraps = (traps) => {
    console.log('onUpdateTraps', traps)
    this.setState({ traps })
    /*
    this.setState(previousState => {
      previousState.traps = traps
      return previousState
    });
    */
  }
  componentDidMount () {
    Player.watch(this.onUpdatePlayer)
    this.timeConfiguring()
    this.state.board.watch(this.onUpdateBoard)
    this.state.board.watchTraps(this.onUpdateTraps)
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  box: {
    flex: 1,
    // alignSelf: 'stretch',
    width: 50,
    height: 50,
    backgroundColor: 'powderblue',
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    // alignSelf: 'stretch'
  }
});
