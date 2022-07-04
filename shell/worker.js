// self.addEventListener('message', (e) => {
//   console.log('*** worker received message ***', e.data);

//   self.postMessage(e.data.toUpperCase());
// });

import * as Comlink from 'comlink';
const fns = {
  toUpperCase(msg) {
    return msg.toUpperCase();
  },
  performExpensiveOp(pods) {
    console.log('EXPENSIVE OP!');
    let sum = 0;

    pods.forEach((pod) => {
      if (pod.status.containerStatuses) {
        sum += pod.status?.containerStatuses[0].restartCount || 0;
      }
    });

    return sum;
  }
};

Comlink.expose(fns);
