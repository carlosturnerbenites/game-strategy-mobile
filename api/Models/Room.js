import Model from 'strategyMobile/api/Models/Model'
import { db } from 'strategyMobile/firebase/index.js';

class Room extends Model {
  static ref = 'rooms'
  ref = 'rooms'
  reset () {
    let defaults = {
      board: null,
      ready: false
    }
    return db
      .collection(this.ref)
      .doc(this.id)
      .set(defaults, {
        merge: true
      })
      .then(() => {
        return this.fill(defaults)
      })

  }
}

export default Room
