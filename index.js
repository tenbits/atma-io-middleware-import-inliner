
				// source ./templates/RootModule.js
				(function(){
					
					var _src_importer = {};
var _src_modules_Dictionary = {};
var _src_modules_ModuleFile = {};
var _src_modules_Parser = {};
var _src_modules_String = {};
var _src_modules_import = {};
var _src_utils = {};

				// source ./templates/ModuleSimplified.js
				var _src_utils;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
function u_getNewLine(str, io) {
    var match = /(\r\n)|(\r)|(\n)/.exec(str);
    return (match && match[0]) || io.env.newLine;
}
exports.u_getNewLine = u_getNewLine;
;
function u_getIndent(str) {
    var match = /^[ \t]+/.exec(str);
    return match && match[0] || '';
}
exports.u_getIndent = u_getIndent;
;
function u_makeIndent(str, indent, io) {
    if (!indent || !str)
        return str;
    var newline = u_getNewLine(str, io);
    return str
        .split(newline)
        .map(function (line) { return indent + line; })
        .join(newline);
}
exports.u_makeIndent = u_makeIndent;
;
function u_getFilesFromPath(path, io) {
    var file = new io.File(path);
    if (file.exists() === false) {
        console.error('File not found', file.uri.toLocalFile());
        return [];
    }
    return [file];
}
exports.u_getFilesFromPath = u_getFilesFromPath;
;
function u_readFile(io, file, indent, insertFileName) {
    var content = file.read().toString();
    var newline = u_getNewLine(content, io);
    if (indent) {
        content = content
            .split(newline)
            .map(function (line) { return indent + line; })
            .join(newline);
    }
    if (insertFileName) {
        content = indent
            + '// source '
            + file.uri.file
            + newline
            + content;
    }
    return content;
}
exports.u_readFile = u_readFile;
;
function u_asString(str) {
    str = str
        .replace(/[\n\r]/g, '\\n')
        .replace(/"/g, '\\"');
    return "\"" + str + "\"";
}
exports.u_asString = u_asString;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils) && isObject(module.exports)) {
						Object.assign(_src_utils, module.exports);
						return;
					}
					_src_utils = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_modules_Dictionary;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.hash = {};
        this.arr = [];
    }
    Dictionary.prototype.add = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
        }
        for (var i = 0; i < arr.length; i++) {
            var x = arr[i];
            if (this.hash[x.id] != null) {
                continue;
            }
            this.hash[x.id] = x;
            this.arr.push(x);
        }
    };
    Dictionary.prototype.insert = function (x, i) {
        if (this.hash[x.id] != null) {
            this.remove(x);
        }
        this.hash[x.id] = x;
        this.arr.splice(i, 0, x);
    };
    Dictionary.prototype.has = function (x) {
        return this.hash[x.id] != null;
    };
    Dictionary.prototype.remove = function (x) {
        delete this.hash[x.id];
        var i = this.arr.findIndex(function (module) { return module.id === x.id; });
        this.arr.splice(i, 1);
    };
    Dictionary.prototype.removeByFn = function (fn) {
        for (var i = 0; i < this.arr.length; i++) {
            var x = this.arr[i];
            ///if (x.id.includes('e.')) debugger;
            if (fn(x)) {
                this.arr.splice(i, 1);
                delete this.hash[x.id];
                i--;
            }
        }
    };
    Dictionary.prototype.forEach = function (fn) {
        for (var i = 0; i < this.arr.length; i++) {
            var x = this.arr[i];
            fn(x);
        }
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_modules_Dictionary) && isObject(module.exports)) {
						Object.assign(_src_modules_Dictionary, module.exports);
						return;
					}
					_src_modules_Dictionary = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_modules_String;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var String;
(function (String) {
    function replace(str, i, length, ins) {
        if (ins === void 0) { ins = ''; }
        return str.substring(0, i) + ins + str.substring(i + length);
    }
    String.replace = replace;
})(String = exports.String || (exports.String = {}));
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_modules_String) && isObject(module.exports)) {
						Object.assign(_src_modules_String, module.exports);
						return;
					}
					_src_modules_String = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_modules_ModuleFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var utils_1 = _src_utils;
