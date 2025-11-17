import React, { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
    <div>
      <h1 className="text-3xl">Sign in</h1>

      <div>
        New to Square? <Link to={"/signup"}>Sign up</Link>
      </div>

      <Field>
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
      <Button onClick={() => mutation.mutate()}>Sign in</Button>
    </div>
  );
};

export default LoginPage;
