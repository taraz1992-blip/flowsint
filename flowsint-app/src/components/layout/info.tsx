import { memo } from 'react'
import { HelpCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Trans } from 'react-i18next'
import { t } from '@/i18n'

const bold = { b: <strong /> }

const InfoDialog = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
              <HelpCircle className="h-3 w-3 opacity-60" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <div className="p-2">
            <div className="p-2 text-sm space-y-4 overflow-y-auto max-h-[80vh]">
              <h2 className="text-base font-semibold flex items-center gap-2">
                {t('About Flowsint')}
              </h2>
              <p>
                <Trans
                  i18nKey={
                    '<b>Flowsint</b> is an <b>investigation and intelligence platform</b> built to support complex research workflows involving <b>people, organizations, infrastructure, and online activity</b>.'
                  }
                  components={bold}
                />
              </p>

              <p>
                <Trans
                  i18nKey={
                    "Whether you're conducting <b>cyber investigations</b>, mapping out <b>fraud networks</b>, or gathering intelligence for <b>threat assessments</b>, Flowsint helps you collect, visualize, and understand fragmented data points in a structured and interactive way."
                  }
                  components={bold}
                />
              </p>

              <h3 className="font-semibold">{t('What Flowsint Does')}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <Trans
                    i18nKey={
                      '<b>Connects scattered data</b> — emails, domains, social accounts, IPs, phone numbers, addresses, and more — into a single <b>investigative graph</b>.'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      'Offers <b>visual enrichers</b> to pivot from one entity to related ones: find <b>connected individuals</b>, discover <b>infrastructure</b>, uncover <b>aliases</b>.'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      '<b>Tracks and saves investigation states</b> over time, letting you explore multiple hypotheses or revisit older threads without losing context.'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      'Supports <b>live data enrichment</b> from custom or built-in enrichers, giving you <b>actionable insights</b> as you explore.'
                    }
                    components={bold}
                  />
                </li>
              </ul>

              <h3 className="font-semibold">{t('Why Use Flowsint?')}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <Trans
                    i18nKey={
                      'Built for <b>speed and clarity</b> — fast graph rendering, clean UI, responsive enrichers.'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      '<b>Flexible graph model</b> that mirrors how investigators think — not just tables and tags, but <b>relationships</b>.'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      'Ideal for <b>solo analysts and teams</b> that need to move fast, explore freely, and make sense of <b>partial or messy data</b>.'
                    }
                    components={bold}
                  />
                </li>
              </ul>

              <h3 className="font-semibold">{t('Use Cases')}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <Trans
                    i18nKey={
                      'Mapping <b>digital infrastructure</b> of individuals or organizations'
                    }
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={'Investigating <b>online fraud schemes</b> or <b>fake identities</b>'}
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={'Uncovering <b>links between actors</b> across platforms'}
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={'Visualizing the reach of <b>leaked or exposed data</b>'}
                    components={bold}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey={
                      'Tracking <b>threat actor behavior</b> across social and technical surfaces'
                    }
                    components={bold}
                  />
                </li>
              </ul>

              <p>
                <Trans
                  i18nKey={
                    "Flowsint is designed for <b>professionals</b> who need <b>full control</b> over their investigation logic, from how data is structured to how relationships are interpreted. It's not just a tool — it's a <b>flexible workspace</b> for building intelligence."
                  }
                  components={bold}
                />
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(InfoDialog)
