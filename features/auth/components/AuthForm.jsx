// features/auth/components/AuthForm.jsx
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

const departments = ['Yazılım Mühendisliği', 'Bilişim Sistemleri Mühendisliği'];

export function AuthForm({ type = 'login', onSubmit, isSubmitting, schema }) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(type === 'register' && {
        firstName: '',
        lastName: '',
        department: '',
      }),
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(`${type} error:`, error);
    }
  };

  return (
    <Card className="border border-primary/20 bg-background/30">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {type === 'register' && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground/70">Ad</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-md border border-primary/20 bg-background/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground/70">Soyad</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-md border border-primary/20 bg-background/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground/70">Bölüm</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11 rounded-md border border-primary/20 bg-background/50 focus:border-primary focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Bölüm seçiniz" />
                        </SelectTrigger>
                        <SelectContent className="rounded-md border border-primary/20 bg-background">
                          {departments.map((department) => (
                            <SelectItem key={department} value={department} className="focus:bg-primary/5 focus:text-foreground">
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground/70">E-posta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ornek@ogr.mehmetakif.edu.tr"
                      {...field}
                      className="h-11 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground/70">Şifre</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className="h-11 rounded-md border border-primary/20 bg-background/50 pr-12 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-11 w-full rounded-md bg-primary font-medium text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'İşleniyor...' : type === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        {type === 'login' ? (
          <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
            Hesabınız yok mu? <span className="font-semibold text-primary">Kayıt olun</span>
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Zaten hesabınız var mı? <span className="font-semibold text-primary">Giriş yapın</span>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