var Dictionary_1 = _src_modules_Dictionary;
var String_1 = _src_modules_String;
var ModuleFile = /** @class */ (function () {
    function ModuleFile(content, file, compiler) {
        this.content = content;
        this.file = file;
        this.compiler = compiler;
        this.outer = new Dictionary_1.Dictionary();
        this.scoped = new Dictionary_1.Dictionary();
        this.imports = [];
        this.exports = [];
        this.id = file.uri.toLocalFile();
        this.path = file.uri.toRelativeString(compiler.io.env.currentDir);
    }
    ModuleFile.prototype.hasDeep = function (x, ignore, hash) {
        if (hash === void 0) { hash = new Dictionary_1.Dictionary(); }
        function check(arr) {
            for (var i = 0; i < arr.length; i++) {
                var module = arr[i];
                if (module == ignore || hash.has(module)) {
                    continue;
                }
                hash.add(module);
                var has = module.hasDeep(x, ignore, hash);
                if (has) {
                    return true;
                }
            }
            return false;
        }
        if (this.id === x.id) {
            return true;
        }
        return check(this.outer.arr) || check(this.scoped.arr);
    };
    ModuleFile.prototype.toScript = function (indent) {
        var newLine = utils_1.u_getNewLine(this.content, this.compiler.io);
        var outerContent = this
            .outer
            .arr
            .map(function (x) { return x.toScript(); })
            .map(function (x) { return x.replace(/[\s]*$/, ''); })
            .join(newLine);
        var scopedContent = this
            .scoped
            .arr
            .map(function (x) { return x.toScript(); })
            .map(function (x) { return x.replace(/[\s]*$/, ''); })
            .join(newLine);
        var content = this.content;
        // normalize exports
        this.exports.reverse().forEach(function (x) {
            switch (x.type) {
                case 'const':
                    content = String_1.String.replace(content, x.position, x.length, x.ref);
                    break;
                case 'function':
                    content = String_1.String.replace(content, x.position, x.length, x.ref + " = function ");
                    break;
            }
        });
        // remove imports
        this.imports.reverse().forEach(function (x) {
            content = String_1.String.replace(content, x.position, x.length, '');
        });
        var externalRefs = '';
        if (this.exports.length > 0) {
            externalRefs = this.exports.reverse().map(function (x) { return "    " + x.ref; }).join("," + newLine);
            externalRefs = String_1.String.replace(externalRefs, 0, 3, 'var');
            externalRefs += ';';
        }
        var indentScopedContent = "" + utils_1.u_makeIndent(scopedContent || '', '    ', this.compiler.io);
        var indentContent = "" + utils_1.u_makeIndent(content, '    ', this.compiler.io);
        content = [
            "" + outerContent || '',
            "" + externalRefs || '',
            !this.scopeLess && (indentScopedContent || indentContent) ? "(function(){" : '',
            indentScopedContent,
            indentContent,
            !this.scopeLess && (indentScopedContent || indentContent) ? "}());" : ''
        ]
            .filter(function (x) { return !!x; })
            .join(newLine);
        return utils_1.u_makeIndent(content, indent, this.compiler.io);
    };
    return ModuleFile;
}());
exports.ModuleFile = ModuleFile;
var ImportNode = /** @class */ (function () {
    function ImportNode() {
    }
    return ImportNode;
}());
exports.ImportNode = ImportNode;
var ExportNode = /** @class */ (function () {
    function ExportNode() {
    }
    return ExportNode;
}());
exports.ExportNode = ExportNode;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_modules_ModuleFile) && isObject(module.exports)) {
						Object.assign(_src_modules_ModuleFile, module.exports);
						return;
					}
					_src_modules_ModuleFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_modules_Parser;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var ModuleFile_1 = _src_modules_ModuleFile;
