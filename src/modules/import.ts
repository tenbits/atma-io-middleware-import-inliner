import * as io from 'atma-io'
import { Compiler } from 'atma-io-middleware-base'
import { Parser } from './Parser';
import { ModuleFile } from './ModuleFile';

let compiler: Compiler;
let cache: { [id: string]: ModuleFile } = {};
let options = {
    withPathComments: true,
    extension: 'js'
};


declare type File = InstanceType<typeof io.File>

export function inlineImports(content: string, file: File, compiler_: Compiler) {
    compiler = compiler_;
    cache = {};

    if (Parser.supports(content) === false) {
        return content;
    }
    
    let withPathComments = compiler.getOption('withPathComments');
    if (withPathComments == null) {
        withPathComments = true;
    }
    options.withPathComments = withPathComments;
    options.extension = compiler.getOption('extension');

    let root = processModule(file.uri.toLocalFile(), content, compiler_);
    return root.toScript();
}

export function processModule(localFilePath: string, content?: string, compiler_?: Compiler) {
    let root = parseFile(localFilePath, content, compiler_);
    flattern(root);
    distinct(root);
    return root;
}

export function parseFile (localFilePath: string, content?: string, compiler_?: Compiler): ModuleFile {
    if (compiler_ != null) {
        compiler = compiler_;
    }
    if (localFilePath in cache) {
        return cache[localFilePath];
    }
    let file = new compiler.io.File(localFilePath);        
    if (content == null) {
        if (file.exists() === false) {
            throw new Error(`File not found ${localFilePath}`);
        }
        content = file.read({ skipHooks: true });
    }
    
    let module = cache[localFilePath] = Parser.parse(content, file, compiler);


    module.imports.forEach(x => {
        let { path } = x;
        if (/\.\w+$/.test(path) === false) {
            path += `.${options.extension}`;
        }

        let uri = path[0] === '/' 
            ? new compiler.io.Uri(path) 
            : file.uri.combine(path);
        
        x.module = parseFile(uri.toLocalFile());
    });    
    return module;
}


export function flattern (module: ModuleFile) {
    module
        .imports
        .forEach(x => {
            
            flattern(x.module);
            module.scoped.add(x.module);
        });
}
export function distinct (module: ModuleFile, parents: ModuleFile[] = []) {
    module.outer.removeByFn(x => {
        return parents.some(p => p.outer.has(x));
    });
    module.outer.forEach(x => distinct(x, [ ...parents, module]));

    module.scoped.removeByFn(x => {
        let inOuter = parents.some(p => p.outer.has(x));
        if (inOuter) {
            return true;
        }
        let inScope = parents.some(p => p.scoped.has(x));
        if (inScope) {
            return true;
        }
        for (let i = parents.length - 1; i > -1; i--) {
            let p = parents[i];
            let hasDeep = p.hasDeep(x, module);
            if (hasDeep) {
                for (let i = 0; i < p.outer.arr.length; i++) {
                    let child = p.outer.arr[i];
                    if (child.hasDeep(x)) {
                        p.outer.insert(x, i);
                        return true;
                    }
                }
                for (let i = 0; i < p.scoped.arr.length; i++) {
                    let child = p.scoped.arr[i];
                    if (child.hasDeep(x)) {
                        p.scoped.insert(x, i);
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
    module.scoped.forEach(x => distinct(x, [ ...parents, module]));
}
