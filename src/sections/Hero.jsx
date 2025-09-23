export default function Hero() {
  return (
    <section aria-labelledby="home-title" className="relative overflow-hidden">
      {/* text-white is scoped ONLY inside this gradient box */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1
              id="home-title"
              className="text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              Manish Chawla — Senior Frontend Developer & Project Lead (PMP)
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/90">
              17+ years • React, JavaScript, UI/UX • Performance, Accessibility,
              CI/CD • Salesforce & Headless CMS
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/Manish_Chawla_Resume.pdf"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                           bg-white text-brand-800 shadow hover:bg-zinc-100
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Download Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                           border border-white/80 text-white hover:bg-white/10
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
