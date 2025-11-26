import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => signInWithEmailAndPassword(auth, email, password),
    onSuccess: (data) => {
      console.log("signed in data", data);
      toast.success("Sign in successfully");
      window.location.href = window.location.origin + "/dashboard";
    },
    onError: () => {
      toast.error("Signin failed");
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] ">
        <h1 className="text-3xl font-bold ">Sign in</h1>

        <div className="text-muted-foreground text-sm mb-4">
          New to Square? <Link to={"/signup"}>Sign up</Link>
        </div>

        <Field className="mb-4">
          <FieldLabel htmlFor="email-input">Email</FieldLabel>
          <Input
            id="email-input"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password-input">Password</FieldLabel>
          <Input
            id="password-input"
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button onClick={() => mutation.mutate()} className="mt-4">
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
