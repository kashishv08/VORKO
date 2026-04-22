"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gqlClient } from "@/src/lib/service/gql";
import { CREATE_PROJ } from "@/src/lib/gql/mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, DollarSign, Calendar, Briefcase, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Project } from "@prisma/client";

const categories = [
  "Web Development", "Mobile Apps", "UI/UX Design", "Backend Development",
  "DevOps", "Data Science", "Content Writing", "Digital Marketing", "Other",
];

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Please provide a detailed description (min 50 characters)"),
  budget: z.coerce.number().min(1, "Budget must be greater than 0"),
  category: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateProject() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      category: "",
      deadline: ""
    },
  });

  function addSkill() {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  }

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const variables = {
        title: values.title,
        description: values.description,
        budget: Number(values.budget),
        deadline: values.deadline,
        status: "OPEN",
        // category and skills can be added here if the mutation supports them
      };

      const res: { createProject: Project } = await gqlClient.request(
        CREATE_PROJ,
        variables
      );

      toast.success("Project posted successfully!");
      router.push(`/client/project/${res.createProject.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/client/project"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Post a Project</h1>
        <p className="text-sm text-slate-500">Tell freelancers what you need done.</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-900">Project Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Build a React dashboard with analytics"
                      className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-900">Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail. Include requirements, deliverables, and any technical specifications..."
                      className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary min-h-[150px] leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-red-500" />
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Minimum 50 characters requested for high quality proposals.</p>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-900">Budget (USD)</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">$</span>
                        <Input
                          type="number"
                          className="pl-7 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                          placeholder="5000"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-bold text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-900">Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-900">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-bold text-red-500" />
                </FormItem>
              )}
            /> */}

            {/* <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900">Required Skills</label>
              <div className="flex gap-2 text-sm font-bold">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="e.g. React, TypeScript"
                  className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary"
                />
                <button 
                  type="button" 
                  onClick={addSkill} 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-bold shadow-sm"
                >
                  Add
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 font-bold">
                  {skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/10"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => setSkills(skills.filter((s) => s !== skill))}
                        className="hover:text-primary-foreground focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div> */}

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <Link
                href="/client/project"
                className="flex-1 py-3 border border-slate-200 rounded-xl text-center text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Posting..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Project
                  </>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
