import { makeAutoObservable } from 'mobx'
import {
  postMailHello,
  postMailHelloHtml,
  postUpperCase,
} from '@/orval/demo-controller'

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

  public async testMailHello() {
    try {
      const res = await postMailHello({ to: 'to@example.com' })
      console.log('testMailHello', res.message)
    } catch (err) {
      console.error('DemoApiStore testMailHello - error', err)
      throw err
    }
  }

  public async testMailHelloHtml() {
    try {
      const res = await postMailHelloHtml({
        to: 'to@example.com',
        name: 'Test User',
      })
      console.log('testMailHelloHtml', res.message)
    } catch (err) {
      console.error('DemoApiStore testMailHelloHtml - error', err)
      throw err
    }
  }
}
