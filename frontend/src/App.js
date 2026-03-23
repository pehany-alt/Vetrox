import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/products", label: "PRODUCTS" },
    { path: "/colors", label: "COLORS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-light tracking-[0.3em] text-white" data-testid="logo">
          VETROX
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-${link.label.toLowerCase()}`}
              className={`text-sm tracking-wider transition-colors ${
                location.pathname === link.path
                  ? "text-emerald-400"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <Link
          to="/contact"
          data-testid="nav-enquire-btn"
          className="hidden md:block px-6 py-2 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all"
        >
          ENQUIRE NOW
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm tracking-wider ${
                  location.pathname === link.path
                    ? "text-emerald-400"
                    : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-6 py-2 border border-white text-white text-sm tracking-wider text-center"
            >
              ENQUIRE NOW
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-black border-t border-white/10 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-light tracking-[0.2em] text-white mb-4">VETROX</h3>
          <p className="text-white/50 text-sm">Premium Paint Protection Film</p>
          <p className="text-white/50 text-sm">Australian Quality Guaranteed</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">PRODUCTS</h4>
          <div className="space-y-2">
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colors">Gloss Series</Link>
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colors">Pro Satin Matte</Link>
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colors">Colored Series</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">COMPANY</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-white/50 text-sm hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="block text-white/50 text-sm hover:text-white transition-colors">Contact</Link>
            <Link to="/colors" className="block text-white/50 text-sm hover:text-white transition-colors">Color Gallery</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">PARTNERS</h4>
          <div className="space-y-2">
            <a href="https://northshoreppf.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/50 text-sm hover:text-white transition-colors">NorthShore PPF</a>
            <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/50 text-sm hover:text-white transition-colors">DIYPPFKIT.com.au</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-8 text-center">
        <p className="text-white/30 text-sm">© 2024 Vetrox PPF. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Home Page
const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    { title: "Self-Healing", desc: "Advanced thermal self-repair technology that eliminates minor scratches and swirl marks automatically.", icon: "✦" },
    { title: "Hydrophobic", desc: "Premium water-repelling coating keeps your vehicle cleaner for longer with enhanced gloss.", icon: "◇" },
    { title: "Anti-Yellowing", desc: "Superior UV resistance ensures crystal-clear transparency that lasts the lifetime of the film.", icon: "○" },
    { title: "Multi-Layer", desc: "Five precision-engineered layers including TPU substrate, self-healing layer, and protective coating.", icon: "▣" },
  ];

  const products = [
    { title: "Gloss Series", desc: "Crystal-clear protection with showroom shine", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { title: "Pro Satin Matte", desc: "Sophisticated matte transformation", image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { title: "Colored Series", desc: "200+ colors to transform your vehicle", image: "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800" },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury car with PPF"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-6">PREMIUM PAINT PROTECTION FILM</p>
          <h1 className="text-6xl md:text-8xl font-light text-white leading-none mb-8">
            <span className="italic">INVISIBLE</span><br />
            <span className="italic">ARMOR.</span><br />
            <span className="text-emerald-400 italic">TIMELESS</span><br />
            <span className="text-emerald-400 italic">SHINE.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-10">
            Australian-grade protection engineered for excellence. Vetrox PPF delivers unmatched clarity, self-healing technology, and a 10-year warranty.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/products')}
              data-testid="hero-explore-btn"
              className="px-8 py-3 bg-white text-black text-sm tracking-wider hover:bg-white/90 transition-all"
            >
              EXPLORE PRODUCTS
            </button>
            <button 
              onClick={() => navigate('/contact')}
              data-testid="hero-quote-btn"
              className="px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all"
            >
              GET A QUOTE
            </button>
          </div>
          <div className="mt-12 flex items-center gap-2">
            <span className="text-emerald-400 text-2xl">●</span>
            <span className="text-white/70 text-sm tracking-wider">10 Year Warranty</span>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-zinc-950" data-testid="technology-section">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">TECHNOLOGY</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-16">Engineered for Excellence</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 border border-white/10 hover:border-emerald-400/50 transition-colors" data-testid={`feature-${idx}`}>
                <span className="text-emerald-400 text-2xl">{feature.icon}</span>
                <h3 className="text-white text-xl mt-4 mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Layer Diagram */}
          <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl text-white mb-6">Premium TPU Construction</h3>
              <p className="text-white/60 mb-8">
                Vetrox PPF utilizes Lubrizol TPU substrate with USA Ashland adhesive, delivering benchmark performance for top-tier automotive protection.
              </p>
              <div className="space-y-4">
                {[
                  "Surface anti-scratch protective layer",
                  "Self-healing layer",
                  "TPU material layer (Lubrizol)",
                  "Adhesive layer (USA Ashland)",
                  "Release film"
                ].map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-white/70 text-sm">{layer}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {["Protective", "Self-Healing", "TPU", "Adhesive", "Release"].map((label, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-32 rounded-sm ${
                      idx === 0 ? 'bg-emerald-400/80' :
                      idx === 1 ? 'bg-emerald-400/60' :
                      idx === 2 ? 'bg-emerald-400/40' :
                      idx === 3 ? 'bg-emerald-400/25' :
                      'bg-emerald-400/10'
                    }`}
                  />
                  <span className="text-white/50 text-xs mt-2 writing-vertical">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-black" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">PRODUCTS</p>
              <h2 className="text-4xl md:text-5xl font-light text-white">Choose Your Protection</h2>
            </div>
            <Link to="/products" className="text-white/50 hover:text-white text-sm tracking-wider transition-colors">
              View All Products →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <Link to="/products" key={idx} className="group" data-testid={`product-${idx}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-medium">{product.title}</h3>
                    <p className="text-white/60 text-sm mt-2">{product.desc}</p>
                    <span className="text-emerald-400 text-sm mt-4 inline-block">Explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Colors Preview */}
      <section className="py-24 bg-zinc-950" data-testid="colors-section">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">COLORS</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8">200+ Premium Finishes</h2>
          <div className="flex justify-center gap-2 mb-8">
            {["#1a1a1a", "#3d3d3d", "#8b4513", "#1e3a5f", "#4a0000", "#2d4a2d", "#4a4a00", "#3d1a4a"].map((color, idx) => (
              <div key={idx} className="w-12 h-12 rounded-full border-2 border-white/20" style={{ backgroundColor: color }} />
            ))}
          </div>
          <Link to="/colors" className="inline-block px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all">
            View Color Gallery
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-black" data-testid="partners-section">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">PARTNERS</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-12">Authorised Resellers</h2>
          <div className="flex justify-center gap-12">
            <a href="https://northshoreppf.com.au/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-lg transition-colors">
              NorthShore PPF
            </a>
            <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-lg transition-colors">
              DIYPPFKIT.com.au
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Ready to Protect Your Investment?</h2>
          <p className="text-white/60 text-lg mb-10">
            Get in touch with our team to discuss the best protection solution for your vehicle.
          </p>
          <Link
            to="/contact"
            data-testid="cta-contact-btn"
            className="inline-block px-10 py-4 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

// Products Page
const Products = () => {
  const products = [
    {
      id: "gloss",
      title: "Gloss Series",
      subtitle: "Crystal-Clear Protection",
      desc: "Our flagship Gloss Series delivers showroom-perfect shine with invisible protection. Engineered with premium Lubrizol TPU and self-healing technology, it maintains your vehicle's original finish while protecting against stone chips, scratches, and environmental damage.",
      features: ["Self-healing technology", "10-year warranty", "Crystal-clear transparency", "UV protection"],
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "satin",
      title: "Pro Satin Matte",
      subtitle: "Sophisticated Transformation",
      desc: "Transform your vehicle with our Pro Satin Matte film. This premium finish delivers a sophisticated, factory-style satin appearance while providing the same legendary protection as our Gloss Series.",
      features: ["Matte finish transformation", "Self-healing capability", "10-year warranty", "Satin texture retention"],
      image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "colored",
      title: "Colored Series",
      subtitle: "Express Your Style",
      desc: "With over 200 premium colors available, our Colored Series lets you completely transform your vehicle while maintaining full PPF protection. From classic metallics to bold custom shades.",
      features: ["200+ color options", "Full PPF protection", "Color-stable formula", "10-year warranty"],
      image: "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="products-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">OUR PRODUCTS</p>
        <h1 className="text-5xl md:text-6xl font-light text-white mb-6">Protection Solutions</h1>
        <p className="text-white/60 text-lg max-w-2xl mb-16">
          Every Vetrox product is engineered with premium materials and backed by our comprehensive 10-year warranty.
        </p>

        <div className="space-y-24">
          {products.map((product, idx) => (
            <div key={product.id} className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} data-testid={`product-detail-${product.id}`}>
              <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                <h2 className="text-3xl text-white mb-2">{product.title}</h2>
                <p className="text-emerald-400 text-sm tracking-wider mb-6">{product.subtitle}</p>
                <p className="text-white/60 leading-relaxed mb-8">{product.desc}</p>
                <div className="space-y-3 mb-8">
                  {product.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 border border-emerald-400 text-emerald-400 text-sm tracking-wider hover:bg-emerald-400 hover:text-black transition-all"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Colors Page
const Colors = () => {
  const colorCategories = [
    {
      name: "Classic",
      colors: ["#1a1a1a", "#2d2d2d", "#404040", "#666666", "#808080", "#ffffff"]
    },
    {
      name: "Metallic",
      colors: ["#4a4a4a", "#5c5c5c", "#787878", "#8b8b8b", "#b8b8b8", "#d4d4d4"]
    },
    {
      name: "Earth Tones",
      colors: ["#8b4513", "#a0522d", "#cd853f", "#d2691e", "#deb887", "#f5deb3"]
    },
    {
      name: "Blues",
      colors: ["#0a1929", "#1e3a5f", "#2c5282", "#3182ce", "#4299e1", "#90cdf4"]
    },
    {
      name: "Reds",
      colors: ["#4a0000", "#7b0000", "#a30000", "#c53030", "#e53e3e", "#fc8181"]
    },
    {
      name: "Greens",
      colors: ["#1a3c1a", "#2d4a2d", "#38a169", "#48bb78", "#68d391", "#9ae6b4"]
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="colors-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">COLOR GALLERY</p>
        <h1 className="text-5xl md:text-6xl font-light text-white mb-6">200+ Premium Finishes</h1>
        <p className="text-white/60 text-lg max-w-2xl mb-16">
          From classic metallics to bold custom shades, find the perfect color to transform your vehicle.
        </p>

        <div className="space-y-12">
          {colorCategories.map((category) => (
            <div key={category.name} data-testid={`color-category-${category.name.toLowerCase()}`}>
              <h3 className="text-white text-xl mb-6">{category.name}</h3>
              <div className="flex flex-wrap gap-4">
                {category.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/60 mb-6">Don't see your perfect color? We offer custom color matching.</p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all"
          >
            Request Custom Color
          </Link>
        </div>
      </div>
    </div>
  );
};

// About Page
const About = () => {
  return (
    <div className="min-h-screen bg-black pt-24" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">ABOUT VETROX</p>
        <h1 className="text-5xl md:text-6xl font-light text-white mb-6">Australian Excellence</h1>
        
        <div className="grid md:grid-cols-2 gap-16 mt-16">
          <div>
            <h2 className="text-2xl text-white mb-6">Our Story</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Vetrox was founded with a simple mission: to provide Australian vehicle owners with the highest quality paint protection film available. We believe that protecting your investment shouldn't mean compromising on quality or appearance.
            </p>
            <p className="text-white/60 leading-relaxed mb-6">
              Our films are engineered using the finest materials, including Lubrizol TPU substrate and USA Ashland adhesive, ensuring benchmark performance that exceeds industry standards.
            </p>
            <p className="text-white/60 leading-relaxed">
              Every Vetrox product is backed by our comprehensive 10-year warranty, giving you peace of mind that your investment is protected.
            </p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Premium vehicle protection"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            { number: "10", label: "Year Warranty", suffix: "+" },
            { number: "200", label: "Color Options", suffix: "+" },
            { number: "100", label: "Satisfied Customers", suffix: "%" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-8 border border-white/10">
              <div className="text-5xl text-emerald-400 font-light mb-2">
                {stat.number}<span className="text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-white/60 text-sm tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-white mb-8">Why Choose Vetrox?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Premium Materials", desc: "Lubrizol TPU substrate with USA Ashland adhesive" },
              { title: "Self-Healing Technology", desc: "Minor scratches disappear with heat application" },
              { title: "Crystal Clear Finish", desc: "Virtually invisible protection that enhances your paint" },
              { title: "UV Protection", desc: "Prevents yellowing and maintains clarity for years" },
              { title: "Hydrophobic Coating", desc: "Water beads off, keeping your car cleaner longer" },
              { title: "Professional Network", desc: "Authorized installers across Australia" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 border border-white/10">
                <span className="text-emerald-400 text-xl">✓</span>
                <div>
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page with Enquiry Form
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_make: "",
    vehicle_model: "",
    service_type: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/enquiry`, formData);
      console.log("Enquiry submitted:", response.data);
      setSubmitted(true);
      toast.success("Enquiry submitted successfully! We'll be in touch soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle_make: "",
        vehicle_model: "",
        service_type: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    "Full Vehicle PPF",
    "Partial PPF (Front End)",
    "Gloss Series",
    "Pro Satin Matte",
    "Colored PPF",
    "Custom Color Match",
    "Other / Not Sure"
  ];

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CONTACT US</p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6">Get in Touch</h1>
            <p className="text-white/60 text-lg mb-12">
              Ready to protect your investment? Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-white font-medium mb-2">Email</h3>
                <a href="mailto:admin@vetrox.com.au" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  admin@vetrox.com.au
                </a>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <p className="text-white/60">Australia</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Authorised Partners</h3>
                <div className="space-y-2">
                  <a href="https://northshoreppf.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white transition-colors">
                    NorthShore PPF →
                  </a>
                  <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white transition-colors">
                    DIYPPFKIT.com.au →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-zinc-900 p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-12" data-testid="form-success">
                <div className="text-emerald-400 text-6xl mb-6">✓</div>
                <h3 className="text-2xl text-white mb-4">Thank You!</h3>
                <p className="text-white/60 mb-8">
                  Your enquiry has been received. Our team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="enquiry-form">
                <h2 className="text-2xl text-white mb-8">Request a Quote</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        data-testid="input-name"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        data-testid="input-email"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        data-testid="input-phone"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                        placeholder="+61 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Service Type</label>
                      <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        data-testid="input-service-type"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select a service</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Vehicle Make</label>
                      <input
                        type="text"
                        name="vehicle_make"
                        value={formData.vehicle_make}
                        onChange={handleChange}
                        data-testid="input-vehicle-make"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                        placeholder="e.g., BMW, Mercedes, Tesla"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Vehicle Model</label>
                      <input
                        type="text"
                        name="vehicle_model"
                        value={formData.vehicle_model}
                        onChange={handleChange}
                        data-testid="input-vehicle-model"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                        placeholder="e.g., M3, C63, Model S"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      data-testid="input-message"
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="submit-enquiry-btn"
                    className="w-full px-8 py-4 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Products />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
