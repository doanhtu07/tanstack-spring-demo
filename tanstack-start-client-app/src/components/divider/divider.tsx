import { cn } from '@/utils/tailwind-merge'

export const Divider = () => {
  return (
    <div
      className={cn(
        'w-full rounded border border-gray-300 dark:border-gray-500',
      )}
    />
  )
}
