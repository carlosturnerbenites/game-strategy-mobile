import React from 'react';
import { StyleSheet, AsyncStorage, Text, View, Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'
import Room from 'strategyMobile/api/Models/Room'
import Box from 'strategyMobile/components/Game/Box.js'
import Board from 'strategyMobile/api/Models/Board'

export default class Game extends React.Component {
  playersWatcher = null
  boardWatcher = null
  BoardTrapsWatcher = null

  constructor(props) {
    super(props)

    const user = props.user
    const room = props.room
    const loading = true

    const board = null
    Board.find(room.board, (board) => {
      this.setState({ board, loading: false })
      this.boardWatcher = this.state.board.watch(this.onUpdateBoard)
      this.BoardTrapsWatcher = this.state.board.watchTraps(this.onUpdateTraps)
    })

    this.state = {
      loading,
      board,
      players: [],
      traps: [],
      user,
      room,
      configuring: false,
      play: true,
      counter: null,
      time: null,
      config: null
    }

    this.onClickBox = this.onClickBox.bind(this);
  }
  timeConfiguring = () => {
    this.setState({ configuring: true, play: true })
    var counter = this.state.config.configTime;
    let interval = setInterval(() => {
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
    // verificar

    let width = this.state.config.widthBoard
    let middle = Math.round(width/2)
    let height = this.state.config.heightBoard

    let teamOne = this.state.players.filter(player => player.team === 1)
    let teamOneWins = teamOne.filter(player => player.y === (width - 1))
    let teamTwo = this.state.players.filter(player => player.team === 2)
    let teamTwoWins = teamTwo.filter(player => player.y === 0)

    let msg = ''

    if (teamOneWins.length === teamTwoWins.length) {
      msg = 'Empate'
    } else if (teamOneWins.length > teamTwoWins.length) {
      msg = 'Gana el equipo 1'
    } else {
      msg = 'Gana el equipo 2'
    }

    Alert.alert(
      'Termino',
      msg,
      [{ text: 'OK', onPress: () => {
        this.props.onFinish()
      } }],
      { cancelable: false }
    )
  }
  timerGame = () => {
    this.setState({ play: true })
    let board = this.state.board;
    let intervalGame = setInterval(() => {
      board.time--
      if (board.time <= 0) {
        clearInterval(intervalGame)
        this.setState({ play: false })
        this.evaluateGame()
      }
      this.setState({ board })
    }, 1000);
  }
  alert (msg = 'Hola') {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  }
  moveTo (box) {
    let user = this.state.user

    if (!user.alive) {
      return this.alert('You Dead')
    }

    /*
    if (!user.canMoveToBox(box)) {
      return this.alert('Movimiento invalido')
    }
    */

    user.canMoveToBox(box).then(can => {
      if (can) {
        let traps = this.state.traps.filter(trap => trap.x === box.x && trap.y === box.y)

        user.moveToBox(box, traps).then(newUser => {
          // do
        })
      }
    })

  }
  setTrap (box) {
    db
      .collection('boards')
      .doc(this.state.board.id)
      .collection('traps')
      .add({
        x: box.x,
        y: box.y,
        user: this.state.user.id,
        team: this.state.user.team,
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
    if (this.state.loading) {
      return <View>
        <Text>Cagando...</Text>
      </View>
    }
    let user
    if (this.state.user) {
      user = <Text style={{textAlign: 'center', flex: 1}}>{this.state.user.name}</Text>
    }
    let timer
    if (this.state.configuring) {
      timer = <Text style={{textAlign: 'center', flex: 1}}>Tiempo: {this.state.counter}</Text>
    }
    let timerGame
    if (this.state.play) {
      timerGame = <Text style={{textAlign: 'center', flex: 1}}>Tiempo Juego: {this.state.board.time}</Text>
    }
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          {timerGame}
          {timer}
          {user}
        </View>
        <View style={this.getStylesBoard()}>
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
                        traps={this.state.traps.filter(trap => trap.x === box.x && trap.y === box.y && trap.team === this.state.user.team)}
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
  getStylesBoard = () => {
    return {
      flex: 1,
      width: 50 * this.state.config.widthBoard,
    }
  }
  onUpdateBoard = (newBoard) => {
    // this.setState({ time: newBoard.time })
  }
  onUpdateTraps = (traps) => {
    this.setState({ traps })
  }
  async componentDidMount () {
    const config = JSON.parse(await AsyncStorage.getItem('config'))
    console.log('config Game componentDidMount', config)
    this.setState({ config })

    this.playersWatcher = Player.watch(this.onUpdatePlayer)
    this.timeConfiguring()

  }
  unsub () {
    if (this.playersWatcher) { this.playersWatcher() }
    if (this.boardWatcher) { this.boardWatcher() }
    if (this.BoardTrapsWatcher) { this.BoardTrapsWatcher() }
  }
  componentWillUnmount () {
    this.unsub()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  box: {
    flex: 1,
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
