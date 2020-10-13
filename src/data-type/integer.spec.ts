
import { expect } from 'chai';

import {
  PATTERN,
  parse,
  format
} from './integer';

describe('dataType.integer', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      var regex: RegExp;
      var match: RegExpMatchArray;

      // test case 1

      regex = new RegExp(`^${PATTERN}$`);

      expect(regex.test('12')).to.equal(true);
      expect(regex.test('123')).to.equal(true);
      expect(regex.test('1,234')).to.equal(true);
      expect(regex.test('1,234,567')).to.equal(true);
      expect(regex.test('-1,234,567')).to.equal(true);

      // test case 2

      regex = new RegExp(`^integer: (${PATTERN})$`);
      match = 'integer: 1,234,567'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('1,234,567');

      match = 'integer: -1,234,567'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('-1,234,567');
    });
  });

  describe('#parse()', function () {
    it('should returns correct `number` based upon value', function () {
      var integer: number;

      // test case 1

      integer = parse('12');

      expect(integer).to.not.be.NaN;
      expect(integer).to.equal(12);

      // test case 2

      integer = parse('1,234,567');

      expect(integer).to.not.be.NaN;
      expect(integer).to.equal(1234567);

      // test case 3

      integer = parse('-1,234,567');

      expect(integer).to.not.be.NaN;
      expect(integer).to.equal(-1234567);
    });
  });

  describe('#format()', function () {
    it('should obtain correctly game formatted integer', function () {
      // test case 1

      expect(format(12)).to.equal('12');

      // test case 2

      expect(format(1234567)).to.equal('1,234,567');

      // test case 3

      expect(format(-1234567)).to.equal('-1,234,567');
    });
  });
});
