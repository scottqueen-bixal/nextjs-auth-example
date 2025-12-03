import LoginForm from "./_login-form";
import { extractRedirectUri } from "@/app/lib/redirects";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirectUri = extractRedirectUri(params);

  return <LoginForm redirectUri={redirectUri} />;
}
