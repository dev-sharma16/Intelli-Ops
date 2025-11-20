'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/* -----------------------------------------
    🔐 ZOD SCHEMA FOR LOGIN
------------------------------------------ */
const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log('submitted', data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-text px-4">
      <div className="w-full max-w-md bg-secondary/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-secondary">
        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-text text-center mb-6">
          Welcome Back..!
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* EMAIL FIELD */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-secondary/60 border-secondary text-text placeholder:text-text/60 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD FIELD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      className="bg-secondary/60 border-secondary text-text placeholder:text-text/60 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-primary text-background font-semibold rounded-xl py-3 hover:bg-accent transition-all shadow-[0_0_20px_#00d9ff55]"
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
