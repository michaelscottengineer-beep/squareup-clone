import React, { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  type UserCredential,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ref, set } from "firebase/database";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: addUser } = useMutation({
    mutationFn: async (data: UserCredential) => {
      const { user } = data;
      const userRef = ref(db, "users/" + user.uid);
      console.log(user.uid, userRef);
      console.log({
        uid: user?.uid,
        project: db.app.options.projectId,
      });

      return await set(userRef, {
        email: user.email,
        avatar: "",
        displayName: "",
      });
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const mutation = useMutation({
    mutationFn: () => createUserWithEmailAndPassword(auth, email, password),
    onSuccess: async (data) => {
      addUser(data);
      toast.success("Signup successfully");
    },
    onError: () => {
      toast.error("Signup failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="px-10 w-[400px] space-y-3">
        <img src="squareup-logo.png" className="w-[100px]" alt="logo" />

        <h1 className="text-muted-foreground text-sm">Let’s create your account</h1>


        <form className="space-y-3" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">Email</FieldLabel>
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

          <Button className="w-full">Create an account</Button>

          <div className="flex gap-1 items-center">
            Already have a Square account?{" "}
            <Link to={"/signin"} className="text-blue-500 font-semibold">
              Sign in.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
