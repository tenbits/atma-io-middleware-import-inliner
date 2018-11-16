import { Compiler } from 'atma-io-middleware-base';
import { ImportNode, ExportNode, ModuleFile } from './ModuleFile';
import { File } from '../types/File'

let Rgx = {
    check: /^[ \t]*((import\s+(from|["']))|(export\s+(const|function|\*)))/m,
    Imports: {
        full: {
            rgx: /^[ \t]*import\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map (match: RegExpMatchArray) {
                let $import = new ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'full';
                $import.path = match[1];
                return $import;
            }
        },
        refs: {
            rgx: /^[ \t]*import\s*\{([^}]+)}\s*from\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map (match: RegExpMatchArray) {
                let $import = new ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'refs';
                $import.path = match[2];
                $import.refs = match[1].split(',').map(x => x.trim());
                return $import;
            }
        },
        exportAll: {
            rgx: /^[ \t]*export\s+\*\s+from\s*['"]([^'"]+)['"][\t ;]*[\r\n]{0,2}/gm,
            map (match: RegExpMatchArray) {
                let $import = new ImportNode();
                $import.position = match.index;
                $import.length = match[0].length;
                $import.type = 'full';
                $import.path = match[1];                
                $import.exportAll = true;                
                return $import;
            }
        },
    },
    Exports: {
        const: {
            rgx: /^[ \t]*export\s*const\s+([\w\d_$]+)/gm,
            map (match: RegExpMatchArray) {
                let $export = new ExportNode();
                $export.position = match.index;
                $export.length = match[0].length;
                $export.type = 'const';
                $export.ref = match[1];
                return $export;
            }
        },
        function: {
            rgx: /^[ \t]*export\s*function\s+([\w\d_$]+)/gm,
            map (match: RegExpMatchArray) {
                let $export = new ExportNode();
                $export.position = match.index;
                $export.length = match[0].length;
                $export.type = 'function';
                $export.ref = match[1];
                return $export;
            }
        }
    }
}

export class Parser {
    static supports (content: string) {
        return Rgx.check.test(content);
    }
    static parse (content: string, file: File, compiler: Compiler): ModuleFile {
        let module = new ModuleFile(content, file, compiler);
        if (Parser.supports(content) === false) {
            return module;
        }
        for (let key in Rgx.Imports) {
            let x = <{rgx: RegExp, map: (...args) => ImportNode}> Rgx.Imports[key];
            x.rgx.lastIndex = 0;            
            for (let match = x.rgx.exec(content); match != null; match = x.rgx.exec(content)) {
                module.imports.push(x.map(match, content))
            }
        }
        for (let key in Rgx.Exports) {
            let x = <{rgx: RegExp, map: (...args) => ExportNode}> Rgx.Exports[key];
            x.rgx.lastIndex = 0;
            for (let match = x.rgx.exec(content); match != null; match = x.rgx.exec(content)) {
                module.exports.push(x.map(match, content))
            }
        }

        module.imports.sort((a, b) => a.position < b.position ? -1 : 1);
        module.exports.sort((a, b) => a.position < b.position ? -1 : 1);
        return module;
    }
}

