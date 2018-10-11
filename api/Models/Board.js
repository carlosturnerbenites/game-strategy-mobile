import Model from 'strategyMobile/api/Models/Model'

import Box from 'strategyMobile/api/Models/Box'

class Board extends Model {
  static ref = 'rooms'

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
}

export default Board
