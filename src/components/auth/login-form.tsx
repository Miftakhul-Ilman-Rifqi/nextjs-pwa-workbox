"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth-validation";
import type { LoginRequest } from "@/types/auth-types";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading } = useLogin();

    const form = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await login(data);
            if (response.statusCode === 200) {
                // Set cookie untuk session
                document.cookie = "isLoggedIn=true; path=/";
                router.push("/input-data-customer");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="w-full max-w-[400px] border-0 shadow-lg">
            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan username"
                                            {...field}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Masukkan password"
                                            {...field}
                                            className="h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
