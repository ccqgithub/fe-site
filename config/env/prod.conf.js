module.exports = (envArgs) => {
  return {
    // define constants
    define: {
      API_BASEURL: JSON.stringify(`https://api.${envArgs.appEnv}.prod.com/`)
    }
  };
};
