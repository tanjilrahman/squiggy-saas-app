"use client";

import * as React from "react";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Loader2 } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Verify User Email Code
  const onPressVerify = async (e: React.SyntheticEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setIsLoading(false);
    }
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors[0].message);
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {!pendingVerification && (
        <>
          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  id="first_name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  id="last_name"
                  onChange={(e) => setLastName(e.target.value)}
                  required={true}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
            </div>
            <Button type="submit" disabled={!isLoaded || isLoading}>
              {!isLoaded ||
                (isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ))}
              Create an account
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </>
      )}
      {pendingVerification && (
        <div>
          <form className="grid gap-3">
            <Input
              value={code}
              placeholder="Enter Verification Code..."
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" onClick={onPressVerify}>
              Verify Email
            </Button>
          </form>
        </div>
      )}
      <div>{error}</div>
    </div>
  );
}
