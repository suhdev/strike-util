const expect = require('chai').expect;
const printf = require('../lib/Util').printf;
describe('printf digits', () => {
  it('printf - numbers', () => {
    const expectedResult = "1 is equal to 1";

    expect(printf("%d is equal to %d",1,1)).to.equal(expectedResult);
  });

  it('printf typeof number', ()=>{
      const expectedResult = "1 is of type number";

    expect(printf("%d is of type %typeof",1,1)).to.equal(expectedResult);
  });

  it('printf typeof string', ()=>{
      const expectedResult = "'Name' is of type string";

    expect(printf("'%s' is of type %typeof",'Name','Name')).to.equal(expectedResult);
  });

  it('printf - string', () => {
    const expectedResult = "FirstName and LastName is FullName";

    expect(printf("%s and %s is %s",'FirstName','LastName','FullName')).to.equal(expectedResult);
  });

  it('printf - digits with extras - integer', () => {
    const expectedResult = "020 is 20";

    expect(printf("%03d is 20",20)).to.equal(expectedResult);
  });

  it('printf - digits with extras - float 1', () => {
    const expectedResult = "20.20 is 20.20";

    expect(printf("%.2d is 20.20",20.2)).to.equal(expectedResult);
  });

  it('printf - digits with extras - float 2', () => {
    const expectedResult = "20.25 is 20.25";

    expect(printf("%.2d is 20.25",20.25)).to.equal(expectedResult);
  });

  it('printf - digits with extras - float 3', () => {
    const expectedResult = "20.26 is 20.26";

    expect(printf("%.2d is 20.26",20.25556)).to.equal(expectedResult);
  });

  it('printf - digits with extras - float 4', () => {
    const expectedResult = "0020.26 is 0020.26";

    expect(printf("%04.2d is 0020.26",20.25556)).to.equal(expectedResult);
  });

  it('printf - digits with hex', () => {
    const expectedResult = "0xffff is 0xffff";

    expect(printf("%x is 0xffff",0xffff)).to.equal(expectedResult);
  });
});