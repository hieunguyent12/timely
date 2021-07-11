import Head from "next/head";
import Link from "next/link";

export default function Home() {
  // TODO: redirect to dashboard if logged in
  return (
    <div>
      <Head>
        <title>Timely</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p>Home Page!</p>
      <Link href="/login">Login</Link>
    </div>
  );
}
