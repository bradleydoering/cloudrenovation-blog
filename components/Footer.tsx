import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/cloud-logo.webp"
                  alt="Cloud Renovation"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-space-grotesk font-bold text-xl text-white">Cloud</h3>
                <p className="font-space-grotesk text-gray-300 text-sm">Renovation</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed">
              The easiest renovation you've ever experienced.
            </p>
            
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                929 - 68 Smithe street<br />
                Vancouver BC V6B 0P4
              </p>
              <p className="text-gray-300 text-sm">
                team@cloudrenovation.ca<br />
                (604) 800-6344
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-space-grotesk font-semibold text-lg mb-6 text-white">Services</h4>
            <ul className="space-y-4">
              <li><a href="https://cloudrenovation.ca/services/kitchens" className="text-gray-300 hover:text-coral transition-colors text-base">Kitchens</a></li>
              <li><a href="https://cloudrenovation.ca/services/bathrooms" className="text-gray-300 hover:text-coral transition-colors text-base">Bathrooms</a></li>
              <li><a href="https://cloudrenovation.ca/services/full-home" className="text-gray-300 hover:text-coral transition-colors text-base">Full Home</a></li>
              <li><a href="https://cloudrenovation.ca/services/design" className="text-gray-300 hover:text-coral transition-colors text-base">Design</a></li>
              <li><a href="https://cloudrenovation.ca/financing" className="text-gray-300 hover:text-coral transition-colors text-base">Financing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-space-grotesk font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li><a href="https://cloudrenovation.ca/about" className="text-gray-300 hover:text-coral transition-colors text-base">About Us</a></li>
              <li><a href="https://cloudrenovation.ca/careers" className="text-gray-300 hover:text-coral transition-colors text-base">Careers</a></li>
              <li><a href="/blog" className="text-coral font-medium text-base">Blog</a></li>
              <li><a href="https://cloudrenovation.ca/contact" className="text-gray-300 hover:text-coral transition-colors text-base">Contact</a></li>
              <li><a href="https://cloudrenovation.ca/portfolio" className="text-gray-300 hover:text-coral transition-colors text-base">Our Work</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-space-grotesk font-semibold text-lg mb-6 text-white">Get Updates</h4>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              Subscribe to our newsletter for renovation tips and special offers.
            </p>
            
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-navy-light border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-coral transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-coral w-full px-6 py-3 font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Cloud Renovation. All rights reserved.
            </p>
            
            <div className="flex space-x-8">
              <a href="https://cloudrenovation.ca/terms" className="text-gray-400 hover:text-coral transition-colors text-sm">Terms</a>
              <a href="https://cloudrenovation.ca/privacy" className="text-gray-400 hover:text-coral transition-colors text-sm">Privacy</a>
              <a href="https://cloudrenovation.ca/cookies" className="text-gray-400 hover:text-coral transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}