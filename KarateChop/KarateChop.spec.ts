import { iterativeBinarySearch, recursiveBinarySearch } from './KarateChop'

describe('KarateChop', () => {
  generateTestSuite('iterativeBinarySearch', iterativeBinarySearch)
  generateTestSuite('recursiveBinarySearch', recursiveBinarySearch)

  function generateTestSuite(suiteName: string, binarySearch: BinarySearchFn) {
    describe(suiteName, () => {
      it('should return -1 when the number is absent from the array', () => {
        expect(binarySearch(3, [])).toBe(-1)
        expect(binarySearch(3, [1])).toBe(-1)
        expect(binarySearch(0, [1, 3, 5])).toBe(-1)
        expect(binarySearch(2, [1, 3, 5])).toBe(-1)
        expect(binarySearch(4, [1, 3, 5])).toBe(-1)
        expect(binarySearch(6, [1, 3, 5])).toBe(-1)
        expect(binarySearch(0, [1, 3, 5, 7])).toBe(-1)
        expect(binarySearch(2, [1, 3, 5, 7])).toBe(-1)
        expect(binarySearch(4, [1, 3, 5, 7])).toBe(-1)
        expect(binarySearch(6, [1, 3, 5, 7])).toBe(-1)
        expect(binarySearch(8, [1, 3, 5, 7])).toBe(-1)
      })

      it('should return the index of the number when it is present is in the array', () => {
        expect(binarySearch(1, [1])).toBe(0)
        expect(binarySearch(1, [1, 3, 5])).toBe(0)
        expect(binarySearch(3, [1, 3, 5])).toBe(1)
        expect(binarySearch(5, [1, 3, 5])).toBe(2)
        expect(binarySearch(1, [1, 3, 5, 7])).toBe(0)
        expect(binarySearch(3, [1, 3, 5, 7])).toBe(1)
        expect(binarySearch(5, [1, 3, 5, 7])).toBe(2)
        expect(binarySearch(7, [1, 3, 5, 7])).toBe(3)
      })

      it.skip('should behave like a binary search', () => {
        const floorSpy = jest.spyOn(Math, 'floor')

        binarySearch(1, [1, 3, 5, 7])
        expect(floorSpy).toBeCalledTimes(2)
        floorSpy.mockClear()

        binarySearch(3, [1, 3, 5, 7])
        expect(floorSpy).toBeCalledTimes(1)
        floorSpy.mockClear()

        binarySearch(7, [1, 3, 5, 7])
        expect(floorSpy).toBeCalledTimes(3)
        floorSpy.mockClear()
      })
    })
  }
  interface BinarySearchFn {
    (num: number, arr: number[]): number
  }
})
