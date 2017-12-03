(function () {
	module('ieee-754');

	var BigNumberIeee754 = BigNumber.another({ DECIMAL_PLACES: 1100, ERRORS: true });

	testConvertersOpts({
		name: 'Valid base',
		extensionNames: ['extIeee754'],
		Big: BigNumberIeee754,
		fn: function (converter) {
			strictEqual(converter.valid('dec'), true, 'dec');
			strictEqual(converter.valid('dec32'), true, 'dec32');
			strictEqual(converter.valid('dec64'), true, 'dec64');
			strictEqual(converter.valid('bin32'), true, 'bin32');
			strictEqual(converter.valid('bin64'), true, 'bin64');
			strictEqual(converter.valid('hex32'), true, 'hex32');
			strictEqual(converter.valid('hex64'), true, 'hex64');
		},
	});

	testConvertersOpts({
		name: 'Within 32 bits',
		extensionNames: ['extIeee754'],
		Big: BigNumberIeee754,
		fn: function (converter) {
			var conversions = [
				{
					dec: '0',
					dec32: '0',
					dec64: '0',
					bin32: '0 00000000 00000000000000000000000',
					bin64: '0 00000000000 0000000000000000000000000000000000000000000000000000',
					hex32: '00000000',
					hex64: '0000000000000000',
				},
				{
					dec: '-0',
					dec32: '-0',
					dec64: '-0',
					bin32: '1 00000000 00000000000000000000000',
					bin64: '1 00000000000 0000000000000000000000000000000000000000000000000000',
					hex32: '80000000',
					hex64: '8000000000000000',
				},
				{
					dec: '123456',
					dec32: '123456',
					dec64: '123456',
					bin32: '0 10001111 11100010010000000000000',
					bin64: '0 10000001111 1110001001000000000000000000000000000000000000000000',
					hex32: '47F12000',
					hex64: '40FE240000000000',
				},
				{
					dec: 'NaN',
					dec32: 'NaN',
					dec64: 'NaN',
					bin32: '0 11111111 10000000000000000000000',
					bin64: '0 11111111111 1000000000000000000000000000000000000000000000000000',
					hex32: '7FC00000',
					hex64: '7FF8000000000000',
				},
				{
					dec: 'Infinity',
					dec32: 'Infinity',
					dec64: 'Infinity',
					bin32: '0 11111111 00000000000000000000000',
					bin64: '0 11111111111 0000000000000000000000000000000000000000000000000000',
					hex32: '7F800000',
					hex64: '7FF0000000000000',
				},
				{
					dec: '-Infinity',
					dec32: '-Infinity',
					dec64: '-Infinity',
					bin32: '1 11111111 00000000000000000000000',
					bin64: '1 11111111111 0000000000000000000000000000000000000000000000000000',
					hex32: 'FF800000',
					hex64: 'FFF0000000000000',
				},
				{
					dec: '0.10000000149011612',
					dec32: '0.100000001490116119384765625',
					dec64: '0.100000001490116119384765625',
					bin32: '0 01111011 10011001100110011001101',
					bin64: '0 01111111011 1001100110011001100110100000000000000000000000000000',
					hex32: '3DCCCCCD',
					hex64: '3FB99999A0000000',
				},
				{
					dec: '9.999999680285692e+37',
					dec32: '99999996802856924650656260769173209088',
					dec64: '99999996802856924650656260769173209088',
					bin32: '0 11111101 00101100111011010011001',
					bin64: '0 10001111101 0010110011101101001100100000000000000000000000000000',
					hex32: '7E967699',
					hex64: '47D2CED320000000',
				},
				{
					dec: '1.401298464324817e-45',
					dec32: '0.00000000000000000000000000000000000000000000140129846432481707092372958328991613128026194187651577175706828388979108268586060148663818836212158203125',
					dec64: '0.00000000000000000000000000000000000000000000140129846432481707092372958328991613128026194187651577175706828388979108268586060148663818836212158203125',
					bin32: '0 00000000 00000000000000000000001',
					bin64: '0 01101101010 0000000000000000000000000000000000000000000000000000',
					hex32: '00000001',
					hex64: '36A0000000000000',
				},
			];

			for (var i = 0; i < conversions.length; i++) {
				var c = conversions[i];

				c.fromBin32 = c.fromBin64 =
				c.fromHex32 = c.fromHex64 = c.dec;

				deepEqual(
					{
						dec: c.dec,
						dec32: converter.convert('dec', 'dec32', c.dec),
						dec64: converter.convert('dec', 'dec64', c.dec),
						bin32: converter.convert('dec', 'bin32', c.dec),
						bin64: converter.convert('dec', 'bin64', c.dec),
						hex32: converter.convert('dec', 'hex32', c.dec),
						hex64: converter.convert('dec', 'hex64', c.dec),

						fromBin32: converter.convert('bin32', 'dec', c.bin32),
						fromBin64: converter.convert('bin64', 'dec', c.bin64),
						fromHex32: converter.convert('hex32', 'dec', c.hex32),
						fromHex64: converter.convert('hex64', 'dec', c.hex64),
					},
					c,
					'dec <-> all - ' + c.dec
				);
			}
		},
	});

	testConvertersOpts({
		name: 'More than 32 bits',
		extensionNames: ['extIeee754'],
		Big: BigNumberIeee754,
		fn: function (converter) {
			var conversions = [
				{
					dec: '0.1',
					dec32: '0.100000001490116119384765625',
					dec64: '0.1000000000000000055511151231257827021181583404541015625',
					bin32: '0 01111011 10011001100110011001101',
					bin64: '0 01111111011 1001100110011001100110011001100110011001100110011010',
					hex32: '3DCCCCCD',
					hex64: '3FB999999999999A',
				},
				{
					// First integer not representable in 32 bits.
					dec: '16777217',
					dec32: '16777216',
					dec64: '16777217',
					bin32: '0 10010111 00000000000000000000000',
					bin64: '0 10000010111 0000000000000000000000010000000000000000000000000000',
					hex32: '4B800000',
					hex64: '4170000010000000',
				},
				{
					dec: '3.141592653589793',
					dec32: '3.1415927410125732421875',
					dec64: '3.141592653589793115997963468544185161590576171875',
					bin32: '0 10000000 10010010000111111011011',
					bin64: '0 10000000000 1001001000011111101101010100010001000010110100011000',
					hex32: '40490FDB',
					hex64: '400921FB54442D18',
				},
				{
					dec: '1e+39',
					dec32: 'Infinity',
					dec64: '999999999999999939709166371603178586112',
					bin32: '0 11111111 00000000000000000000000',
					bin64: '0 10010000000 0111100000101000011111110100100111000100101000011101',
					hex32: '7F800000',
					hex64: '48078287F49C4A1D',
				},
				{
					dec: '1e-46',
					dec32: '0',
					dec64: '0.0000000000000000000000000000000000000000000001000000000000000022999043453913216828505961640883084488789349378835264740187722591657382693176711544546107892003424942768685657057403659564442932605743408203125',
					bin32: '0 00000000 00000000000000000000000',
					bin64: '0 01101100110 0010010001001100111000100100001011000101010101100001',
					hex32: '00000000',
					hex64: '366244CE242C5561',
				},
				{
					dec: '1e+308',
					dec32: 'Infinity',
					dec64: '100000000000000001097906362944045541740492309677311846336810682903157585404911491537163328978494688899061249669721172515611590283743140088328307009198146046031271664502933027185697489699588559043338384466165001178426897626212945177628091195786707458122783970171784415105291802893207873272974885715430223118336',
					bin32: '0 11111111 00000000000000000000000',
					bin64: '0 11111111110 0001110011001111001110000101111010111100100010100000',
					hex32: '7F800000',
					hex64: '7FE1CCF385EBC8A0',
				},
				{
					dec: '1e-323',
					dec32: '0',
					dec64: '0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000988131291682493088353137585736442744730119605228649528851171365001351014540417503730599672723271984759593129390891435461853313420711879592797549592021563756252601426380622809055691634335697964207377437272113997461446100012774818307129968774624946794546339230280063430770796148252477131182342053317113373536374079120621249863890543182984910658610913088802254960259419999083863978818160833126649049514295738029453560318710477223100269607052986944038758053621421498340666445368950667144166486387218476578691673612021202301233961950615668455463665849580996504946155275185449574931216955640746893939906729403594535543517025132110239826300978220290207572547633450191167477946719798732961988232841140527418055848553508913045817507736501283943653106689453125',
					bin32: '0 00000000 00000000000000000000000',
					bin64: '0 00000000000 0000000000000000000000000000000000000000000000000010',
					hex32: '00000000',
					hex64: '0000000000000002',
				},
			];

			for (var i = 0; i < conversions.length; i++) {
				var c = conversions[i];

				c.fromBin32 =  c.fromHex32 = +c.dec32 + '';
				c.fromBin64 = c.fromHex64 = c.dec;

				deepEqual(
					{
						dec: c.dec,
						dec32: converter.convert('dec', 'dec32', c.dec),
						dec64: converter.convert('dec', 'dec64', c.dec),
						bin32: converter.convert('dec', 'bin32', c.dec),
						bin64: converter.convert('dec', 'bin64', c.dec),
						hex32: converter.convert('dec', 'hex32', c.dec),
						hex64: converter.convert('dec', 'hex64', c.dec),

						fromBin32: converter.convert('bin32', 'dec', c.bin32),
						fromBin64: converter.convert('bin64', 'dec', c.bin64),
						fromHex32: converter.convert('hex32', 'dec', c.hex32),
						fromHex64: converter.convert('hex64', 'dec', c.hex64),
					},
					c,
					'dec <-> all - ' + c.dec
				);
			}
		},
	});

	testConvertersOpts({
		name: 'Special cases',
		extensionNames: ['extIeee754'],
		Big: BigNumberIeee754,
		fn: function (converter) {
			deepEqual(
				converter.convertToMultiple('dec', ['dec32', 'hex32'], 'nan'),
				['NaN', '7FC00000'],
				'convertToMultiple(... nan)');

			deepEqual(converter.convert('dec', 'dec', '∞'), 'Infinity', '∞ > Infinity');
			deepEqual(converter.convert('dec', 'dec', 'infinity'), 'Infinity', 'infinity > Infinity');
			deepEqual(converter.convert('dec', 'dec', 'abc'), undefined, 'abc > undefined');
			deepEqual(converter.convert('dec', 'dec', ''), undefined, 'empty string > undefined');
			deepEqual(converter.convert('dec', 'dec', ' '), undefined, 'space > undefined');
			deepEqual(converter.convert('bin32', 'dec', '0b0 01111111 00000000000000000000000'), '1', 'binary: 0b prefix');
			deepEqual(converter.convert('hex32', 'dec', '0x3F800000'), '1', 'hexadecimal: 0x prefix');

		},
	});

}());
