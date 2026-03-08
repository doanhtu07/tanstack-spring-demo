import { createFileRoute } from '@tanstack/react-router'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import { useShape } from '@electric-sql/react'
import { useMemo } from 'react'
import type { TodoResponse } from '@/orval/openAPIDefinition.schemas'
import styles from '@/styles/app.module.css'
import { getTestId } from '@/utils/test-ids'
import { Navbar } from '@/features/navbar/navbar'
import { TodoItem } from '@/features/todo/todo-item/todo-item'
import { useStore } from '@/providers/store-provider'
import { CreateTodoButton } from '@/features/todo/create-todo-button/create-todo-button'
import {
  TodoResponseSchema,
  todoShapeStream,
} from '@/electric-shapes/todo-shape'

const TEST_ID_ROOT = 'app'

const RouteComponent = observer(() => {
  const { user } = Route.useRouteContext()
  const { todoStore } = useStore()
  const queryClient = useQueryClient()

  // const { data: todos } = useGetTodoList({
  //   query: {
  //     staleTime: 1000 * 60,
  //     retry: false,
  //     refetchOnWindowFocus: false,
  //   },
  // })

  const { data: rawTodos } = useShape(todoShapeStream)

  const todos = useMemo(() => {
    return rawTodos.map((rawTodo) => TodoResponseSchema.parse(rawTodo))
  }, [rawTodos])

  // MARK: Renderers

  const renderTodoItem = (todo: TodoResponse) => {
    return (
      <TodoItem
        key={todo.id}
        description={todo.description || ''}
        completed={todo.completed || false}
        onUpdate={async (data) => {
          await todoStore.updateTodo({
            queryClient,
            id: todo.id,
            completed: todo.completed,
            ...data,
          })
        }}
        onToggleComplete={async (completed) => {
          await todoStore.updateTodo({
            queryClient,
            id: todo.id,
            description: todo.description,
            completed,
          })
        }}
        onDelete={() => todoStore.removeTodo({ queryClient, id: todo.id })}
        {...getTestId([TEST_ID_ROOT, 'todoItem', todo.id.toString()])}
      />
    )
  }

  return (
    <main className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar user={user} hideApp {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      {todos.map((todo) => renderTodoItem(todo))}

      <CreateTodoButton
        onCreate={async (data) => {
          await todoStore.addTodo({ queryClient, ...data })
        }}
        {...getTestId([TEST_ID_ROOT, 'createButton'])}
      />
    </main>
  )
})

// MARK: Route

export const Route = createFileRoute('/_authenticated/app')({
  component: RouteComponent,
})
