/**
 * @privateRemarks
 * - Spent a bit deciding if I should use `left < right` and `left/right = mid`, or
 * `left <= right` and `left/right = mid ± 1`. I concluded that the former is invalid and used
 * the latter.
 */
export function iterativeBinarySearch(number: number, sortedArray: number[]): number {
  let left = 0
  let right = sortedArray.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (number < sortedArray[mid]) {
      right = mid - 1
    } else if (number > sortedArray[mid]) {
      left = mid + 1
    } else {
      return mid
    }
  }

  return -1
}

export function recursiveBinarySearch(number: number, sortedArray: number[]): number {
  function recurse(target: number, array: number[], left: number, right: number): number {
    if (left > right) {
      return -1
    }

    const mid = Math.floor((left + right) / 2)
    if (target < array[mid]) {
      return recurse(target, array, left, mid - 1)
    } else if (target > array[mid]) {
      return recurse(target, array, mid + 1, right)
    } else {
      return mid
    }
  }

  return recurse(number, sortedArray, 0, sortedArray.length - 1)
}

export function ooBinarySearch(number: number, sortedArray: number[]): number {
  class BinarySearch<T> {
    private static readonly NOT_FOUND = -1

    constructor(private readonly compareFn: CompareFn<T>) {}

    findIndex(theWindow: SearchWindow<T>, searchElement: T): number {
      let window = theWindow

      while (!window.isEmpty()) {
        if (this.isSearchElementInLeftHalf(searchElement, window)) {
          window = window.leftHalfWithoutMid()
        } else if (this.isSearchElementInRightHalf(searchElement, window)) {
          window = window.rightHalfWithoutMid()
        } else {
          return window.midIndex()
        }
      }

      return BinarySearch.NOT_FOUND
    }

    private isSearchElementInLeftHalf(target: T, window: SearchWindow<T>) {
      return this.compareFn(target, window.midElement()) < 0
    }

    private isSearchElementInRightHalf(target: T, window: SearchWindow<T>) {
      return this.compareFn(target, window.midElement()) > 0
    }
  }

  interface CompareFn<T> {
    (o1: T, o2: T): number
  }

  interface SearchWindow<T> {
    midElement(): T
    midIndex(): number

    leftHalfWithoutMid(): SearchWindow<T>
    rightHalfWithoutMid(): SearchWindow<T>

    isEmpty(): boolean
  }

  class ArraySearchWindow<T> implements SearchWindow<T> {
    constructor(
      private readonly array: ReadonlyArray<T>,
      private readonly start: number = 0,
      private readonly end: number = array.length - 1
    ) {
      assert(start >= 0, 'Start cannot be less than 0')
      assert(end <= array.length - 1, 'End cannot be larger than the last index')
    }

    midElement(): T {
      return this.array[this.midIndex()]
    }

    midIndex(): number {
      if (this.isEmpty()) {
        throw new Error('Cannot get mid index of empty window')
      }
      return Math.floor((this.start + this.end) / 2)
    }

    leftHalfWithoutMid(): SearchWindow<T> {
      return new ArraySearchWindow(this.array, this.start, this.midIndex() - 1)
    }

    rightHalfWithoutMid(): SearchWindow<T> {
      return new ArraySearchWindow(this.array, this.midIndex() + 1, this.end)
    }

    isEmpty(): boolean {
      return this.end < this.start
    }
  }

  function assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(message)
    }
  }

  const searchWindow = new ArraySearchWindow(sortedArray)
  const numberCompare: CompareFn<number> = (o1: number, o2: number): number => {
    return o1 - o2
  }
  return new BinarySearch(numberCompare).findIndex(searchWindow, number)
}
