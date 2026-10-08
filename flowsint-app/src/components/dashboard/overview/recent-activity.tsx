import { FileText, Network, Upload, UserPlus, CheckCircle } from 'lucide-react'

const activities = [
  {
    icon: FileText,
    text: 'Новый анализ добавлен в кампанию APT-29',
    time: '2 hours ago'
  },
  {
    icon: Network,
    text: 'Скетч обновлён в «Ransomware Incident»',
    time: '5 hours ago'
  },
  {
    icon: Upload,
    text: 'Доказательства загружены в дело «Data Breach»',
    time: 'Yesterday'
  },
  {
    icon: UserPlus,
    text: 'Sarah Kim присоединилась к расследованию «Phishing Investigation»',
    time: '2 days ago'
  },
  {
    icon: CheckCircle,
    text: 'Расследование фишинга Q4 закрыто',
    time: '3 days ago'
  },
  {
    icon: FileText,
    text: 'Черновик анализа сохранён в «Insider Threat»',
    time: '4 days ago'
  }
]

export function RecentActivity() {
  return (
    <div>
      <h2 className="text-sm font-medium text-foreground mb-4">Недавняя активность</h2>
      <div className="space-y-1">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="p-1.5 rounded bg-muted/50 mt-0.5">
              <activity.icon className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{activity.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        Вся активность
      </button>
    </div>
  )
}
