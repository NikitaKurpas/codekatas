import { BowlingGame } from './BowlingGame'

describe('BowlingGame', () => {
  let game: BowlingGame

  beforeEach(() => {
    game = new BowlingGame()
  })

  test('gutter game', () => {
    rollMany(20, 0)
    expect(game.score()).toBe(0)
  })

  test('all ones', () => {
    rollMany(20, 1)
    expect(game.score()).toBe(20)
  })

  test('one spare', () => {
    rollSpare()
    game.roll(3)
    rollMany(17, 0)
    expect(game.score()).toBe(16)
  })

  test('one strike', () => {
    rollStrike()
    game.roll(3)
    game.roll(4)
    rollMany(16, 0)
    expect(game.score()).toBe(24)
  })

  test('perfect game', () => {
    rollMany(12, 10)
    expect(game.score()).toBe(300)
  })

  function rollMany(n: number, pins: number) {
    for (let i = 0; i < n; i++) {
      game.roll(pins)
    }
  }

  function rollSpare() {
    game.roll(5)
    game.roll(5)
  }

  function rollStrike() {
    game.roll(10)
  }
})
