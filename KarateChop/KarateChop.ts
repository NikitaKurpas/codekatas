/**
 * @privateRemarks
 * - Spent a bit deciding if I should use `left < right` and `left/right = mid`, or
 * `left <= right` and `left/right = mid ± 1`. I concluded that the former is invalid and used
 * the latter.
 */
export function iterativeBinarySearch(number: number, sortedArray: number[]): number {
  let leftIndex = 0
  let rightIndex = sortedArray.length - 1

  while (leftIndex <= rightIndex) {
    const midIndex = Math.floor((leftIndex + rightIndex) / 2)
    const midElement = sortedArray[midIndex]

    if (number < midElement) {
      rightIndex = midIndex - 1
    } else if (number > midElement) {
      leftIndex = midIndex + 1
    } else {
      return midIndex
    }
  }

  return -1
}

export function recursiveBinarySearch(number: number, sortedArray: number[]): number {
  function findRecursively(
    searchElement: number,
    array: number[],
    leftIndex: number = 0,
    rightIndex: number = array.length - 1
  ): number {
    if (leftIndex > rightIndex) {
      return -1
    }

    const midIndex = Math.floor((leftIndex + rightIndex) / 2)
    const midElement = array[midIndex]

    if (searchElement < midElement) {
      return findRecursively(searchElement, array, leftIndex, midIndex - 1)
    } else if (searchElement > midElement) {
      return findRecursively(searchElement, array, midIndex + 1, rightIndex)
    } else {
      return midIndex
    }
  }

  return findRecursively(number, sortedArray)
}

export function ooBinarySearch(number: number, sortedArray: number[]): number {
  class BinarySearch<T> {
    private static readonly NOT_FOUND = -1

    constructor(private readonly compareFn: CompareFn<T>) {}

    findIndex(window: BinarySearchWindow<T>, searchElement: T): number {
      for (let currentWindow = window; !currentWindow.isEmpty(); ) {
        if (this.isSearchElementInLeftHalf(searchElement, currentWindow)) {
          currentWindow = currentWindow.leftHalfWithoutMid()
        } else if (this.isSearchElementInRightHalf(searchElement, currentWindow)) {
          currentWindow = currentWindow.rightHalfWithoutMid()
        } else {
          return currentWindow.midIndex()
        }
      }

      return BinarySearch.NOT_FOUND
    }

    private isSearchElementInLeftHalf(searchElement: T, window: BinarySearchWindow<T>) {
      return this.compareFn(searchElement, window.midElement()) < 0
    }

    private isSearchElementInRightHalf(searchElement: T, window: BinarySearchWindow<T>) {
      return this.compareFn(searchElement, window.midElement()) > 0
    }
  }

  interface CompareFn<T> {
    (o1: T, o2: T): number
  }

  interface BinarySearchWindow<T> {
    midElement(): T
    midIndex(): number

    leftHalfWithoutMid(): BinarySearchWindow<T>
    rightHalfWithoutMid(): BinarySearchWindow<T>

    isEmpty(): boolean
  }

  class ArraySearchWindow<T> implements BinarySearchWindow<T> {
    constructor(
      private readonly array: ReadonlyArray<T>,
      private readonly startIndex: number = 0,
      private readonly endIndex: number = array.length - 1
    ) {
      assert(startIndex >= 0, 'Start cannot be less than 0')
      assert(endIndex <= array.length - 1, 'End cannot be larger than the last index')
    }

    midElement(): T {
      return this.array[this.midIndex()]
    }

    midIndex(): number {
      if (this.isEmpty()) {
        throw new Error('Search window is empty')
      }
      return Math.floor((this.startIndex + this.endIndex) / 2)
    }

    leftHalfWithoutMid(): BinarySearchWindow<T> {
      return new ArraySearchWindow(this.array, this.startIndex, this.midIndex() - 1)
    }

    rightHalfWithoutMid(): BinarySearchWindow<T> {
      return new ArraySearchWindow(this.array, this.midIndex() + 1, this.endIndex)
    }

    isEmpty(): boolean {
      return this.endIndex < this.startIndex
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
  function pipe<T, V1, V2>(value: T, fn1?: (value: T) => V1, fn2?: (value: V1) => V2): unknown {
    switch (arguments.length) {
      case 2:
        return fn1!(value)
      case 3:
        return fn2!(fn1!(value))
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
