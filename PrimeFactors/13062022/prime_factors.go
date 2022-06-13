package main

func PrimeFactors(number int) []int {
	factors := make([]int, 0)

	for test := 2; test <= number; test++ {
		for ; number%test == 0; number /= test {
			factors = append(factors, test)
		}
	}

	return factors
}
