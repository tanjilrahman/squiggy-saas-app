import React, { useState } from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

function GoogleSignUpButton() {
  const { isLoaded, signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-in",
      redirectUrlComplete: "/dashboard",
    });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app
  return (
    <Button
      variant="outline"
      type="button"
      disabled={!isLoaded || isLoading}
      onClick={() => {
        signUpWith("oauth_google");
        setIsLoading(true);
      }}
    >
      {!isLoaded || isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          />
        </svg>
      )}{" "}
      Google
    </Button>
  );
}

export default GoogleSignUpButton;
