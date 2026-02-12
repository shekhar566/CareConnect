// "use client";

// import React from "react";

// import AuthForm from "@/components/forms/AuthForm";
// import { SignInSchema } from "@/lib/validations";
// import { signInWithCredentials } from "@/lib/actions/auth.action";

// const SignIn = () => {
//   return (
//     <AuthForm
//       formType="SIGN_IN"
//       schema={SignInSchema}
//       defaultValues={{ email: "", password: "" }}
//       onSubmit={signInWithCredentials}
//     />
//   );
// };

// export default SignIn;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      // ⚡️ HARDCODED CREDENTIALS (Make sure this user exists in DB!)
      const result = await signInWithCredentials({
        email: "guest@careconnect.com",
        password: "Guest123!",
      });

      if (result?.success) {
        toast({
          title: "Welcome, Recruiter! 👋",
          description: "You are now logged in as a Guest User.",
        });
        // The action likely handles redirect, if not, add router.push('/')
        router.push("/");
      } else {
        toast({
          title: "Guest Login Failed",
          description: result?.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 1. The Standard Form */}
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={signInWithCredentials}
      />

      {/* 2. The "OR" Divider */}
      <div className="my-2 flex items-center gap-4">
        <div className="h-px flex-1 bg-light-800 dark:bg-dark-400"></div>
        <span className="subtle-medium text-dark400_light700">OR</span>
        <div className="h-px flex-1 bg-light-800 dark:bg-dark-400"></div>
      </div>

      {/* 3. The "Recruiter Fast-Pass" Button */}
      <Button
        onClick={handleGuestLogin}
        disabled={isGuestLoading}
        className="min-h-[46px] w-full gap-2 rounded-lg bg-slate-900 text-white shadow-md hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        {isGuestLoading ? (
          "Signing in..."
        ) : (
          <>
            <Image
              src="/icons/user.svg" // Make sure this icon exists, or remove it
              alt="guest"
              width={20}
              height={20}
              className="invert-0 dark:invert"
            />
            <span className="font-semibold">Guest Login (For Recruiters)</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default SignIn;
