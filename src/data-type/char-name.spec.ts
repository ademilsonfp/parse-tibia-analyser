
import { expect } from 'chai';

import { PATTERN } from './char-name';

describe('dataType.charName', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      const regex = new RegExp(`^${PATTERN}$`);

      // true test cases

      expect(regex.test('Tulke Borian')).to.equal(true);
      expect(regex.test('Hermes Tris')).to.equal(true);
      expect(regex.test('Di novo')).to.equal(true);

      // false test cases

      expect(regex.test('tulke Borian')).to.equal(false);
      expect(regex.test('HermesTris')).to.equal(false);
      expect(regex.test('Di  novo')).to.equal(false);
    });
  });
});

