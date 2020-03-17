import { useRef, useState, useEffect, useCallback } from 'react';

class Store {
  state = {};

  actions = {};

  modules = {};

  observers = [];

  constructor(state = {}) {
    this.state = state;
  }

  action(key, fn) {
    this.actions[key] = fn;
  }

  module(key, mod) {
    if (!(mod instanceof Store)) {
      throw new Error(`the mode <${key}> is not a store!`);
    }
    this.modules[key] = mod;
  }

  getState() {
    let moduleStates = {};
    Object.keys(this.modules).forEach((key) => {
      moduleStates[key] = this.modules[key].getState();
    });
    return { ...this.state, ...moduleStates };
  }

  dispatch(action, payload) {
    let arr = action.split('/');
    if (arr.length > 1) {
      let mod = this.modules[arr[0]];
      mod.dispatch(arr.slice(1).join('/'), payload);
    } else {
      this.state = this.actions[arr[0]](payload, this.state);
    }
    this.observers.forEach((observer) => {
      observer();
    });
  }

  subscribe(observer) {
    let index = this.observers.indexOf(observer);
    if (index === -1) {
      this.observers.push(observer);
    }
    return {
      unsubscribe: () => {
        let idx = this.observers.indexOf(observer);
        this.observers.splice(idx, 1);
      }
    };
  }
}

const useStore = (store) => {
  return useCallback(
    (action, payload) => {
      store.dispatch(action, payload);
    },
    [store]
  );
};

const useStoreState = (store, selector) => {
  // component state
  let [state, setState] = useState(() => {
    return selector(store.getState());
  });
  // observe actions
  let observer = useRef(() => {
    setState(selector(store.getState()));
  });
  useEffect(() => {
    let subscription = store.subscribe(observer);
    return () => {
      subscription.unsubscribe();
    };
  }, [store]);

  return state;
};

export { Store, useStore, useStoreState };
