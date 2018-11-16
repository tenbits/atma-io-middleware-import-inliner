export const TestHelper = {
	/*
	 * { path: content }
	 */
	registerFiles (io, Files, Proto?) {
		io.File.disableCache();
		Object.keys(Files).forEach(key => {
			var rgx = new RegExp(key, 'i');
			var Factory = io.File.getFactory();
			var content = Files[key];
			Factory.unregisterHandler(rgx);
			Factory.registerHandler(rgx, Class({
				Extends: Proto,
                filename: key,
                uri: new io.Uri('atma:///file/' + key),
				write (data) { content = data },
				exists () { return true },
				read () { return content }
			}));
		});
	},

	clearFiles (io, Files) {
		Object.keys(Files).forEach(key => {
			var rgx = new RegExp(key, 'i');
			var Factory = io.File.getFactory();
			Factory.unregisterHandler(rgx);
		});
	}
}