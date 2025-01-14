module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ["@babel/plugin-syntax-bigint",
    ...(process.env.NODE_ENV === 'production'
      ? [
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'],
          },
        ],
      ]
      : []),
  ],
};
