import { AuthStore } from './auth-store'
import { CounterStore } from './counter-store'
import { DemoApiStore } from './demo-api-store'

export class RootStore {
  public counterStore = new CounterStore()
  public demoApiStore = new DemoApiStore()
  public authStore = new AuthStore()
}
