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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SubmitButton from "@/components/submitButton";

export const formSchema = z.object({
  code: z.string().length(6),
});

interface OtpFormProps {
  email: string;
  error: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({
  email,
  error,
  onCancel,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify your email address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter the code that was sent to {email}.
                </FormDescription>
                <FormMessage>{error !== "" && error}</FormMessage>
              </FormItem>
            )}
          />
          <SubmitButton isSubmitting={isSubmitting} className="w-full" />
          <Button
            onClick={onCancel}
            variant="link"
            size="sm"
            className="w-full text-gray-500"
          >
            <ArrowLeft className="inline-block mr-1" size={15} /> Change email
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OtpForm;
