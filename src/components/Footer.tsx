export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950">
      {/* CTA Banner */}
      <div className="py-12 md:py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Got a project in mind?</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Let&apos;s work together.</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@guidezy.in"
              className="px-6 py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest rounded-lg font-bold hover:brightness-110 transition-all"
            >
              support@guidezy.in
            </a>
            <a
              href="mailto:utkarsh@guidezy.in"
              className="px-6 py-3 border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-primary/10 transition-all"
            >
              utkarsh@guidezy.in
            </a>
            <a
              href="mailto:founder@guidezy.in"
              className="px-6 py-3 border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-primary/10 transition-all"
            >
              founder@guidezy.in
            </a>
          </div>
        </div>
      </div>

      {/* Links & Copyright */}
      <div className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-sm text-slate-300 font-bold">
            Utkarsh Chaturvedi
          </div>
          <div className="flex gap-8">
            {[
              { label: "GitHub", href: "https://github.com/utkcha1205" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/utkarsh-chaturvedi-8b4690150/" },
              { label: "Medium", href: "https://medium.com/@utkcha1205" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 text-xs uppercase tracking-widest transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {year} Utkarsh Chaturvedi. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Designed & engineered with ❤️ by Utkarsh Chaturvedi. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
