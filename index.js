class Game {
    constructor(elem, width=4, height=4) {
        this.elem = elem
        this.width = parseInt(width)
        this.height = parseInt(height)
        this.state = []
        let stateSize = width*height
        for (let index = 0; index < stateSize;) {
            this.state[index] = ++index
        }
        this.state[stateSize-1] = ' '
        this.emptyPos = [width-1, height-1]
        this.moves = 0
        this.startTime = Date.now()
    }
    printBoard() {
        let str = ''
        this.state.forEach((num, index) => {
            if (this.indexToPos(index)[0] === 0) str += `\n\n`
            str += `${num}\t`
        })
        str = str.trim()
        console.log(str)
    }
    validPos(pos) {
        return  pos[0] >= 0 &&
                pos[0] < this.width &&
                pos[1] >= 0 &&
                pos[1] < this.height
    }
    posToIndex(pos) {
        return pos[0] + this.width*pos[1]
    }
    indexToPos(index) {
        let x = index%this.width
        let y = Math.floor(index/this.width)
        return [x, y]
    }
    posOffset(pos, offset) {
        return [pos[0]+offset[0], pos[1]+offset[1]]
    }
    swapPos(pos1, pos2) {
        let index1 = this.posToIndex(pos1)
        let index2 = this.posToIndex(pos2)
        let tmp = this.state[index1]
        this.state[index1] = this.state[index2]
        this.state[index2] = tmp
    }
    moveUp(num=1) {
        return this.moveDir([0,-1], num)
    }

    moveDown(num=1) {
        return this.moveDir([0,1], num)
    }

    moveLeft(num=1) {
        return this.moveDir([-1,0], num)
    }

    moveRight(num=1) {
        return this.moveDir([1,0], num)
    }

    moveDir(dir, num=1) {
        if (dir[0]*dir[1] !== 0) return false
        if (dir[0] === 0 && dir[1] === 0) return false
        if (Math.abs(dir[0] + dir[1]) !== 1) return false
        let finalEmptyPos = this.posOffset(this.emptyPos, [-1*dir[0]*num, -1*dir[1]*num])
        if (!this.validPos(finalEmptyPos)) return false
        while (num !== 0) {
            let newPos = this.posOffset(this.emptyPos, [-1*dir[0], -1*dir[1]])
            this.swapPos(this.emptyPos, newPos)
            this.emptyPos = newPos
            --num;
        }
        this.moves++
        return true
    }

    shuffle(repeat = this.width*this.height*20) {
        let possibleDirs = [[0,1], [0,-1], [1,0], [-1, 0]]
        for (let i = 0; i < repeat; i++) {
            let dir = possibleDirs[Math.floor(Math.random()*4)]
            let num = Math.floor(Math.random()*2) + 1
            if (!this.moveDir(dir, num)) --i;
        }
        this.moves = 0
    }

    checkSolved() {
        for (let i = 0; i < this.state.length-1; i++) {
            if (this.state[i] !== i+1) return false
        }
        return true
    }

    moveIndex(index) {
        let targetPos = this.indexToPos(index)
        let dirx = this.emptyPos[0] - targetPos[0]
        let diry = this.emptyPos[1] - targetPos[1]
        let num = Math.max(Math.abs(dirx), Math.abs(diry))
        let dir = [Math.sign(dirx), Math.sign(diry)]
        return this.moveDir(dir, num)
    }

    getRows() {
        let rows = []
        for (let col = 0; col < this.height; col++) {
            let startIndex = col * this.width
            let endIndex = startIndex + this.width
            rows.push(this.state.slice(startIndex, endIndex))
        }
        return rows
    }

    getBoard() {
        let rowStr = []
        let rows = this.getRows()
        rows.forEach(row => {
            rowStr.push(row.join('\t'))
        })
        return rowStr.join('\n\n')
    }
    
    reset() {
        this.shuffle()
        this.startTime = Date.now()
    }

    elapsedTime() {
        return (Date.now() - this.startTime)/1000
    }
}

// let g = new Game('yo', 4, 4)
// g.printBoard()
// g.moveDown()
// g.moveRight()
// g.printBoard()
// console.log('move valid', g.moveIndex(6))
// g.printBoard()
// console.log('solved', g.checkSolved())

module.exports = Game