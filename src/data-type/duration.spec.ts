
import { expect } from 'chai';

import {
  PATTERN,
  MAX_SAFE_DURATION,
  format,
  parse
} from './duration';

describe('dataType.duration', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      var regex: RegExp;
      var match: RegExpMatchArray;

      // test case 1

      regex = new RegExp(`^${PATTERN}$`);

      expect(regex.test('14:25h')).to.equal(true);

      // test case 2

      regex = new RegExp(`^duration: (${PATTERN})$`);
      match = 'duration: 14:25h'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('14:25h');
    });
  });

  describe('#parse()', function () {
    it('should returns correct duration in milliseconds', function () {
      // test case 1

      expect(parse('14:25h')).to.equal(51900000);

      // test case 2

      expect(parse('99:59h')).to.equal(MAX_SAFE_DURATION);
    });
  });

  describe('#format()', function () {
    it('should obtain correctly game formatted duration', function () {
      // test case 1

      expect(format(51900000)).to.equal('14:25h');

      // test case 2

      expect(format(MAX_SAFE_DURATION)).to.equal('99:59h');
    });
  });
});
