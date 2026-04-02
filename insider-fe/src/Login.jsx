import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { api } from "./lib/common";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "./components/ui/input";
import { Field, FieldDescription, FieldLabel, FieldGroup } from "./components/ui/field";
import { Checkbox } from "./components/ui/checkbox";
import { Card } from "./components/ui/card";
import { EyeClosed, EyeIcon } from "lucide-react";

export const Login = () => {
    const login = useAuthStore((s) => s.login);
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Login dulu
            const res = await api.post("auth/login", {
                username,
                password,
                rememberMe
            });

            const token = res.data.access_token;

            // 2. Set token ke header global
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // 3. Ambil user dari /me
            const userRes = await api.get("user/me");

            const user = userRes.data;

            // 4. Simpan ke store
            login(token, user, true);

            navigate("/");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-blue-500 via-blue-300 to-blue-100 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 [background-image:radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <Card className="relative z-10 py-0">
                    <div className="grid sm:grid-cols-2">
                        <form className="p-8" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="flex justify-left gap-1">
                                    <img className="w-12" src="insider-icon.svg" alt="" />
                                    <img className="w-24" src="insider-text.svg" alt="" />
                                </div>

                                <div>
                                    <p className="text-sm">Welcome to</p>
                                    <h1 className="text-sm text-xl! font-semibold">Insider TIF</h1>
                                </div>

                                <div className="flex flex-col gap-1 text-sm">
                                    <Field>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            placeholder="NIK or Username"
                                            className="p-2 border border-gray-300 rounded focus:outline-none"
                                        />

                                    </Field>
                                </div>

                                <div className="flex flex-col gap-1 text-sm ">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <div className="flex">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="*******"
                                                className="p-2 border border-r-0 border-gray-300 rounded rounded-r-none focus:outline-none"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                variant="ghost"
                                                size="icon"
                                                className=" border border-gray-300 border-l-0 rounded rounded-l-none"
                                            >{showPassword ? <EyeIcon /> : <EyeClosed />}
                                            </Button>
                                        </div>
                                    </Field>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FieldGroup className="w-full">
                                        <Field orientation="horizontal">
                                            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" checked={rememberMe} onCheckedChange={setRememberMe} />
                                            <FieldLabel htmlFor="terms-checkbox-basic">
                                                Remember me
                                            </FieldLabel>
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    Log in {isLoading ? <Spinner /> : ""}
                                </Button>

                                <footer className="text-center text-xs text-gray-800">
                                    <p>&copy; 2025 PT TIF Hak Cipta dilindungi undang-undang</p>
                                </footer>
                            </div>
                        </form>

                        <div className="sm:block hidden relative overflow-hidden rounded-r-lg">
                            <img
                                src="/login-bg-tlt.webp"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
