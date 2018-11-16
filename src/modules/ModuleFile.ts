import { u_makeIndent, u_getNewLine } from '../utils'
import { Dictionary } from './Dictionary';
import { Compiler } from 'atma-io-middleware-base';
import { String } from './String';
import { File } from '../types/File'


export class ModuleFile {
    id: string
    path: string
    outer = new Dictionary<ModuleFile>()
    scoped = new Dictionary<ModuleFile>()

    imports: ImportNode[] = []
    exports: ExportNode[] = []
    scopeLess: boolean

    constructor (public content: string, public file: File, public compiler: Compiler) {
        this.id = file.uri.toLocalFile();
        this.path = file.uri.toRelativeString(compiler.io.env.currentDir);
    }

    
    hasDeep (x: ModuleFile, ignore?: ModuleFile, hash: Dictionary<ModuleFile> = new Dictionary<ModuleFile>()) {
        function check (arr: ModuleFile[]) {
            for (let i = 0; i < arr.length; i++) {
                let module = arr[i];
                if (module == ignore || hash.has(module)) {
                    continue;
                }
                hash.add(module);
    
                let has = module.hasDeep(x, ignore, hash);
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
    }

    toScript (indent?: string): string {
        let newLine = u_getNewLine(this.content, this.compiler.io);
        let outerContent = this
            .outer
            .arr
            .map(x => x.toScript())
            .map(x => x.replace(/[\s]*$/, ''))
            .join(newLine);
        
        let scopedContent = this
            .scoped
            .arr
            .map(x => x.toScript())
            .map(x => x.replace(/[\s]*$/, ''))
            .join(newLine);
        

        let content = this.content;

        
        // normalize exports
        this.exports.reverse().forEach(x => {
            switch (x.type) {
                case 'const': 
                    content = String.replace(content, x.position, x.length, x.ref);
                    break;
                case 'function': 
                    content = String.replace(content, x.position, x.length, `${x.ref} = function `);
                    break;
            }
        });
        // remove imports
        this.imports.reverse().forEach(x => {
            content = String.replace(content, x.position, x.length, '');
        });
        
        let externalRefs = '';
        if (this.exports.length > 0) {
            externalRefs = this.exports.reverse().map(x => `    ${x.ref}`).join(`,${newLine}`);
            externalRefs = String.replace(externalRefs, 0, 3, 'var');
            externalRefs += ';';
        }
    
        let indentScopedContent = `${u_makeIndent(scopedContent || '', '    ', this.compiler.io)}`;
        let indentContent = `${u_makeIndent(content, '    ', this.compiler.io)}`
        
        content = [
            `${outerContent}` || '',
            `${externalRefs}` || '',
            !this.scopeLess && (indentScopedContent || indentContent) ? `(function(){` : '',
            indentScopedContent,
            indentContent,
            !this.scopeLess && (indentScopedContent || indentContent) ? `}());` : ''
        ]
        .filter(x => !!x)
        .join(newLine);

        return u_makeIndent(content, indent, this.compiler.io);
    }
}
export class ImportNode {
    position: number
    length: number
    str: string
    path: string
    refs: string[]
    type: 'full' | 'refs'
    scopeLess: boolean
    module: ModuleFile
    exportAll: boolean;
}
export class ExportNode {
    position: number
    length: number
    str: string
    ref: string
    type: 'const' | 'function'
}
