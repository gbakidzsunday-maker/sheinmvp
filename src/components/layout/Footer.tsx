import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-gray-100 border-t border-gray-200 mt-16">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ZARA FASHION</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your destination for affordable fashion in Nigeria.
              Shop the latest trends in clothing, shoes, bags & beauty.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#FF3F6C] hover:text-white transition-colors shadow-sm">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#FF3F6C] hover:text-white transition-colors shadow-sm">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#FF3F6C] hover:text-white transition-colors shadow-sm">
                <FaFacebookF size={14} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/shop?category=womens-clothing" className="hover:text-[#FF3F6C]">Women</Link></li>
              <li><Link href="/shop?category=mens-clothing" className="hover:text-[#FF3F6C]">Men</Link></li>
              <li><Link href="/shop?category=shoes" className="hover:text-[#FF3F6C]">Shoes</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-[#FF3F6C]">Bags</Link></li>
              <li><Link href="/shop?category=beauty" className="hover:text-[#FF3F6C]">Beauty</Link></li>
              <li><Link href="/shop?featured=flash-sale" className="hover:text-[#FF3F6C]">Flash Sale</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-[#FF3F6C]">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">FAQs</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-[#FF3F6C]">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#FF3F6C]">Sell on Zara</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Zara Fashion. All rights reserved. Made in Nigeria 🇳🇬</p>
          <p className="mt-1 text-xs">
            We accept: Visa, Mastercard, Verve — Secure payments powered by Paystack
          </p>
        </div>
      </div>
    </footer>
  );
}
