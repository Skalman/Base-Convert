module("twos_complement");

test("Basic requirements", function () {
	expect(2);
	ok(Base, "Base");
	ok(Base.extensions.twos_complement, "Base.extensions.twos_complement");
});

test("Valid base", function () {
	expect(1);

	strictEqual(Base.valid("2-compl"), true, "2-compl");
});

test("Convert between bases", function () {
	var i, undefined,
		conversions = [
			{
				2: "10 1010 0011",
				"2-compl": "0010 1010 0011"
			},
			{
				2: "-10 1010 0011",
				"2-compl": "1101 0101 1101"
			},
			{
				2: "-1",
				"2-compl": "1111"
			},
			{
				2: "-0.0001",
				"2-compl": "1111.1111 0000"
			},
			{
				2: "-10.1010 0011",
				"2-compl": "1101.0101 1101 0000"
			},
		];

	expect(conversions.length);

	for (i = 0; i < conversions.length; i++) {
		deepEqual(
			{
				2: Base("2-compl", 2, conversions[i]["2-compl"]),
				"2-compl": Base(2, "2-compl", conversions[i][2])
			},
			conversions[i],
			conversions[i][2] + " <-> " + conversions[i]["2-compl"]);
	}
});

test("Decimal comma", function () {
	expect(1);

	strictEqual(Base("2-compl", 2, " 1 0 0 1 , 1 1 0 1 "), "-110.0011", "1 0 0 1 , 1 1 0 1")
});

test("Edge cases - rounded results accepted", function () {
	var i, j, k, result,
		conversions = [
			{ from: 10, to: "2-compl",
				"-0.2" : [
					// Depending on rounding, there are three possible endings: 1100, 11000000, and 11010000
					/^1111\.(1100 )*1100$/,
					/^1111\.(1100 )*1100 0000$/,
					/^1111\.(1100 )*1101 0000$/,
				]
			}
		];
	function in_array(elem, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].test(elem)) {
				return true;
			}
		}
		return false;
	}

	for (i = 0; i < conversions.length; i++) {
		for (j in conversions[i]) {
			if (j === "from" || j === "to") {
				continue;
			}
			result = Base(conversions[i].from, conversions[i].to, j);
			if (in_array(result, conversions[i][j])) {
				ok(true, "correct conversion of '" + j + "'");
			} else {
				equal(result, conversions[i][j][0] + "", "conversion of '" + j + "' (rounded results accepted)");
			}
		}
	}
});
