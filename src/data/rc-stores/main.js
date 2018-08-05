import { observable, computed, action } from "mobx";

export class MainStore {
  @observable loginUser = null;

  @action.bound
  setLoginUser(user) {
    this.loginUser = user;
  }
}