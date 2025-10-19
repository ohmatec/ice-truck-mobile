module.exports = {
	preset: 'jest-expo',
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/jest.setup.js'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
		'\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
	}
};