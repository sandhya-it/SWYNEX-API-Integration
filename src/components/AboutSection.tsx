import React from 'react';
import { Library, Globe, Database, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 md:py-24 border-t border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 dark:border-slate-800 shadow-xl shadow-stone-900/5">
              <img
                src="/src/assets/images/bookverse_reading_nook_1794304856769.jpg"
                alt="Stack of hardcover clothbound books on natural oak desk with morning sunlight"
                className="w-full h-80 sm:h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Universal Library Initiative
                </span>
                <p className="font-serif text-lg font-bold mt-0.5">
                  "A book is a version of the world. If you do not like it, ignore it; or offer your own version in return."
                </p>
                <p className="text-xs text-white/60 mt-1">— Salman Rushdie</p>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              <Library className="w-4 h-4" />
              <span>About BOOKVERSE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
              Democratizing Access to the World's Written Heritage
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              BOOKVERSE is an open, modern literary discovery application designed to help curious minds explore human knowledge without barriers. By integrating seamlessly with the <strong>Open Library Public API</strong> (an initiative of the non-profit Internet Archive), BOOKVERSE delivers instant search, multi-decade era filtering, edition tracking, and rich visual book cards.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Public & Open API</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Queries the live Open Library catalog containing over 20+ million public records without proprietary paywalls.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">
                  <Database className="w-4 h-4" />
                  <span>Client-Side Persistence</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Personal book wishlists and theme preferences are saved safely in your browser via localStorage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Resilient & Responsive</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Graceful network retry fallbacks, tactile book spine styling, and full responsiveness across phone, tablet, and desktop.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1">
                  <Library className="w-4 h-4" />
                  <span>Zero-Config Deployment</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Modern pure-frontend build with Vite and Tailwind CSS ready for single-click deployment on Vercel or any static host.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
