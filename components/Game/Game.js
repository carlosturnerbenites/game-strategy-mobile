import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { db } from 'strategyMobile/firebase/index.js';
import Player from 'strategyMobile/api/Models/Player'
import Box from 'strategyMobile/components/Game/Box.js'
import Board from 'strategyMobile/api/Models/Board'

export default class Game extends React.Component {
  constructor(props) {
    super(props)

    const user = props.user
    const room = props.room

    this.state = {
      board: new Board({ height: props.height, width: props.width }),
      players: [],
      user,
      room
    }

    this.onClickBox = this.onClickBox.bind(this);
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
  onClickBox (box) {
    let data = this.state.user.getAttributes()
    data.x = box.x
    data.y = box.y
    db.collection('players').doc(this.state.user.id)
      .set(data)
      .then(() => {
        this.alert()
      })
  }
  render () {
    let user = <Text></Text>
    if (this.state.user) {
      user = <Text>{this.state.user.name}</Text>
    }
    return (
      <View style={styles.container}>
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
                    return <View><TouchableOpacity
                      onPress={() => this.onClickBox(box)}
                      style={styles.box}
                      key={`col_${iCol}`}
                    >
                      <Box
                        box={box}
                        player={this.state.players.find(player => player.x === box.x && player.y === box.y)}
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
  componentDidMount () {
    Player.watch(this.onUpdatePlayer)
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
