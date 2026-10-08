import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ location }) => {
    requireAuth(location.href)
  },
  component: AuthLayout,
  errorComponent: ErrorComponent
})

function AuthLayout() {
  return <Outlet />
}

function ErrorComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Что-то пошло не так</CardTitle>
          <CardDescription>
            Произошла непредвиденная ошибка. Попробуйте ещё раз или перейдите в безопасное место.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-2">
          <Link to="/dashboard">
            <Button className="flex-1">
              <Home className="mr-2 h-4 w-4" />
              Перейти на панель
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
