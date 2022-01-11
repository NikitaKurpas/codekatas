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
  function findRecursively(target: number, array: number[], left: number, right: number): number {
    if (left > right) {
      return -1
    }

    const mid = Math.floor((left + right) / 2)
    if (target < array[mid]) {
      return findRecursively(target, array, left, mid - 1)
    } else if (target > array[mid]) {
      return findRecursively(target, array, mid + 1, right)
    } else {
      return mid
    }
  }

  return findRecursively(number, sortedArray, 0, sortedArray.length - 1)
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

export function fpBinarySearch(number: number, sortedArray: number[]): number {
  function findRecursively(searchElement: number): (arraySlice: number[]) => Option<number> {
    return (arraySlice) =>
      pipe(
        getMidIndex(arraySlice),
        map((midIndex) => [midIndex, arraySlice[midIndex]]),
        chain(([midIndex, midElement]) =>
          searchElement === midElement
            ? some(midIndex)
            : searchElement < midElement
            ? pipe(arraySlice.slice(0, midIndex), findRecursively(searchElement))
            : searchElement > midElement
            ? pipe(
                arraySlice.slice(midIndex + 1),
                findRecursively(searchElement),
                map(add(midIndex + 1))
              )
            : none
        )
      )
  }
  function getMidIndex(array: unknown[]): Option<number> {
    return array.length === 0 ? none : some(Math.floor(array.length / 2))
  }
  function add(a: number): (b: number) => number {
    return (b) => a + b
  }

  type Option<T> = Some<T> | None
  type Some<T> = { readonly __brand: 'some'; readonly value: T }
  type None = { readonly __brand: 'none' }
  function some<T>(value: T): Some<T> {
    return { __brand: 'some', value }
  }
  const none: None = { __brand: 'none' }
  function isNone(option: Option<any>): option is None {
    return option.__brand === 'none'
  }
  function chain<T, U>(mapper: (value: T) => Option<U>): (option: Option<T>) => Option<U> {
    return (option) => (isNone(option) ? none : mapper(option.value))
  }
  function map<T, U>(mapper: (value: T) => U): (option: Option<T>) => Option<U> {
    return (option) => (isNone(option) ? none : some(mapper(option.value)))
  }
  function fold<T, U>(onNone: () => U, onSome: (value: T) => U): (option: Option<T>) => U {
    return (option) => (isNone(option) ? onNone() : onSome(option.value))
  }

  function pipe<T, V1>(value: T, fn: (value: T) => V1): V1
  function pipe<T, V1, V2>(value: T, fn1: (value: T) => V1, fn2: (value: V1) => V2): V2
  function pipe<T, V1, V2, V3>(
    value: T,
    fn1: (value: T) => V1,
    fn3: (value: V1) => V2,
    fn2: (value: V2) => V3
  ): V3
  function pipe<T, V1, V2, V3>(
    value: T,
    fn1?: (value: T) => V1,
    fn2?: (value: V1) => V2,
    fn3?: (value: V2) => V3
  ): unknown {
    switch (arguments.length) {
      case 2:
        return fn1!(value)
      case 3:
        return fn2!(fn1!(value))
      case 4:
        return fn3!(fn2!(fn1!(value)))
    }
  }

  return pipe(
    sortedArray,
    findRecursively(number),
    fold(
      () => -1,
      (index) => index
    )
  )
}

export function generatorBinarySearch(number: number, sortedArray: number[]): number {
  function* makeSearchGenerator<T>(array: T[]): Generator<T, number, number> {
    let startIndex = 0
    let endIndex = array.length - 1
    while (startIndex <= endIndex) {
      const midIndex = Math.floor((startIndex + endIndex) / 2)
      const midElement = array[midIndex]
      const compareResult = yield midElement

      if (compareResult < 0) {
        endIndex = midIndex - 1
      } else if (compareResult > 0) {
        startIndex = midIndex + 1
      } else {
        return midIndex
      }
    }

    return -1
  }

  const searchGenerator = makeSearchGenerator(sortedArray)
  let next = searchGenerator.next()
  for (; !next.done; next = searchGenerator.next(number - next.value)) {}
  return next.value
}
