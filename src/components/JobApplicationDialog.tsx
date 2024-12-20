import { cn } from '@/lib/utils';
import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const KANBAN_CATEGORIES = {
  [KanbanCategory.INTERESTED]: { label: 'Interested', backgroundColor: 'bg-gray-500' },
  [KanbanCategory.APPLIED]: { label: 'Applied', backgroundColor: 'bg-blue-500' },
  [KanbanCategory.INTERVIEW]: { label: 'Interview', backgroundColor: 'bg-fuchsia-500' },
  [KanbanCategory.DECISION]: { label: 'Decision', backgroundColor: 'bg-amber-500' }
} as const;

const DECISION_STATUSES = {
  [KanbanDecisionStatus.OFFER]: { label: 'Received Offer', backgroundColor: 'bg-amber-500' },
  [KanbanDecisionStatus.ACCEPTED]: { label: 'Accepted', backgroundColor: 'bg-green-500' },
  [KanbanDecisionStatus.DENIED]: { label: 'Denied', backgroundColor: 'bg-red-500' }
};

const jobApplicationSchema = z.object({
  category: z.nativeEnum(KanbanCategory),
  role: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companySize: z.string().optional(),
  companyIndustry: z.string().optional(),
  jobLink: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  workModels: z.array(z.string()),
  skills: z.array(z.string()).max(3, 'Maximum 3 skills are allowed'),
  decisionStatus: z.nativeEnum(KanbanDecisionStatus).optional(),
  interviewStatus: z
    .object({
      round: z.string().optional(),
      type: z.string().optional()
    })
    .optional()
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

  const form: UseFormReturn<JobApplicationFormData> = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: useMemo(() => {
      return {
        category: category,
        role: job?.role ?? '',
        companyName: job?.company?.name ?? '',
        companySize: job?.company?.size ?? '',
        companyIndustry: job?.company?.industry ?? '',
        location: job?.location ?? '',
        interviewStatus:
          job?.status && typeof job.status === 'object'
            ? {
                round: job.status.round?.toString() ?? '',
                type: job.status.description ?? ''
              }
            : {
                round: '',
                type: ''
              },
        workModels: [job?.onSite ? 'On-site' : null, job?.hybrid ? 'Hybrid' : null, job?.remote ? 'Remote' : null].filter(Boolean) as WorkModel[],
        skills: job?.skills ?? [],
        jobLink: job?.url ?? '',
        decisionStatus: job?.status as KanbanDecisionStatus
      };
    }, [job, category])
  });

  useEffect(() => {
    if (category) form.setValue('category', category);
  }, [category, form]);

  const handleWorkModelChange = useCallback(
    (model: WorkModel, checked: boolean) => {
      const currentLocations = form.getValues('workModels');
      form.setValue('workModels', checked ? [...currentLocations, model] : currentLocations.filter((loc) => loc !== model));
    },
    [form]
  );

  const onSubmit = (data: JobApplicationFormData) => {
    const { role, companyName, companySize, companyIndustry, skills, location, workModels, category, decisionStatus, interviewStatus, jobLink } = data;

    const jobApplication: JobApplication = {
      id: job ? job.id : uuidv4(),
      role,
      company: {
        name: companyName,
        ...(companySize ? { size: companySize } : {}),
        ...(companyIndustry ? { industry: companyIndustry } : {})
      },
      location,
      url: jobLink,
      onSite: workModels.includes('On-site'),
      hybrid: workModels.includes('Hybrid'),
      remote: workModels.includes('Remote'),
      status: undefined,
      skills,
      category
    };

    form.reset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (category === KanbanCategory.INTERVIEW && interviewStatus) (jobApplication as any)['status'] = { round: Number(interviewStatus.round), description: interviewStatus.type };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (category === KanbanCategory.DECISION) (jobApplication as any)['status'] = decisionStatus;

    onClose(jobApplication);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh overflow-y-scroll sm:max-w-[800px]">
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

                {form.watch('category') === KanbanCategory.DECISION && (
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

                {form.watch('category') === KanbanCategory.INTERVIEW && (
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
                  name="companyName"
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
                  name="companySize"
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
                  name="companyIndustry"
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
                              onBlur={(e) => {
                                e.preventDefault();
                                const skill = e.currentTarget.value.trim();
                                if (skill && (!field.value || field.value.length < 3)) {
                                  const newSkills = [...(field.value || []), skill];
                                  field.onChange(newSkills);
                                  e.currentTarget.value = '';
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
                <FormField
                  control={form.control}
                  name="jobLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit">{job ? 'Edit' : 'Add'} application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
