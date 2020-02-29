// 这个配置文件是babel项目级别的配置，目前有bug，暂时不用
module.exports = function babelConfig(api) {
  api.cache.using(() => process.env.NODE_ENV === 'development');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: 'commonjs',
          targets: {
            browsers: ['> 1%', 'ie > 9']
          },
          useBuiltIns: 'usage'
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }]
    ].concat(
      process.env.NODE_ENV === 'development' ? ['react-hot-loader/babel'] : []
    )
  };
};
