import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

type KurioSelectProps = {
  id?: string
  name?: string
  'aria-label'?: string
  placeholder?: string
  options: { value: string; label: string }[]
  defaultValue?: string
  required?: boolean
  className?: string
}

export function KurioSelect({
  id,
  name,
  placeholder,
  options,
  defaultValue,
  required,
  className = '',
  'aria-label': ariaLabel,
}: KurioSelectProps) {
  return (
    <Select name={name} defaultValue={defaultValue} required={required}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={`h-10! w-full min-w-0 rounded-[3px] border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] data-placeholder:text-[#B39463] focus-visible:border-[#D28A4C] focus-visible:ring-[#D28A4C]/30 [&_[data-slot=select-value]]:truncate [&_svg]:text-[#B39463] ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border border-[#3F2319] bg-[#241612] text-[#F5F1EB]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="focus:bg-[#3F2319] focus:text-[#F5F1EB]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
