import { makeAutoObservable } from 'mobx'
import { postUpperCase } from '@/orval/demo-controller'

export class DemoApiStore {
  constructor() {
    makeAutoObservable(this)
  }

  // MARK: Actions

  public async testUpperCase() {
    try {
      const res = await postUpperCase({ text: 'Hello world' })
      console.log('testUpperCase', res.message)
    } catch (err) {
      console.error('DemoApiStore testUpperCase - error', err)
      throw err
    }
  }
}
