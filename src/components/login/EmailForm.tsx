"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "../submitButton";

export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email." })
    .email({ message: "Please enter a valid email." }),
});

interface EmailFormProps {
  isSubmitting: boolean;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ isSubmitting, onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormDescription>We&apos;ll send you a code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isSubmitting={isSubmitting} className="w-full" />
      </form>
    </Form>
  );
};

export default EmailForm;
