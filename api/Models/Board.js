import Model from 'strategyMobile/api/Models/Model'

import Box from 'strategyMobile/api/Models/Box'
import { db } from 'strategyMobile/firebase/index.js';

class Board extends Model {
  static ref = 'boards'
  ref = 'boards'

  constructor(attributes = {}) {
    super(attributes)

    this.matrix = []

    this.generateMatrix()
  }
  generateMatrix () {
    for (let h = 0; h < this.height; h++) {
      let row = []
      for (let w = 0; w < this.width; w++) {
        row.push(new Box({ x: h, y: w }))
      }
      this.matrix.push(row)
    }
  }
  watchTraps (onOk) {
    console.log(`${this.ref}/${this.id}/traps`)
    db
      .collection(this.ref)
      .doc(this.id)
      .collection('traps')
      .onSnapshot(querySnapshot => {
        console.warn('watch items')
        var items = []
        querySnapshot.forEach(doc => {
          let data = doc.data()
          data.id = doc.id
          items.push(data)
        })
        console.warn(items)
        return onOk(items)
      })
  }
}

export default Board
