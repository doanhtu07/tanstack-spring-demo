import { makeAutoObservable, toJS } from 'mobx'

export class CounterStore {
  // MARK: Properties

  private _count = 0

  // MARK: Constructor

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
    return toJS(this._count)
  }

  private setCount(count: number) {
    this._count = count
  }
}
