"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useLoginMutate, useRegisterMutate } from "@/api/user/user";
import { AxiosError } from "axios";

export default function AuthForms() {
    const [activeTab, setActiveTab] = useState("login");

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // const { login, loading: loginLoad } = useUserStore();
    const { mutateAsync: loginReq, isPending: loginLoad } = useLoginMutate();
    const { mutateAsync: registerReq, isPending: loadRegister } =
        useRegisterMutate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement login logic here
        console.log("Login submitted");

        try {
            await loginReq({
                username: userName,
                password,
            });
            toast.success("Logged in", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: ToastTransition.,
            });
        } catch (error) {
            console.log("Login failed", error);
            toast.error(`Login failed!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: Bounce,
            });
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement signup logic here
        console.log("Signup submitted");

        try {
            await registerReq({
                email,
                username: userName,
                password,
            });

            toast.success("User signed up", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: ToastTransition.,
            });

            setEmail("");
            setPassword("");
            setActiveTab("login");
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(
                    `Registration failed!, ${err.response?.data?.message}`,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        // transition: Bounce,
                    }
                );
            } else {
                toast.error("Registration failed!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    // transition: Bounce,
                });
            }
            console.log("Registration failed", err);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                    Login or create a new account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={handleLogin}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="login-username">
                                        Username
                                    </Label>
                                    <Input
                                        id="login-username"
                                        type="text"
                                        placeholder="Enter your Username"
                                        value={userName}
                                        onChange={(e) =>
                                            setUserName(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="login-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <CardFooter className="flex justify-between mt-4 px-0">
                                <Button variant="outline">Cancel</Button>
                                <Button type="submit">
                                    {loginLoad && (
                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                                    )}
                                    Login
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form onSubmit={handleSignup}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-name">
                                        User Name
                                    </Label>
                                    <Input
                                        id="signup-name"
                                        placeholder="Enter your user name"
                                        required
                                        value={userName}
                                        onChange={(e) =>
                                            setUserName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Create a password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <CardFooter className="flex justify-between mt-4 px-0">
                                <Button variant="outline">Cancel</Button>
                                <Button type="submit">
                                    {loadRegister && (
                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                                    )}
                                    Sign Up
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
