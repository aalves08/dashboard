let lastCount = {};

function parseStoreContent(store, compare, clearEmptyOnComparison) {
  const currCount = {};
  const comparison = {};

  Object.keys(store).forEach((mainKey) => {
    if (store[mainKey] && typeof store[mainKey] === 'object' && !Array.isArray(store[mainKey])) {
      // iterate again... (this will gather other arrays, such as queue, which is very important!!!!)
      Object.keys(store[mainKey]).forEach((storeModuleKey) => {
        if (store[mainKey][storeModuleKey] && typeof store[mainKey][storeModuleKey] === 'object' && Array.isArray(store[mainKey][storeModuleKey])) {
          currCount[`${ mainKey }-${ storeModuleKey }`] = store[mainKey][storeModuleKey].length;
        }

        // gather info about "types" list lengths
        if (store[mainKey].types && Object.keys(store[mainKey].types).length > 0) {
          Object.keys(store[mainKey].types).forEach((listKey) => {
            if (store[mainKey].types[listKey].list && store[mainKey].types[listKey].list.length) {
              currCount[`${ mainKey }-types-${ listKey }`] = store[mainKey].types[listKey].list.length;
            }
          });
        }
      });
    } else if (store[mainKey] && typeof store[mainKey] === 'object' && Array.isArray(store[mainKey])) {
      // other arrays on the main store, if they exist
      currCount[`${ mainKey }`] = store[mainKey].length;
    }
  });

  // if it's a comparison with the old count, return only the comparison
  if (compare) {
    Object.keys(currCount).forEach((key) => {
      if (lastCount[key]) {
        const count = currCount[key] - lastCount[key];

        if (!clearEmptyOnComparison || (clearEmptyOnComparison && count !== 0)) {
          comparison[key] = {
            variance:  count,
            currCount: currCount[key]
          };
        }
      } else if (!clearEmptyOnComparison) {
        comparison[key] = {
          variance:  currCount[key],
          currCount: currCount[key],
          new:       true
        };
      }
    });

    lastCount = Object.assign({}, currCount);

    return comparison;
  }

  lastCount = Object.assign({}, currCount);

  return currCount;
}

/* eslint-disable no-console */
export default (context) => {
  // console.log('STORE!!!!', context.store.state);
  // console.log('initial store counts', parseStoreContent(context.store.state));
  // setInterval(() => {
  //   const comparedData = parseStoreContent(context.store.state, true, true);

  //   window.comparison = Object.assign({}, comparedData);
  //   console.error('comparison', comparedData);
  // }, 30000);

  const logTypes = ['log', 'error', 'info', 'warn'];
  const MAX_LOGS_STORED = 400;

  console.logLog = console.log.bind(console);
  console.errorLog = console.error.bind(console);
  console.infoLog = console.info.bind(console);
  console.warnLog = console.warn.bind(console);
  console.logs = [];

  logTypes.forEach((type) => {
    console[type] = function() {
      const dataLogged = {
        type,
        dateTimeUtc: new Date().toUTCString(),
        timestamp:   Date.now(),
        data:        Array.from(arguments)
      };

      if (console.logs.length >= MAX_LOGS_STORED) {
        console.logs.shift();
      }

      console.logs.push(dataLogged);
      console[`${ type }Log`].apply(console, arguments);
    };
  });
};
