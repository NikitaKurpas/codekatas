/**
 * @privateRemarks
 * - Spent a bit deciding if I should use `left < right` and `left/right = mid`, or
 * `left <= right` and `left/right = mid ± 1`. I concluded that the former is invalid and used
 * the latter.
 */
export function iterativeBinarySearch(number: number, sortedArray: number[]): number {
  if (sortedArray.length === 0) {
    return -1
  }

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