var Rgx = {
    check: /^[ \t]*((import\s+(from|["']))|(export\s+(const|function|\*)))/m,
    Imports: {
        full: {
            rgx: /^[ \t]*import\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map: function (match) {
                var $import = new ModuleFile_1.ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'full';
                $import.path = match[1];
                return $import;
            }
        },
        refs: {
            rgx: /^[ \t]*import\s*\{([^}]+)}\s*from\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map: function (match) {
                var $import = new ModuleFile_1.ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'refs';
                $import.path = match[2];
                $import.refs = match[1].split(',').map(function (x) { return x.trim(); });
                return $import;
            }
        },
        exportAll: {
            rgx: /^[ \t]*export\s+\*\s+from\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map: function (match) {
                var $import = new ModuleFile_1.ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'full';
                $import.path = match[1];
                $import.exportAll = true;
                return $import;
            }
        }
    },
    Exports: {
        "const": {
            rgx: /^[ \t]*export\s*const\s+([\w\d_$]+)/gm,
            map: function (match) {
                var $export = new ModuleFile_1.ExportNode();
                $export.position = match.index;
                $export.length = match[0].length;
                $export.type = 'const';
                $export.ref = match[1];
                return $export;
            }
        },
        "function": {
            rgx: /^[ \t]*export\s*function\s+([\w\d_$]+)/gm,
            map: function (match) {
                var $export = new ModuleFile_1.ExportNode();
                $export.position = match.index;
                $export.length = match[0].length;
                $export.type = 'function';
                $export.ref = match[1];
                return $export;
            }
        }
    }
};
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.supports = function (content) {
        return Rgx.check.test(content);
    };
    Parser.parse = function (content, file, compiler) {
        var module = new ModuleFile_1.ModuleFile(content, file, compiler);
        if (Parser.supports(content) === false) {
            return module;
        }
        for (var key in Rgx.Imports) {
            var x = Rgx.Imports[key];
            x.rgx.lastIndex = 0;
            for (var match = x.rgx.exec(content); match != null; match = x.rgx.exec(content)) {
                module.imports.push(x.map(match, content));
            }
        }
        for (var key in Rgx.Exports) {
            var x = Rgx.Exports[key];
            x.rgx.lastIndex = 0;
            for (var match = x.rgx.exec(content); match != null; match = x.rgx.exec(content)) {
                module.exports.push(x.map(match, content));
            }
        }
        module.imports.sort(function (a, b) { return a.position < b.position ? -1 : 1; });
        module.exports.sort(function (a, b) { return a.position < b.position ? -1 : 1; });
        return module;
    };
    return Parser;
}());
exports.Parser = Parser;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_modules_Parser) && isObject(module.exports)) {
						Object.assign(_src_modules_Parser, module.exports);
						return;
					}
					_src_modules_Parser = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_modules_import;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var Parser_1 = _src_modules_Parser;
var compiler;
var cache = {};
var options = {
    withPathComments: true,
    extension: 'js'
};
function inlineImports(content, file, compiler_) {
    compiler = compiler_;
    cache = {};
    if (Parser_1.Parser.supports(content) === false) {
        return content;
    }
    var withPathComments = compiler.getOption('withPathComments');
    if (withPathComments == null) {
        withPathComments = true;
    }
    options.withPathComments = withPathComments;
    options.extension = compiler.getOption('extension');
    var root = processModule(file.uri.toLocalFile(), content, compiler_);
    return root.toScript();
}
exports.inlineImports = inlineImports;
function processModule(localFilePath, content, compiler_) {
    var root = parseFile(localFilePath, content, compiler_);
    flattern(root);
    distinct(root);
    moveExportAllImprotsToOuter(root);
    return root;
}
exports.processModule = processModule;
function parseFile(localFilePath, content, compiler_) {
    if (compiler_ != null) {
        compiler = compiler_;
    }
    if (localFilePath in cache) {
        return cache[localFilePath];
    }
    var file = new compiler.io.File(localFilePath);
    if (content == null) {
        if (file.exists() === false) {
            throw new Error("File not found " + localFilePath);
        }
        content = file.read({ skipHooks: true });
    }
    var module = cache[localFilePath] = Parser_1.Parser.parse(content, file, compiler);
    module.imports.forEach(function (x) {
        var path = x.path;
        if (/\.\w+$/.test(path) === false) {
            path += "." + options.extension;
        }
        var uri = path[0] === '/'
            ? new compiler.io.Uri(path)
            : file.uri.combine(path);
        x.module = parseFile(uri.toLocalFile());
        if (x.scopeLess) {
            x.module.scopeLess = true;
        }
    });
    return module;
}
exports.parseFile = parseFile;
function flattern(module) {
    module
        .imports
        .forEach(function (x) {
        flattern(x.module);
        module.scoped.add(x.module);
    });
}
exports.flattern = flattern;
function distinct(module, parents) {
    if (parents === void 0) { parents = []; }
    module.outer.removeByFn(function (x) {
        return parents.some(function (p) { return p.outer.has(x); });
    });
    module.outer.forEach(function (x) { return distinct(x, parents.concat([module])); });
    module.scoped.removeByFn(function (x) {
        var inOuter = parents.some(function (p) { return p.outer.has(x); });
        if (inOuter) {
            return true;
        }
        var inScope = parents.some(function (p) { return p.scoped.has(x); });
        if (inScope) {
            return true;
        }
        for (var i = parents.length - 1; i > -1; i--) {
            var p = parents[i];
            var hasDeep = p.hasDeep(x, module);
            if (hasDeep) {
                for (var i_1 = 0; i_1 < p.outer.arr.length; i_1++) {
                    var child = p.outer.arr[i_1];
                    if (child.hasDeep(x)) {
                        p.outer.insert(x, i_1);
                        return true;
                    }
                }
                for (var i_2 = 0; i_2 < p.scoped.arr.length; i_2++) {
                    var child = p.scoped.arr[i_2];
                    if (child.hasDeep(x)) {
                        p.scoped.insert(x, i_2);
                        return true;
                    }
                }
                throw new Error('O_o: Child not found');
                p.outer.add(x);
                return true;
            }
        }
        return false;
    });
    module.scoped.forEach(function (x) { return distinct(x, parents.concat([module])); });
}
exports.distinct = distinct;
function moveExportAllImprotsToOuter(module) {
    module
        .imports
        .filter(function (imp) { return imp.exportAll && module.scoped.has(imp.module); })
        .forEach(function (imp) {
        module.outer.add(imp.module);
        module.scoped.remove(imp.module);
    });
    module.scoped.forEach(moveExportAllImprotsToOuter);
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_modules_import) && isObject(module.exports)) {
						Object.assign(_src_modules_import, module.exports);
						return;
					}
					_src_modules_import = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_importer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
