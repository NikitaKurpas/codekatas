import { PrimeFactors } from './PrimeFactors'

describe('PrimeFactors', () => {
  test('test one', () => {
    expect(generate(1)).toEqual(list())
  })

  test('test two', () => {
    expect(generate(2)).toEqual(list(2))
  })

  test('test three', () => {
    expect(generate(3)).toEqual(list(3))
  })

  test('test four', () => {
    expect(generate(4)).toEqual(list(2, 2))
  })

  test('test five', () => {
    expect(generate(6)).toEqual(list(2, 3))
  })

  test('test six', () => {
    expect(generate(8)).toEqual(list(2, 2, 2))
  })

  test('test seven', () => {
    expect(generate(9)).toEqual(list(3, 3))
  })

  function generate(n: number) {
    return new PrimeFactors().generate(n)
  }

  function list(...ints: number[]) {
    return ints
  }
})
