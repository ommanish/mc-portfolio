export default function Contact() {
  // TODO: replace with your best email + LinkedIn URL
  const email = "mailto:dev.manishchawla@gmail.com";
  const linkedin = "https://www.linkedin.com/in/manishchawla09/"; // update if needed

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="container mx-auto px-4 py-14"
    >
      <h2
        id="contact-title"
        className="text-2xl md:text-3xl font-bold dark:text-zinc-900"
      >
        Contact
      </h2>

      <div className="mt-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
        <p className="text-zinc-700 dark:text-zinc-300">
          Interested in collaborating or hiring? Reach out via email or connect
          on LinkedIn.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={email}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                       bg-brand-600 text-white hover:bg-brand-500
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            Email Me
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                       border border-zinc-300 text-zinc-800 hover:bg-zinc-50
                       dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
