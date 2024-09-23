import Link from "next/link";

export default function Page() {
  return (
    <div style={{ padding: "30px" }}>
      <Link href={"/home"}>
        <h1
          className="text-2xl font-mono"
          style={{ textDecoration: "underline" }}
        >
          Hello, Click to go to Home page!
        </h1>
      </Link>
    </div>
  );
}
