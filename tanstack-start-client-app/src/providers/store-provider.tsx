import { createContext, useContext, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { RootStore } from '@/stores/root-store'

type StoreProviderProps = PropsWithChildren

const StoreContext = createContext<RootStore>(new RootStore())

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(() => new RootStore())
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
