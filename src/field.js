'use strict'

const crypto = require('crypto')

const SWITCH = {X: 'O', O: 'X'}
const hstr = (v) => JSON.stringify(v).replace(/"/g, "'")
const get = require('dlv')
const set = require('dset').default

const compVals = (ar, gf) => {
  ar = ar.map(gf)
  return ar.reduce((state, next) => {
    if (!state) {
      return state
    }
    if (state !== next) {
      return false
    }
    return next
  })
}

class Field {
  constructor (draw) {
    this.idf = crypto.randomBytes(16).toString('hex').replace(/^[0-9]/, 'a')
    this.data = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
    window[this.idf] = this.handler.bind(this)
    this.draw = draw
    this.player = 'X'
    this.redraw()
  }
  place (what, where) {
    const val = get(this.data, where)
    if (val != null) {
      return val + ' has already placed their mark here'
    }
    set(this.data, where, what)
  }
  getWinner () {
    let w
    for (let i = 0; i < 3; i++) {
      let row = this.data[i]
      w = compVals(row, (v) => v) // sideways
      if (w) return w
      w = compVals(this.data, (v) => v[i]) // top-to-bottom
      if (w) return w
    }
    w = compVals(this.data, (v, i) => v[i]) // left to right top to bottom accross
    if (w) return w
    w = compVals(this.data, (v, i) => v[2 - i]) // right to left top to bottom accross
    if (w) return w
  }
  hasEmptyFields () {
    return Boolean(
      this.data.filter(row =>
        row.filter(col => !col).length).length
    )
  }
  msg () {
    if (this.le) return this.le
    if (this.getWinner()) {
      return this.getWinner() + ' has won'
    } else if (!this.hasEmptyFields()) {
      return 'It\'s a draw'
    } else {
      return 'It\'s ' + this.player + '\'s turn!'
    }
  }
  toHTML () {
    return `<div class="tic-tac-toe"><table>
      ${this.data.map((row, rowI) => `<tr>${row.map((col, colI) => `<td onclick="window[${hstr(this.idf)}](${rowI}, ${colI})">${col || ''}</td>`).join('')}</tr>`).join('')}
    </table><br><h2>${this.msg()}</h2><button onclick="window.startGame()">Reset</button></div>`
  }
  redraw () {
    this.draw(this.toHTML())
  }
  handler (row, col) {
    const where = `${row}.${col}`
    if (!this.getWinner() && this.hasEmptyFields()) {
      this.le = this.place(this.player, where)
      if (!this.le) {
        this.player = SWITCH[this.player]
      }
    }
    this.redraw()
  }
}

module.exports = Field
