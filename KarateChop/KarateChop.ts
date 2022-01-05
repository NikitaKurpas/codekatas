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
