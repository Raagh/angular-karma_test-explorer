// const testFileData = {
//   'path/t1.spec.js':'describe(\'s1\', function() { it(\'d1\', function() {}); });',
//   'path/t2.spec.js':'describe(\'s2\', function() { it(\'d2\', function() {}); });',
//   'path/t3.spec.js':'describe(\'s3\', function() { ' +
//     'it(\'d3.1\', function() {}); }); it(\'d3.2\', function() {}); });',
//   'path/t4.spec.js':'describe(\'\\\'s4\\\'\', function() { it(\'\\\'d4\\\'\', function() {}); });',
//   'path/t5.spec.js':'describe(\'\\\"s5\\\"\', function() { it(\'\\\"d5\\\"\', function() {}); });',
//   'path/t6.spec.js':'describe(\'s6\', function() { it(\'d6.1\', function() {}); });' +
//     'describe(\'s6.2\', function() { it(\'d6.2\', function() {}); });' +
//     'describe(\'s6.3\', function() { it(\'d6.3\', function() {}); });' +
//     'describe(\'s6.4\', function() { describe(\'s6.4.1\'+\'text\', function() { ' +
//       'it(\'d6.4.1\'+\'text\', function() {}); }); });'
// }

// const parsedTestFiles = {
//   'path/t1.spec.js': { describe: ['s1'], it: ['d1']},
//   'path/t2.spec.js': { describe: ['s2'], it: ['d2']},
//   'path/t3.spec.js': { describe: ['s3'], it: ['d3.1', 'd3.2']},
//   'path/t4.spec.js': { describe: ['\\\'s4\\\''], it: ['\\\'d4\\\'']},
//   'path/t5.spec.js': { describe: ['\\\"s5\\\"'], it: ['\\\"d5\\\"']},
//   'path/t6.spec.js': { describe: ['s6', 's6.2', 's6.3', 's6.4', 's6.4.1'],
//      it: ['d6.1', 'd6.2', 'd6.3', 'd6.4.1']}
// }

// describe('Path finder tests', function() {
//   var pathFinder;

//   beforeAll(function() {

//     mock('fs', {
//       readFileSync: function(path, encoding) {
//         return testFileData[path];
//       }
//     });

//     mock('glob', {
//       sync: function(pattern) {
//         return Object.keys(testFileData);
//       }
//     });

//   });

//   describe('Parsing test files', function() {
//     describe('Test files with single test cases', function() {
//       it('Parsed test paths matched expected test paths', function() {
//         expect(lodash.isEqual(pathFinder.parseTestFiles(
//           '**/*.spec.ts', 'utf-8'), parsedTestFiles)).toBe(true);
//       });

//       it('1st test file match suite 1 and description 1', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t1.spec.js'];
//         expect(path.describe[0]).toBe('s1');
//         expect(path.it[0]).toBe('d1');
//       });

//       it('2sd test file match suite 2 and description 2', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t2.spec.js'];
//         expect(path.describe[0]).toBe('s2');
//         expect(path.it[0]).toBe('d2');
//       });

//       it('3rd test file match suite 3 and description 3.1 and 3.2', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t3.spec.js'];
//         expect(path.describe[0]).toBe('s3');
//         expect(path.it[0]).toBe('d3.1');
//         expect(path.it[1]).toBe('d3.2');
//       });

//       describe('Test cases with quoted text', function() {
//         it('4rd test file match suite and description with single quotes', function() {
//           var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//           var path = paths['path/t4.spec.js'];
//           expect(path.describe[0]).toBe('\\\'s4\\\'');
//           expect(path.it[0]).toBe('\\\'d4\\\'');
//         });

//         it('5th test file match suite and description with double quotes', function() {
//           var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//           var path = paths['path/t5.spec.js'];
//           expect(path.describe[0]).toBe('\\\"s5\\\"');
//           expect(path.it[0]).toBe('\\\"d5\\\"');
//         });
//       });
//     });

//     describe('Test files with multiple test cases', function() {
//       it('6th test file match suite 6 and description 6.1', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t6.spec.js'];
//         expect(path.describe[0]).toBe('s6');
//         expect(path.it[0]).toBe('d6.1');
//       });

//       it('6th test file match suite 6.2 and description 6.2 (sibling)', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t6.spec.js'];
//         expect(path.describe[1]).toBe('s6.2');
//         expect(path.it[1]).toBe('d6.2');
//       });

//       it('6th test file match suite 6.3 and description 6.3 (sibling)', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t6.spec.js'];
//         expect(path.describe[2]).toBe('s6.3');
//         expect(path.it[2]).toBe('d6.3');
//       });

//       it('6th test file match suite 6.4.1 and description 6.4.1 (nested)', function() {
//         var paths = pathFinder.parseTestFiles('**/*.spec.ts', 'utf-8');
//         var path = paths['path/t6.spec.js'];
//         expect(path.describe[4]).toBe('s6.4.1');
//         expect(path.it[3]).toBe('d6.4.1');
//       });
//     });
//   });

//   describe('Find test file path tests', function() {
//     it('Test file path not found', function() {
//         expect(pathFinder.testFile(parsedTestFiles, 's7', 'd7'))
//           .toBeUndefined();
//     });

//     it('Suite 1 and description 1 found in test file 1', function() {
//       expect(pathFinder.testFile(parsedTestFiles, 's1', 'd1'))
//         .toBe('path/t1.spec.js');
//     });

//     it('Suite 2 and description 2 found in test file 2', function() {
//       expect(pathFinder.testFile(parsedTestFiles, 's2', 'd2'))
//         .toBe('path/t2.spec.js');
//     });

//     it('Suite 3 and description 3 found in test file 3.1', function() {
//       expect(pathFinder.testFile(parsedTestFiles, 's3', 'd3.1'))
//         .toBe('path/t3.spec.js');
//     });

//     it('Suite 3 and description 3 found in test file 3.2', function() {
//       expect(pathFinder.testFile(parsedTestFiles, 's3', 'd3.2'))
//         .toBe('path/t3.spec.js');
//     });

//     it('Suite 4 and description 4 found in test file 4', function() {
//       expect(pathFinder.testFile(parsedTestFiles, '\\\'s4\\\'', '\\\'d4\\\''))
//         .toBe('path/t4.spec.js');
//     });

//     it('Suite 5 and description 5 found in test file 5', function() {
//       expect(pathFinder.testFile(parsedTestFiles, '\\\"s5\\\"', '\\\"d5\\\"'))
//         .toBe('path/t5.spec.js');
//     });

//     it('Suite 6 and description 6 found in test file 6', function() {
//       expect(pathFinder.testFile(parsedTestFiles, 's6',  'd6.1')).toBe('path/t6.spec.js');
//       expect(pathFinder.testFile(parsedTestFiles, 's62', 'd6.2')).toBe('path/t6.spec.js');
//       expect(pathFinder.testFile(parsedTestFiles, 's63', 'd6.3')).toBe('path/t6.spec.js');
//       expect(pathFinder.testFile(parsedTestFiles, 's6.4.1text', 'd6.4.1text')).toBe('path/t6.spec.js');
//     });
//   });
// });
