"use server";

import { SignupFormSchema, SignupFormState } from "@/app/lib/definitions";
import { resolveRedirectUri, DEFAULT_REDIRECT } from "@/app/lib/redirects";
import { redirect } from "next/navigation";

export async function signup(state: SignupFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      formData: {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
      },
    };
  }

  // Call the provider or db to create a user...
  try {
    // Send plain password to backend - hashing will be done on the server
    const response = await fetch(
      `${process.env.API_URL || "http://api:8000"}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY || "",
        },
        body: JSON.stringify({
          first_name: validatedFields.data.first_name,
          last_name: validatedFields.data.last_name,
          email: validatedFields.data.email,
          password: validatedFields.data.password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      // Handle specific error cases
      if (response.status === 409) {
        return {
          errors: {
            email: ["Email already exists"],
          },
          formData: {
            first_name: validatedFields.data.first_name,
            last_name: validatedFields.data.last_name,
            email: validatedFields.data.email,
            password: validatedFields.data.password,
          },
        };
      }

      // Handle other errors
      return {
        message: errorData.error || "Failed to create user",
        formData: {
          first_name: validatedFields.data.first_name,
          last_name: validatedFields.data.last_name,
          email: validatedFields.data.email,
          password: validatedFields.data.password,
        },
      };
    }

    await response.json(); // Consume the response

    // If we reach here, the API call was successful
    // Redirect the user to the login page only on success
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "Network error. Please try again.",
      formData: {
        first_name: validatedFields.data.first_name,
        last_name: validatedFields.data.last_name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      },
    };
  }
  const redirectUri = resolveRedirectUri(
    formData.get("redirect_uri") as string
  );
  redirect(
    `/login${
      redirectUri !== DEFAULT_REDIRECT
        ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
        : ""
    }`
  );
}
