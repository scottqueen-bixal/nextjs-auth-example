import SignupForm from "./_signup-form";
import { extractRedirectUri } from "@/app/lib/redirects";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirectUri = extractRedirectUri(params);

  return <SignupForm redirectUri={redirectUri} />;
}
