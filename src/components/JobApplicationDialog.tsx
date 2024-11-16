import { cn } from '@/lib/utils';
import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
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
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    size: z.string(),
    industry: z.string()
  }),
  location: z.string().min(1, 'Location is required'),
  workModels: z.array(z.string()),
  skills: z.array(z.string()).min(1, 'At least one skill is required').max(3, 'Maximum 3 skills are allowed'),
  category: z.nativeEnum(KanbanCategory),
  decisionStatus: z.nativeEnum(KanbanDecisionStatus).optional(),
  interviewStatus: z
    .object({
      round: z.string(),
      type: z.string()
    })
    .optional(),
  percentage: z.number().min(0).max(100).optional()
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const WORK_MODELS = ['On-site', 'Remote', 'Hybrid'] as const;
type WorkModel = (typeof WORK_MODELS)[number];

interface JobApplicationDialogProps {
  category?: KanbanCategory;
  children: JSX.Element;
  onClose: (job: JobApplication) => void;
  job?: JobApplication;
}

export function JobApplicationDialog({ category, children, onClose, job }: JobApplicationDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      role: job?.role ?? '',
      company: job?.company ?? {
        name: '',
        size: '',
        industry: ''
      },
      location: job?.location ?? '',
      interviewStatus:
        job && job.status && typeof job.status === 'object'
          ? {
              round: job.status.round.toString(),
              type: job.status.description
            }
          : {
              round: '',
              type: ''
            },
      workModels: job ? [`${job.onSite}`, `${job.hybrid}`, `${job.remote}`] : [],
      skills: job ? job.skills : []
    }
  });

  React.useEffect(() => {
    if (category) form.setValue('category', category);
  }, [category, form]);

  const handleWorkModelChange = React.useCallback(
    (model: WorkModel, checked: boolean) => {
      const currentLocations = form.getValues('workModels');
      form.setValue('workModels', checked ? [...currentLocations, model] : currentLocations.filter((loc) => loc !== model));
    },
    [form]
  );

  const onSubmit = (data: JobApplicationFormData) => {
    // const { role, company, skills, location, workModels, category, decisionStatus, interviewStatus, percentage } = data;
    const { role, company, skills, location, workModels, category, percentage } = data;
    const { name, size, industry } = company;

    const newJobApplication: JobApplication = {
      id: job ? job.id : uuidv4(),
      role,
      company: {
        name,
        size,
        industry
      },
      location,
      onSite: workModels.includes('On-site'),
      hybrid: workModels.includes('Hybrid'),
      remote: workModels.includes('Remote'),
      status: undefined,
      skills,
      category,
      percentage
    };

    form.reset();

    // TODO
    // if (category === KanbanCategory.INTERVIEW && interviewStatus) newJobApplication['status'] = { round: Number(interviewStatus.round), description: interviewStatus.type };
    // if (category === KanbanCategory.DECISION) newJobApplication['status'] = decisionStatus;

    onClose(newJobApplication);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{job ? 'Edit' : 'Add'} job application</DialogTitle>
              <DialogDescription>{job ? 'Edit an existing job application.' : 'Add a new job application to track.'} </DialogDescription>
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
                    name="decisionStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={(value) => (value === 'null' ? field.onChange('') : field.onChange(value))} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="null">
                              <div className="flex flex-row items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full`} />
                                None
                              </div>
                            </SelectItem>
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
                        name="interviewStatus.round"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Round</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interviewStatus.type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interview Type</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Technical, Introduction" {...field} />
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
                  name="company.name"
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
                  name="company.size"
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
                  name="company.industry"
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
                  name="location"
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
                    name="workModels"
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
              <Button type="submit">{job ? 'Edit' : 'Add'} application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
