import Model from 'strategyMobile/api/Models/Model'
import { db } from 'strategyMobile/firebase/index.js';

class Player extends Model {
  static ref = 'players'

  toInitialPosition () {
    let width = 11
    let height = 5

    let position
    if (this.team === 1) {
      position = {
        x: 0,
        y: 0
      }
    } else {
      position = {
        x: 0,
        y: width - 1
      }
    }
    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(position, {
        merge: true
      })
      .then(() => {
        return this.fill(position)
      })

  }
  setReady () {
    let data = { ready: true }
    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(data, {
        merge: true
      })
      .then(() => {
        return this.fill(data)
      })
  }
  moveToBox (box, traps) {
    let data = {
      x: box.x,
      y: box.y,
      lives: this.lives,
      alive: this.alive,
    }

    if (traps.length > 0) {
      if (traps.length > data.lives) {
        data.lives = 0
      } else {
        data.lives -= traps.length
      }
    }

    if (data.lives === 0) {
      data.alive = false
    }

    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(data, {
        merge: true
      })
      .then(() => {
        return this.fill(data)
      })

  }
  reset () {
    let defaults = {
      alive: true,
      ready: false,
      lives: 3,
      room: null,
      team: -1,
      x: -1,
      y: -1
    }
    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(defaults, {
        merge: true
      })
      .then(() => {
        return this.fill(defaults)
      })

  }
  joinToTeam (team) {
    let data = { team }
    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(data, {
        merge: true
      })
      .then(() => {
        return this.fill(data)
      })
  }
  joinToRoom (room) {
    let data = { room }
    return db
      .collection(Player.ref)
      .doc(this.id)
      .set(data, {
        merge: true
      })
      .then(() => {
        return this.fill(data)
      })
  }
  canMoveToBox (box) {
    if (this.x === box.x && this.y === box.y) {
      // Moverse al mismo lugar
      return false
    }
    if (
      (box.x > this.x + 1 || box.x < this.x - 1) ||
      (box.y > this.y + 1 || box.y < this.y - 1)
    ) {
      // Moverse a mas de una casilla de distancia
      return false
    }
    return true
  }
  static findByName (name) {
    if (!name) return Promise.reject(new Error('Invalid Param Name'))

    return db.collection(this.ref).where('name', '==', name)
      .limit(1)
      .get()
      .then(querySnapshot => {
        let doc = querySnapshot.docs[0]
        if (doc) {
          let data = doc.data()
          data.id = doc.id
          return new Player(data)
        } else {
          throw Error('Jugador No encontrado')
        }
      })
  }
}

export default Player
