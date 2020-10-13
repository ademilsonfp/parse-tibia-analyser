
import { expect } from 'chai';

import { PATTERN } from './indentation';

describe('dataType.indentation', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      var regex: RegExp;
      var match: RegExpMatchArray;

      // test case 1

      regex = new RegExp(`^${PATTERN}$`);

      expect(regex.test('\t')).to.equal(true);
      expect(regex.test('  ')).to.equal(true);
      expect(regex.test('    ')).to.equal(true);

      // test case 2

      regex = new RegExp(`^(${PATTERN})test$`);
      match = '\ttest'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('\t');

      // test case 3

      match = '  test'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('  ');

      // test case 4

      match = '    test'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('    ');
    });
  });
});

