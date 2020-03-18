import { useRef, useState, useEffect, useCallback } from 'react';

class Store {
  state = {};

  actions = {};

  modules = {};

  observers = [];

  constructor(opts = {}) {
    let { state = null, actions = {}, modules = {} } = opts;
    // state
    if (typeof state === 'function') state = state();
    this.state = state;
    // actions
    this.actions = { ...actions };
    // modules
    Object.keys(modules).forEach((key) => {
      this.modules[key] = new Store(modules[key]);
    });
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
  const dispatch = useCallback(
    (action, payload) => {
      store.dispatch(action, payload);
    },
    [store]
  );
  return { dispatch };
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
    let subscription = store.subscribe(observer.current);
    return () => {
      subscription.unsubscribe();
    };
  }, [store]);

  return state;
};

const useClean = () => {
  const cleanerList = useRef([]);
  // add cleaner
  const addCleaner = (cleaner, key = '') => {
    let list = cleanerList.current;
    if (!key) {
      let find = list.find((arr) => arr[0] === cleaner);
      if (!find) list.push([cleaner]);
    } else {
      let find = list.find((arr) => arr[1] === key);
      if (find) {
        find[0] = cleaner;
      } else {
        list.push([cleaner, key]);
      }
    }
    return function clean() {
      let idx = cleanerList.current.findIndex((arr) => arr[0] === cleaner);
      cleanerList.current.splice(idx, 1);
      cleaner();
    };
  };
  // call cleaner
  const callCleaner = (key) => {
    let list = cleanerList.current;
    let idx = list.findIndex((arr) => arr[1] === key);
    if (idx !== -1) {
      list.splice(idx, 1);
      return list[idx][0]();
    }
  }
  // clean
  useEffect(() => {
    cleanerList.current.forEach((arr) => {
      arr[0]();
    });
    cleanerList.current = null;
  }, []);

  return { addCleaner, callCleaner };
};

export { Store, useStore, useStoreState, useClean };
