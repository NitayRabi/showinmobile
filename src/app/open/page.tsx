// app/open/page.tsx

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEncodedState } from "../state"; // adjust path if necessary

function OpenPageInternal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, setState] = useEncodedState();

  useEffect(() => {
    // Get the 'state' query parameter
    const stateParam = searchParams.get("state");

    if (stateParam) {
      try {
        // Parse the state parameter

        // Set parsed data into Jotai atom state
        setState(stateParam);

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Error parsing state parameter:", error);
        // Optionally handle errors (e.g., redirect to error page)
      }
    }
  }, [searchParams, router, setState]);

  return (
    <div>
      <p>Processing...</p>
    </div>
  );
}

export default function OpenPage() {
  return (
    <Suspense>
      <OpenPageInternal />
    </Suspense>
  );
}
