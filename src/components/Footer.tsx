import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.png" alt="MediSure" width={44} height={44} className="object-contain" />
              <span className="text-xl md:text-2xl font-semibold text-white">MediSure</span>
            </Link>
            <p className="mt-4 max-w-xl text-sm md:text-base text-slate-400 leading-7">
              Secure medicine verification powered by blockchain. We help patients and healthcare
              providers verify authenticity and track medicine journeys with confidence.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" aria-label="MediSure on X" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="MediSure on LinkedIn" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="MediSure on Facebook" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="MediSure on Instagram" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm md:text-base font-semibold tracking-wide uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm md:text-base text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">Shop</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition">Support</Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-white transition">Login</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm md:text-base font-semibold tracking-wide uppercase">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm md:text-base text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@medisure.app</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-5 text-sm text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} MediSure. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-300 transition">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
