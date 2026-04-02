import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function MultiCheckboxGroup({ label, options, selected, onChange }) {
  const toggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value]

    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase">
        {label}
      </Label>

      <div className="space-y-2">
        {options.map(opt => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${label}-${opt}`}
              checked={selected.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <label htmlFor={`${label}-${opt}`} className="text-sm cursor-pointer">
              {opt}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function SelectGroup({ label, options, value = [], onChange }) {
  label = label.toUpperCase()
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold">
        {label}
      </Label>

      <Select
        value={value[0] || ""}
        onValueChange={(val) => onChange([val])} // ✅ bungkus balik jadi array
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => {
            const label = (opt === 'true' || opt === true) ? 'Ya' : 'Tidak';

            return (
              <SelectItem key={String(opt)} value={String(opt)}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function FilterPanel({
  filters,
  setFilters,
  resetFilters,
  filterOptions,
  close,
}) {
  const setFilter = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const activeCount = Object.values(filters).reduce((acc, val) => {
    if (Array.isArray(val)) return acc + val.length
    if (val) return acc + 1
    return acc
  }, 0)


  return (
    <div className="p-4 space-y-6">

      <div className="grid grid-cols-2 gap-4">
        <SelectGroup
          label="jartup"
          options={filterOptions.isJartup}
          value={filters.isJartup}
          onChange={(val) => setFilter("isJartup", val)}
        />

        <SelectGroup
          label="jartaplok"
          options={filterOptions.isJartaplok}
          value={filters.isJartaplok}
          onChange={(val) => setFilter("isJartaplok", val)}
        />

        <SelectGroup
          label="tg customer"
          options={filterOptions.isCustomer}
          value={filters.isCustomer}
          onChange={(val) => setFilter("isCustomer", val)}
        />

      </div>

      <Separator />

      <MultiCheckboxGroup
        label="scale"
        options={filterOptions.scale}
        selected={filters.scale}
        onChange={(val) => setFilter('scale', val)}
      />

      <Separator />

      <MultiCheckboxGroup
        label="size"
        options={filterOptions.size}
        selected={filters.size}
        onChange={(val) => setFilter('size', val)}
      />

      <Separator />

      <MultiCheckboxGroup
        label="area"
        options={filterOptions.area}
        selected={filters.area}
        onChange={(val) => setFilter('area', val)}
      />

      <Separator />

      <MultiCheckboxGroup
        label="risk"
        options={filterOptions.risk}
        selected={filters.risk}
        onChange={(val) => setFilter('risk', val)}
      />

      <Separator />

      <MultiCheckboxGroup
        label="quality"
        options={filterOptions.quality}
        selected={filters.quality}
        onChange={(val) => setFilter('quality', val)}
      />

      <Separator />

      <div className="flex justify-between">
        <span className="text-xs">
          {activeCount > 0 ? `${activeCount} aktif` : 'Kosong'}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={activeCount === 0}
          >
            Reset
          </Button>
          <Button onClick={close}>
            Terapkan
          </Button>
        </div>
      </div>

    </div>
  )
}