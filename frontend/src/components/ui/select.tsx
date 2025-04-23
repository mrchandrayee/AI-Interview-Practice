import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled,
  className,
  containerClassName,
}: SelectProps) {
  return (
    <div className={cn('relative space-y-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Listbox.Button
              className={cn(
                'relative w-full cursor-default rounded-md border bg-transparent px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-error focus:ring-error'
                  : 'border-input hover:border-primary',
                className
              )}
            >
              <span className="block truncate">
                {value ? value.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                    className={({ active, disabled }) =>
                      cn(
                        'relative cursor-default select-none px-3 py-2',
                        active && 'bg-accent text-accent-foreground',
                        disabled && 'opacity-50 cursor-not-allowed'
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center">
                        {option.icon && (
                          <span className="mr-2 flex-shrink-0">{option.icon}</span>
                        )}
                        
                        <div className="flex-1 truncate">
                          <span
                            className={cn(
                              'block truncate',
                              selected && 'font-medium'
                            )}
                          >
                            {option.label}
                          </span>
                          
                          {option.description && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          )}
                        </div>

                        {selected && (
                          <span
                            className={cn(
                              'ml-3 flex-shrink-0',
                              active ? 'text-accent-foreground' : 'text-primary'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
}

// Example usage:
/*
const options = [
  { value: 'peer', label: 'Peer Interview', description: 'Practice with a peer-level interviewer' },
  { value: 'manager', label: 'Manager Interview', description: 'Practice with a senior manager' },
  { value: 'expert', label: 'Expert Interview', description: 'Practice with an industry expert' },
];

const [selected, setSelected] = useState<SelectOption | null>(null);

<Select
  label="Interview Type"
  options={options}
  value={selected}
  onChange={setSelected}
  placeholder="Choose interview type"
/>
*/