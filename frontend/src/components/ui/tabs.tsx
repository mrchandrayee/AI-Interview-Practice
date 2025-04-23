import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  tabsClassName?: string;
  panelClassName?: string;
}

export function Tabs({
  items,
  defaultIndex = 0,
  onChange,
  variant = 'default',
  className,
  tabsClassName,
  panelClassName,
}: TabsProps) {
  const variantStyles = {
    default: {
      list: 'flex space-x-1 rounded-xl bg-muted/20 p-1',
      tab: 'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
      selected: 'bg-white text-primary shadow dark:bg-gray-800',
      notSelected: 'text-muted-foreground hover:bg-white/[0.12] hover:text-foreground',
    },
    pills: {
      list: 'flex space-x-2',
      tab: 'rounded-full px-4 py-2 text-sm font-medium',
      selected: 'bg-primary text-primary-foreground',
      notSelected: 'text-muted-foreground hover:text-foreground',
    },
    underline: {
      list: 'flex space-x-8 border-b',
      tab: 'border-b-2 border-transparent py-2 text-sm font-medium',
      selected: 'border-primary text-primary',
      notSelected: 'text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground',
    },
  };

  return (
    <div className={className}>
      <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
        <Tab.List className={cn(variantStyles[variant].list, tabsClassName)}>
          {items.map((item) => (
            <Tab
              key={item.id}
              disabled={item.disabled}
              className={({ selected }) =>
                cn(
                  variantStyles[variant].tab,
                  'ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                  selected
                    ? variantStyles[variant].selected
                    : variantStyles[variant].notSelected
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={cn('mt-4', panelClassName)}>
          {items.map((item) => (
            <Tab.Panel
              key={item.id}
              className={cn(
                'ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
            >
              {item.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

// Example usage:
/*
const tabs = [
  {
    id: 'upcoming',
    label: 'Upcoming',
    icon: <CalendarIcon />,
    content: <UpcomingInterviews />
  },
  {
    id: 'history',
    label: 'History',
    icon: <ClockIcon />,
    content: <InterviewHistory />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <CogIcon />,
    content: <Settings />
  }
];

<Tabs
  items={tabs}
  variant="pills"
  onChange={(index) => console.log('Changed to tab:', index)}
/>
*/