import { Compiler } from 'atma-io-middleware-base'
import { inlineImports } from './modules/import'
import * as logger from 'atma-logger'



export default function process(content: string, file, compiler_: Compiler) {
    return inlineImports(content, file, compiler_);
}

const rgx_sourceStatement = /^[\t ]*\/\/#\[[ ]+(([^\s'"]+)|('|"([^'"]+))'|")[ \t]*$/gm;



export function map_parse(fileContent, filename) {

    rgx_sourceStatement.lastIndex = 0;

	if (rgx_sourceStatement.test(fileContent) === false)
		return null;

	var lines = fileContent.split(/\r\n|\n|\r/g),
		map = [];

	var imax = lines.length,
		i = 0,
		lineEnd,
		start,
		end;

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

export function map_getFileAt(map, line) {
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