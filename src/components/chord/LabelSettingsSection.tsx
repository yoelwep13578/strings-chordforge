import { LabelSettings } from '@/types/chord';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  settings: LabelSettings;
  onChange: (settings: LabelSettings) => void;
  globalContrastActive?: boolean;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <Label className="text-xs text-secondary-foreground shrink-0">{label}</Label>
    {children}
  </div>
);

export function LabelSettingsSection({ title, settings, onChange, globalContrastActive }: Props) {
  const update = (partial: Partial<LabelSettings>) => onChange({ ...settings, ...partial });

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-secondary-foreground py-1.5 hover:text-foreground transition-colors group">
        <span>{title}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2.5 pt-1 pb-2 pl-2 border-l border-border ml-1">
        <Field label="Font Size">
          <Input type="number" className="w-16 h-7 text-xs" min={0.5} max={20} step={0.1}
            value={settings.fontSize}
            onChange={(e) => update({ fontSize: parseFloat(e.target.value) || 2.5 })} />
        </Field>
        <Field label="Full Contrast">
          {globalContrastActive ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Switch checked={true} disabled className="opacity-50" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Contrast applied globally</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Switch checked={settings.fullContrast}
              onCheckedChange={(v) => update({ fullContrast: v })} />
          )}
        </Field>
        <Field label="Height Offset">
          <Input type="number" className="w-16 h-7 text-xs" min={-20} max={20} step={0.5}
            value={settings.heightOffset}
            onChange={(e) => update({ heightOffset: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Width Offset">
          <Input type="number" className="w-16 h-7 text-xs" min={-20} max={20} step={0.5}
            value={settings.widthOffset}
            onChange={(e) => update({ widthOffset: parseFloat(e.target.value) || 0 })} />
        </Field>
        <Field label="Rotate with Chart">
          <Switch checked={settings.rotateWithChart}
            onCheckedChange={(v) => update({ rotateWithChart: v })} />
        </Field>
        <Field label="Use System Font">
          <Switch checked={settings.useSystemFont}
            onCheckedChange={(v) => update({ useSystemFont: v })} />
        </Field>
        {settings.useSystemFont && (
          <Field label="Font Name">
            <Input className="w-28 h-7 text-xs" placeholder="Arial, Helvetica..."
              value={settings.systemFontName}
              onChange={(e) => update({ systemFontName: e.target.value })} />
          </Field>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
