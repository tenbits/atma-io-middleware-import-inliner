module.exports = {
	suites: {
		node: {
			exec: 'node',
            tests: 'test/**.test',
            env: [
                'test/TestHelper.ts'
            ]
		}
	}
}