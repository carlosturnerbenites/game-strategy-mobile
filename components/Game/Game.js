import React from 'react';
import { StyleSheet, AsyncStorage, Text, View, Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import { Container, Icon } from 'native-base';
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'
import Room from 'strategyMobile/api/Models/Room'
import Box from 'strategyMobile/components/Game/Box.js'
import Board from 'strategyMobile/api/Models/Board'

export default class Game extends React.Component {
  playersWatcher = null
  boardWatcher = null
  BoardTrapsWatcher = null
  BoardFallsWatcher = null

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
      this.BoardFallsWatcher = this.state.board.watchFalls(this.onUpdateFalls)
    })

    this.state = {
      loading,
      board,
      players: [],
      traps: [],
      newFalls: [],
      falls: [],
      user,
      room,
      configuring: false,
      moving: false,
      invalidMove: false,
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

    let players = this.state.players.filter(player => player.alive)

    let teamOne = players.filter(player => player.team === 1)
    let teamOneWins = teamOne.filter(player => player.y === (width - 1))

    let teamTwo = players.filter(player => player.team === 2)
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
    if (this.state.moving) return

    let user = this.state.user

    if (!user.alive) {
      return this.alert('You Dead')
    }

    /*
    if (!user.canMoveToBox(box)) {
      return this.alert('Movimiento invalido')
    }
    */

   this.setState({moving: true})
    user.canMoveToBox(box).then(can => {
      if (can) {
        let traps = this.state.traps.filter(trap => trap.x === box.x && trap.y === box.y)
        user.moveToBox(box, traps, this.state.room).then(newUser => {
          this.setState({moving: false})
        })
      } else {
        this.setState({moving: false})
        this.setState({invalidMove: true})
        setTimeout(() => {
          this.setState({invalidMove: false})
        }, 300);
      }
    })

  }
  setTrap (box) {
    const MAX_TRAPS_BY_PLAYER = 3

    return db
      .collection('boards')
      .doc(this.state.board.id)
      .collection('traps')
      .where('user', '==', this.state.user.id)
      .get()
      .then(query => {
        let count = query.docs.length
        console.log('count', count)
        if (count >= MAX_TRAPS_BY_PLAYER) {
          console.log('err')
          throw new Error('Max Traps')
        } else {
          return db
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
      })

  }
  onClickBox (box) {
    if (!this.state.play) return this.alert('Game End')

    if (this.state.configuring) {
      this.setTrap(box)
      .catch(err => {
        ToastAndroid.show(
          'No se puede poner la bomba',
          ToastAndroid.SHORT
        );
      })
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
      let invalidMove
      let moving
      if (this.state.moving) {
        moving = <Icon name="clock" style={{fontSize: 16}}></Icon>
      }
      if (this.state.invalidMove) {
        invalidMove = <Icon name="close-circle" style={{fontSize: 16, color: 'red'}}></Icon>
      }
      user = <Text style={{textAlign: 'center', flex: 1}}>
        <Icon name={this.state.user.icon} style={{ fontSize: 16 }}></Icon>
        {this.state.user.name}
        {moving}
        {invalidMove}
      </Text>
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
                        falls={this.state.newFalls.filter(fall => fall.x === box.x && fall.y === box.y)}
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
  onUpdateFalls = (falls) => {
    let ids = this.state.falls.map(fall => fall.id) // ids de los ya existentes
    // console.log('ids', ids)
    let newFalls = falls.filter(fall => ids.indexOf(fall.id) === -1)
    // console.log('newFalls', newFalls)
    this.setState({ falls, newFalls })
    setTimeout(() => {
      this.setState({ newFalls: [] })
    }, 500);
  }
  async componentDidMount () {
    const config = JSON.parse(await AsyncStorage.getItem('config'))
    this.setState({ config })

    this.playersWatcher = Player.watch(this.onUpdatePlayer)
    this.timeConfiguring()

  }
  unsub () {
    if (this.playersWatcher) { this.playersWatcher() }
    if (this.boardWatcher) { this.boardWatcher() }
    if (this.BoardTrapsWatcher) { this.BoardTrapsWatcher() }
    if (this.BoardFallsWatcher) { this.BoardFallsWatcher() }
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
    borderColor: '#d6d7da',
    backgroundColor: '#DDDDDD'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
