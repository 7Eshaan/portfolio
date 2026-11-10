import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { FiDownload } from "react-icons/fi";

export const metadata: Metadata = { title: "Resume" };

const RESUME_PATH = "/resume.pdf";

export default function Resume() {
  // Drop your PDF at public/resume.pdf and this page picks it up.
  const hasResume = existsSync(
    path.join(process.cwd(), "public", "resume.pdf"),
  );

  return (
    <>
      <section className="pb-10">
        <p className="mb-5 text-sm font-medium tracking-[0.2em] text-muted uppercase">
          Resume
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="sheen-text text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            My <span className="gradient-text">resume</span>.
          </h1>
          {hasResume && (
            <a
              href={RESUME_PATH}
              download
              className="grad-border lift inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium backdrop-blur-sm"
            >
              <FiDownload className="size-4" />
              Download PDF
            </a>
          )}
        </div>
      </section>

      {hasResume ? (
        <object
          data={RESUME_PATH}
          type="application/pdf"
          aria-label="Resume PDF"
          className="h-[80vh] w-full rounded-2xl border border-line bg-white"
        >
          <p className="p-6 text-neutral-700">
            Your browser can&apos;t show PDFs inline —{" "}
            <a href={RESUME_PATH} className="underline">
              open the resume
            </a>{" "}
            instead.
          </p>
        </object>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center backdrop-blur-sm">
          <p className="text-lg font-medium">Resume coming soon.</p>
          <p className="mt-2 text-sm text-muted">
            Add your PDF at{" "}
            <code className="font-mono text-fg">public/resume.pdf</code> and it
            will appear here with a download button.
          </p>
        </div>
      )}
    </>
  );
}
