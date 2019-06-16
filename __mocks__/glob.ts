const testFileData: any = {
  "path/t1.spec.js": "describe('s1', () => { it('d1', () => {}); });",
  "path/t2.spec.js": "describe('s2', () => { it('d2', () => {}); });",
  "path/t3.spec.js": "describe('s3', () => { " + "it('d3.1', () => {}); }); it('d3.2', () => {}); });",
  "path/t4.spec.js": "describe('\\'s4\\'', () => { it('\\'d4\\'', () => {}); });",
  "path/t5.spec.js": "describe('\\\"s5\\\"', () => { it('\\\"d5\\\"', () => {}); });",
  "path/t6.spec.js":
    "describe('s6', () => { it('d6.1', () => {}); });" +
    "describe('s6.2', () => { it('d6.2', () => {}); });" +
    "describe('s6.3', () => { it('d6.3', () => {}); });" +
    "describe('s6.4', () => { describe('s6.4.1'+'text', () => { " +
    "it('d6.4.1'+'text', () => {}); }); });",
};

const sync = jest.fn(() => Object.keys(testFileData));

export { sync };
