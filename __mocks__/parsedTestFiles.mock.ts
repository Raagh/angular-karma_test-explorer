export const mock = {
  "path/t1.spec.js": { describe: ["s1"], it: ["d1"] },
  "path/path2/path3/t1.spec.js": { describe: ["s1"], it: ["d1"] },
  "path/t2.spec.js": { describe: ["s2"], it: ["d2"] },
  "path/t3.spec.js": { describe: ["s3"], it: ["d3.1", "d3.2"] },
  "path/t4.spec.js": { describe: ["\\'s4\\'"], it: ["\\'d4\\'"] },
  "path/t5.spec.js": { describe: ['\\"s5\\"'], it: ['\\"d5\\"'] },
  "path/t6.spec.js": { describe: ["s6", "s6.2", "s6.3", "s6.4", "s6.4.1"], it: ["d6.1", "d6.2", "d6.3", "d6.4.1"] },
};
