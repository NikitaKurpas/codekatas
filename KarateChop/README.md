# [KarateChop](http://codekata.com/kata/kata02-karate-chop/)

## Description

A binary chop (sometimes called the more prosaic binary search) finds the position of value in a
sorted array of values. It achieves some efficiency by halving the number of items under
consideration each time it probes the values: in the first pass it determines whether the required
value is in the top or the bottom half of the list of values. In the second pass in considers only
this half, again dividing it in to two. It stops when it finds the value it is looking for, or when
it runs out of array to search. Binary searches are a favorite of CS lecturers.

This Kata is straightforward. Implement a binary search routine in the language and technique of
your choice. Tomorrow, implement it again, using a totally different technique. Do the same the
next day, until you have five totally unique implementations of a binary search. (For example, one
solution might be the traditional iterative approach, one might be recursive, one might use a
functional style passing array slices around, and so on).

You can assume that the array has less than 100,000 elements. No duplicates. For the purposes of
this Kata, time and memory performance are not issues (assuming the chop terminates before you get
bored and kill it, and that you have enough RAM to run it).
