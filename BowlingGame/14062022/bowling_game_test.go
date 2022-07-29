package main

import "testing"

func TestBowlingGame(t *testing.T) {
  t.Run("Test all 0", func(t *testing.T) {
    want := 0
    got := BowlingGame({0, 0 })
    generateRolls()
  })
}

func generateRolls(count int) []int {
  return make([]int, count)
}
