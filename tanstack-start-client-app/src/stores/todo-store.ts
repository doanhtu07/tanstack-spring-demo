import { makeAutoObservable } from 'mobx'
import type { QueryClient } from '@tanstack/react-query'
import {
  deleteTodoRemove,
  getGetTodoListQueryKey,
  postTodoAdd,
  putTodoUpdate,
} from '@/orval/todo-controller'

export class TodoStore {
  constructor() {
    makeAutoObservable(this)
  }

  // MARK: Actions

  public async addTodo(input: {
    queryClient: QueryClient
    description: string
  }) {
    try {
      const newTodo = await postTodoAdd({ description: input.description })

      await input.queryClient.invalidateQueries({
        queryKey: getGetTodoListQueryKey(),
      })

      return newTodo
    } catch (err) {
      console.error('TodoStore addTodo - error', err)
      throw err
    }
  }

  public async removeTodo(input: { queryClient: QueryClient; id: string }) {
    try {
      await deleteTodoRemove({ id: input.id })

      await input.queryClient.invalidateQueries({
        queryKey: getGetTodoListQueryKey(),
      })
    } catch (err) {
      console.error('TodoStore removeTodo - error', err)
      throw err
    }
  }

  public async updateTodo(input: {
    queryClient: QueryClient
    id: string
    description: string
    completed: boolean
  }) {
    try {
      const updatedTodo = await putTodoUpdate({
        id: input.id,
        description: input.description,
        completed: input.completed,
      })

      await input.queryClient.invalidateQueries({
        queryKey: getGetTodoListQueryKey(),
      })

      return updatedTodo
    } catch (err) {
      console.error('TodoStore updateTodo - error', err)
      throw err
    }
  }
}
