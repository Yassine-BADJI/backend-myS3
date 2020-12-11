module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/env', '@babel/typescript'];
  const plugins = [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ];

  return {
    presets,
    plugins,
  };
};