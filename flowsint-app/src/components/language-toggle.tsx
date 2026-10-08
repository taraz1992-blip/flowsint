import { Check, Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import i18n, { availableLanguages, changeLanguage, t } from '@/i18n'

export function LanguageToggle() {
  const current = i18n.resolvedLanguage

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="ghost" className="h-6" size="icon">
            <Languages className="h-[1.2rem] w-[1.2rem] opacity-60" />
            <span className="sr-only">{t('Change language')}</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map(({ code, name }) => (
          <DropdownMenuItem
            key={code}
            className="justify-between gap-4"
            onClick={() => code !== current && changeLanguage(code)}
          >
            {name}
            {code === current && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
