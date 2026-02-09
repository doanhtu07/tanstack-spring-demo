import { cn } from '@/utils/tailwind-merge'

export const Divider = () => {
  return (
    <div
      className={cn(
        'cv-dark:border-gray-500 w-full rounded border border-gray-300',
      )}
    />
  )
}
