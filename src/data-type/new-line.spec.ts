
import { expect } from 'chai';

import {
  PATTERN,
  UNIX_PATTERN,
  MAC_PATTERN,
  WIN_PATTERN,
  pattern
} from './new-line';

describe('data.newLine', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      var regex: RegExp;
      var match: RegExpMatchArray;

      // test case 1

      regex = new RegExp(`^${PATTERN}$`);

      expect(regex.test('\n')).to.equal(true);
      expect(regex.test('\r')).to.equal(true);
      expect(regex.test('\r\n')).to.equal(true);

      // test case 2

      regex = new RegExp(`^new-line: (${PATTERN})$`);
      match = 'new-line: \n'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('\n');

      // test case 2

      match = 'new-line: \r'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('\r');

      // test case 3

      match = 'new-line: \r\n'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('\r\n');
    });
  });

  describe('#UNIX_PATTERN, #MAC_PATTERN, #WIN_PATTERN', function () {
    it('should match values correctly', function () {
      var regex: RegExp;

      // test case 1

      regex = new RegExp(`^${UNIX_PATTERN}$`);

      expect(regex.test('\n')).to.equal(true);

      // test case 2

      regex = new RegExp(`^${MAC_PATTERN}$`);

      expect(regex.test('\r')).to.equal(true);

      // test case 3

      regex = new RegExp(`^${WIN_PATTERN}$`);

      expect(regex.test('\r\n')).to.equal(true);
    });
  });

  describe('#format', function () {
    it('should obtain correctly pattern based upon matched new-line',
        function () {

      // test case 1

      expect(pattern('\n')).to.equal(UNIX_PATTERN);

      // test case 2

      expect(pattern('\r')).to.equal(MAC_PATTERN);

      // test case 3

      expect(pattern('\r\n')).to.equal(WIN_PATTERN);

      // test case 4

      expect(function() { pattern(' ') }).to.throw();
    });
  });
});
