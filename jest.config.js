module.exports =  {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy', // Mock styles
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js' // Mock assets
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Global setup
};
