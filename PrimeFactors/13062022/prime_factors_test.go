package main

import (
	"fmt"
	"reflect"
	"testing"
)

func TestPrimeFactors(t *testing.T) {
	tests := []struct {
		number       int
		primeFactors []int
	}{
		{1, []int{}},
		{2, []int{2}},
		{3, []int{3}},
		{4, []int{2, 2}},
		{6, []int{2, 3}},
		{8, []int{2, 2, 2}},
		{9, []int{3, 3}},
		{18, []int{2, 3, 3}},
		{25, []int{5, 5}},
		{64, []int{2, 2, 2, 2, 2, 2}},
		{74, []int{2, 37}},
		{74, []int{2, 37}},
		{205, []int{5, 41}},
		{7519, []int{73, 103}},
		{30030, []int{2, 3, 5, 7, 11, 13}},
	}

	for _, test := range tests {
		t.Run(fmt.Sprintf("Prime factors of %v", test.number), func(t *testing.T) {
			want := test.primeFactors
			got := PrimeFactors(test.number)

			if !reflect.DeepEqual(got, want) {
				t.Errorf("got %v want %v", got, want)
			}
		})
	}
}
