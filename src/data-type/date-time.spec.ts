
import { expect } from 'chai';

import {
  PATTERN,
  parse,
  format
} from './date-time';

describe('dataType.dateTime', function () {
  describe('#PATTERN', function () {
    it('should match values correctly when using it to compose '+
        'regular expressions', function () {

      var regex: RegExp;
      var match: RegExpMatchArray;

      // test case 1

      regex = new RegExp(`^${PATTERN}$`);

      expect(regex.test('2020-10-09, 14:25:30')).to.equal(true);

      // test case 2

      regex = new RegExp(`^date-time: (${PATTERN})$`);
      match = 'date-time: 2020-10-09, 14:25:30'.match(regex);

      expect(match).to.have.lengthOf(2);
      expect(match[1]).to.equal('2020-10-09, 14:25:30');
    });
  });

  describe('#parse()', function () {
    it('should returns correct `Date` based upon value', function () {
      var date: Date;

      // test case 1

      date = parse('2020-10-09, 14:25:30');

      expect(date.getTime()).to.not.be.NaN;
      expect(date.getFullYear()).to.equal(2020);
      expect(date.getMonth()).to.equal(9);
      expect(date.getDate()).to.equal(9);
      expect(date.getHours()).to.equal(14);
      expect(date.getMinutes()).to.equal(25);
      expect(date.getSeconds()).to.equal(30);

      // test case 2

      date = parse('2021-11-11, 15:26:31');
      expect(date.getTime()).to.not.be.NaN;
      expect(date.getFullYear()).to.equal(2021);
      expect(date.getMonth()).to.equal(10);
      expect(date.getDate()).to.equal(11);
      expect(date.getHours()).to.equal(15);
      expect(date.getMinutes()).to.equal(26);
      expect(date.getSeconds()).to.equal(31);
    });
  });

  describe('#format()', function () {
    it('should obtain correctly game formatted date and time', function () {
      var date: Date;

      // test case 1

      date = new Date(2020, 9, 9, 14, 25, 30);

      expect(format(date)).to.equal('2020-10-09, 14:25:30');

      // test case 2

      date = new Date(2021, 10, 10, 5, 6);

      expect(format(date)).to.equal('2021-11-10, 05:06:00');
    });
  });
});
