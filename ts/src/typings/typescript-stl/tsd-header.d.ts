// Type definitions for TypeScript-STL v0.9.10
// Project: https://github.com/samchon/stl
// Definitions by: Jeongho Nam <http://samchon.org>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// ------------------------------------------------------------------------------------
// In TypeScript, merging multiple 'ts' files to a module is not possible yet.
// Instead of using "import" instruction, use such trick: 
//
// <code>
// declare var global: any;
// declare var require: Function;
//
// global["std"] = require("typescript-stl");
// let list: std.List<number> = new std.List<number>();
// </code>
//
// Those declaration of global and require can be substituted by using "node.d.ts"
// ------------------------------------------------------------------------------------

