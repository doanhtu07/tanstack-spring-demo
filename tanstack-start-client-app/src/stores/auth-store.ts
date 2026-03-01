import { makeAutoObservable } from 'mobx'
import type { QueryClient } from '@tanstack/react-query'
import {
  getGetCurrentUserQueryKey,
  postSignin,
  postSignout,
  postSignup,
} from '@/orval/auth-controller'

export class AuthStore {
  constructor() {
    makeAutoObservable(this)
  }

  // MARK: Actions

  public async signin(input: {
    queryClient: QueryClient
    email: string
    password: string
  }) {
    const { queryClient, email, password } = input

    try {
      await postSignin({ email, password })

      await queryClient.invalidateQueries({
        queryKey: getGetCurrentUserQueryKey(),
      })
    } catch (err) {
      console.error('AuthStore signin - error', err)
      throw err
    }
  }

  public async signup(input: {
    queryClient: QueryClient
    email: string
    password: string
  }) {
    const { queryClient, email, password } = input

    try {
      await postSignup({ email, password })

      await queryClient.invalidateQueries({
        queryKey: getGetCurrentUserQueryKey(),
      })
    } catch (err) {
      console.error('AuthStore signup - error', err)
      throw err
    }
  }

  public async signout(input: { queryClient: QueryClient }) {
    const { queryClient } = input

    try {
      await postSignout()

      await queryClient.invalidateQueries({
        queryKey: getGetCurrentUserQueryKey(),
      })
    } catch (err) {
      console.error('AuthStore signout - error', err)
      throw err
    }
  }
}
