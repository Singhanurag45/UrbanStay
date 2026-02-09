import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import logoImage from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                {/* Ensure this path matches your project structure */}
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
             
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Discover the world's most luxurious hotels and hidden gems. We
              make booking your dream vacation effortless and secure.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <FooterLink label="About Us" />
              <FooterLink label="Careers" />
              <FooterLink label="Press" />
              <FooterLink label="Blog" />
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <FooterLink label="Help Center" />
              <FooterLink label="Terms of Service" />
              <FooterLink label="Privacy Policy" />
              <FooterLink label="Safety Information" />
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Stay Updated</h4>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the best travel deals.
            </p>

            {/* Newsletter Input */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 focus-within:border-emerald-500/50 transition-colors mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-white px-3 py-2 w-full text-sm focus:outline-none placeholder-slate-600"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-md transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-emerald-400" />
                <span>support@urbanstay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-emerald-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-emerald-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} UrbanStay Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" />{" "}
            by Anurag Singh
          </p>
        </div>
      </div>
    </footer>
  );
};

/* --- Helper Components --- */

const SocialIcon = ({ icon }: { icon: any }) => (
  <a
    href="#"
    className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-emerald-500 transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ label }: { label: string }) => (
  <li className="hover:text-emerald-400 cursor-pointer transition-colors duration-200 flex items-center gap-2 group">
    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-300"></span>
    {label}
  </li>
);

export default Footer;
