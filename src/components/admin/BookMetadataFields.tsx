import { bookFields, type BookMetadata } from '@/lib/bookAdministration';

export default function BookMetadataFields({ value, onChange }: { value: BookMetadata; onChange: (value: BookMetadata) => void }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {bookFields.map(([key, label]) => <label key={key} className="block text-xs text-muted-foreground font-medium">
      {label}
      <input aria-label={label} value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })}
        type={key === 'pages' || key === 'year' ? 'number' : 'text'} min={key === 'pages' ? 1 : undefined}
        className="mt-1 w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary" />
    </label>)}
  </div>;
}