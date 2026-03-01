import { makeAutoObservable } from 'mobx'

export class CounterStore {
  private _count = 0

  constructor() {
    makeAutoObservable(this)
  }

  // MARK: Actions

  public increment() {
    this.setCount(this.count + 1)
  }

  public decrement() {
    this.setCount(this.count - 1)
  }

  // MARK: Getters and Setters

  public get count() {
    return this._count
  }

  private setCount(count: number) {
    this._count = count
  }
}
