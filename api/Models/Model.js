import Connection from 'strategyMobile/api/Models/Connection'
import { db } from 'strategyMobile/firebase/index.js';

class Model {
  connection = new Connection(this.ref)

  constructor(attributes = {}) {
    this.fill(attributes)
  }

  fill (attributes) {
    for (let key in attributes) {
      this.setAttribute(key, attributes[key])
    }

    return this
  }

  setAttribute (key, newValue) {
    this[key] = newValue
    return this
  }

  getAttributes () {
    let cloned = Object.assign({}, this)
    delete cloned.connection

    return cloned
  }

  static watch (onOk) {
    db.collection(this.ref)
      .onSnapshot(querySnapshot => {
        var items = []
        querySnapshot.forEach(doc => {
          let data = doc.data()
          data.id = doc.id
          items.push(data)
        })
        return onOk(items)
      })
  }

  static create (data) {
    // this.preCreate(data)
    // data.size = 3

    // this.validate(data)
    // if (!data.name) return

    return db.collection(this.ref).add(data)
      .then(ref => {
        console.log('Added document with ID: ', ref.id);
        return new this({
          id: ref.id,
          ...data
        })
      });

  }

  watch (onOk) {
    db
      .collection(this.ref)
      .doc(this.id)
      .onSnapshot(doc => {
        let data = doc.data()
        data.id = doc.id
        return onOk(data)
      })
  }
}

export default Model