exports.__esModule = true;
var import_1 = _src_modules_import;
var logger = require("atma-logger");
function process(content, file, compiler_) {
    return import_1.inlineImports(content, file, compiler_);
}
exports["default"] = process;
var rgx_sourceStatement = /^[\t ]*\/\/#\[[ ]+(([^\s'"]+)|('|"([^'"]+))'|")[ \t]*$/gm;
function map_parse(fileContent, filename) {
    rgx_sourceStatement.lastIndex = 0;
    if (rgx_sourceStatement.test(fileContent) === false)
        return null;
    var lines = fileContent.split(/\r\n|\n|\r/g), map = [];
    var imax = lines.length, i = 0, lineEnd, start, end;
    for (; i < imax; i++) {
        if (rgx_sourceStatement.test(lines[i])) {
            start = end = i + 1;
            lineEnd = lines[i].replace('#[', '#]');
            while (++end < imax) {
                if (lines[end] === lineEnd) {
                    break;
                }
            }
            if (end === imax) {
                logger.error('<map:imports> Ending was not found', { ending: lineEnd });
                return null;
            }
            map.push({
                file: lines[i].replace(/[ \t]*\/\/#\[[ \t]*/g, ''),
                start: start,
                end: end - 1
            });
        }
    }
    return map;
}
exports.map_parse = map_parse;
function map_getFileAt(map, line) {
    if (map == null)
        return null;
    var file;
    for (var i = 0, x, imax = map.length; i < imax; i++) {
        x = map[i];
        if (x.start <= line && x.end >= line) {
            if (file == null) {
                file = x;
                continue;
            }
            if (x.start > file.start) {
                file = x;
            }
        }
    }
    return file;
}
exports.map_getFileAt = map_getFileAt;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_importer) && isObject(module.exports)) {
						Object.assign(_src_importer, module.exports);
						return;
					}
					_src_importer = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
"use strict";
var atma_io_middleware_base_1 = require("atma-io-middleware-base");
var importer_1 = _src_importer;
module.exports = atma_io_middleware_base_1.create({
    name: 'atma-io-middleware-import-inliner',
    textOnly: true,
    defaultOptions: {
        defaultExtension: 'js',
        withPathComments: true
    },
    process: importer_1["default"],
    utils: {
        map_getFileAt: importer_1.map_getFileAt,
        map_parse: importer_1.map_parse
    }
});

				
				}());
				// end:source ./templates/RootModule.js
				