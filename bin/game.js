#!/usr/bin/env node
const Game = require('../')
const { Command } = require('commander')
const terminal = require('terminal-kit').terminal

const program = new Command()
program.version('0.0.1')
program
  .option('-w, --width <int>', 'no. of columns')
  .option('-h, --height <int>', 'no. of rows')
program.parse()
const options = program.opts()

let g = new Game(null, options.width, options.height)
g.shuffle()

terminal.hideCursor()
terminal.bgColorGrayscale(0)

const terminate = () => {
    terminal.grabInput(false)
    terminal.hideCursor(false)
    console.clear()
    setTimeout(() => {process.exit()} ,100)
}

const redraw = () => {
    terminal.clear()
    terminal.white(g.getBoard())
    terminal.nextLine().red("%d Moves", g.moves)
    terminal.nextLine().yellow("%f", g.elapsedTime())
}

redraw()

terminal.grabInput()
terminal.on('key', (name, matches, data) => {
    console.log(name, matches, data)
    switch (name) {
        case "CTRL_C":
            terminate()
            break
        case "W":
        case "w":
        case "UP":
            g.moveUp()
            break
        case "A":
        case "a":
        case "LEFT":
            g.moveLeft()
            break
        case "S":
        case "s":
        case "DOWN":
            g.moveDown()
            break
        case "D":
        case "d":
        case "RIGHT":
            g.moveRight()
            break
        case "R":
        case "r":
            g.reset()
            break
        default:
            break
    }
    redraw()
    if (g.checkSolved()) {
        terminal.nextLine().brightGreen('Success!')
    }
})