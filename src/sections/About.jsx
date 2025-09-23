export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-900"
    >
      <div className="container mx-auto px-4 py-14">
        <h2 id="about-title" className="text-2xl md:text-3xl font-bold">
          About
        </h2>
        <p className="mt-4 max-w-3xl text-zinc-700 dark:text-zinc-700 leading-relaxed">
          I'm a UI/Frontend Lead in San Jose, CA with 17+ years of experience
          across React, JavaScript, and UX. I lead front-end architecture,
          improve performance and accessibility, and ship reliably with CI/CD.
          PMP-certified; comfortable with AWS, Salesforce/Headless CMS, and
          analytics-driven iteration.
        </p>
      </div>
    </section>
  );
}
