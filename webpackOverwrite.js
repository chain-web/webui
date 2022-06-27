const { readFileSync, writeFileSync } = require('fs');

const addWebpackFallback = () => {
  const configFilePath =
    './node_modules/react-scripts/config/webpack.config.js';
  const configFile = readFileSync(configFilePath).toString();
  console.log('sk webui overwrite at: ', configFile.match(/resolve: \{/g));
  let overWeiteFile = configFile.replace(
    /resolve: \{/,
    `resolve: {
      // sk webui overwrite 
      fallback: {
        path: require.resolve('path-browserify'),
      },
    `,
  );
  writeFileSync(configFilePath, overWeiteFile);
};

addWebpackFallback();
