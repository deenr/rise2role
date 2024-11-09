import { cn } from '@/lib/utils';
import { KanbanCategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const KANBAN_CATEGORIES = {
  interested: { label: 'Interested', backgroundColor: 'bg-gray-500' },
  applied: { label: 'Applied', backgroundColor: 'bg-blue-500' },
  interview: { label: 'Interview', backgroundColor: 'bg-fuchsia-500' },
  decision: { label: 'Decision', backgroundColor: 'bg-amber-500' }
} as const;

const DECISION_STATUSES = {
  decision: { label: 'Received Offer', backgroundColor: 'bg-amber-500' },
  accepted: { label: 'Accepted', backgroundColor: 'bg-green-500' },
  denied: { label: 'Denied', backgroundColor: 'bg-red-500' }
};

const jobApplicationSchema = z.object({
  role: z.string().min(1, 'Job title is required'),
  company: z.array(z.string()),
  location: z.array(z.string()),
  skills: z.array(z.string()).min(1, 'At least one skill is required').max(3, 'Maximum 3 skills are allowed'),
  category: z.enum(['interested', 'applied', 'interview', 'decision', 'accepted', 'denied']),
  status: z.string().optional(),
  percentage: z.number().min(0).max(100).optional()
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const WORK_MODELS = ['On-site', 'Remote', 'Hybrid'] as const;
type WorkModel = (typeof WORK_MODELS)[number];

interface JobApplicationDialogProps {
  category: KanbanCategory;
  children: JSX.Element;
}

export function JobApplicationDialog({ category, children }: JobApplicationDialogProps) {
  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema)
  });

  React.useEffect(() => {
    form.setValue('category', category);
  }, [category]);

  const handleWorkModelChange = React.useCallback(
    (model: WorkModel, checked: boolean) => {
      const currentLocations = form.getValues('location');
      form.setValue('location', checked ? [...currentLocations, model] : currentLocations.filter((loc) => loc !== model));
    },
    [form]
  );

  const onSubmit = (data: JobApplicationFormData) => {
    console.log(data);
    // TODO: Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Job Application</DialogTitle>
              <DialogDescription>Add a new job application to track.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('status', undefined);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(KANBAN_CATEGORIES).map(([value, { label, backgroundColor }]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex flex-row items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${backgroundColor}`} />
                                {label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('category') === 'decision' && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(DECISION_STATUSES).map(([value, { label, backgroundColor }]) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex flex-row items-center gap-2">
                                  <div className={`h-1.5 w-1.5 rounded-full ${backgroundColor}`} />
                                  {label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch('category') === 'interview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 [&>*:first-child]:col-span-1 [&>*:last-child]:col-span-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Round</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="1"
                                value={field.value?.split(' ')[1]?.split('(')[0] || ''}
                                onChange={(e) => {
                                  const round = e.target.value;
                                  const currentValue = field.value || '';
                                  const name = currentValue.match(/\((.*?)\)/)?.[1] || '';
                                  field.onChange(`Round ${round}${name ? ` (${name})` : ''}`);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interview Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Technical, Introduction"
                                value={field.value?.match(/\((.*?)\)/)?.[1] || ''}
                                onChange={(e) => {
                                  const name = e.target.value;
                                  const currentValue = field.value || '';
                                  const round = currentValue.split(' ')[1]?.split('(')[0] || '';
                                  field.onChange(`Round ${round}${name ? ` (${name})` : ''}`);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job title</FormLabel>
                      <FormControl>
                        <Input placeholder="Backend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="company.1"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Company size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Startup, Enterprise, Scaleup" {...field} />
                      </FormControl>
                      <FormMessage>{fieldState.error ? fieldState.error.message : <span className="text-muted-foreground">Try to describe in one word</span>}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company.2"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Fintech, Healthcare, Ecommerce" {...field} />
                      </FormControl>
                      <FormMessage>{fieldState.error ? fieldState.error.message : <span className="text-muted-foreground">Try to describe in one word</span>}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Berlin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Work model</FormLabel>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex h-9 items-center gap-4">
                          {WORK_MODELS.map((model) => (
                            <div key={model} className="flex items-center space-x-2">
                              <Checkbox
                                id={model.toLowerCase()}
                                checked={field.value?.includes(model)}
                                onCheckedChange={(checked) => handleWorkModelChange(model, !!checked)}
                                className="border-input data-[state=checked]:border-primary"
                              />
                              <label htmlFor={model.toLowerCase()} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {model}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Most important skills</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'flex flex-1 items-center gap-2 rounded-md border border-input bg-transparent px-3 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring',
                              form.formState.errors.skills && 'border-destructive/50 focus-within:ring-destructive'
                            )}
                          >
                            {Array.isArray(field.value) &&
                              field.value.map((skill, index) => (
                                <div key={index} className="flex h-6 items-center gap-1.5 rounded bg-primary px-2">
                                  <span className="text-xs text-primary-foreground">{skill}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSkills = field.value.filter((_, i) => i !== index);
                                      field.onChange(newSkills);
                                    }}
                                    className="flex h-4 w-4 items-center justify-center rounded-sm text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            <Input
                              className="!m-0 flex-1 !border-0 !p-0 !shadow-none focus-visible:!ring-0"
                              placeholder={field.value?.length >= 3 ? '' : 'Type a skill...'}
                              disabled={field.value?.length >= 3}
                              onKeyDown={(e) => {
                                if ((e.key === ' ' || e.key === ',' || e.key === 'Enter') && e.currentTarget.value) {
                                  e.preventDefault();
                                  const skill = e.currentTarget.value.trim();
                                  if (skill && (!field.value || field.value.length < 3)) {
                                    const newSkills = [...(field.value || []), skill];
                                    field.onChange(newSkills);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage>
                        <span className="text-muted-foreground">Press space, comma or enter to add a skill</span>
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Add application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
