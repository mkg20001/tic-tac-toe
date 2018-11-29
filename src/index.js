'use strict'

const Field = require('./field')
const $ = require('jquery')

function startGame () {
  window.Field = new Field(html => $('.root').html(html))
}

startGame()

window.startGame = startGame
