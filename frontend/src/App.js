import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Helmet } from "react-helmet";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Image URLs - Updated per user request
const IMAGES = {
  hero: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920",
  gloss: "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800",
  satin: "https://customer-assets.emergentagent.com/job_wake-the-agent/artifacts/5cxy6kjk_new-gallery6.jpg",
  coloured: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800"
};

// SEO Component
const SEOHead = ({ title, description, keywords }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_AU" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://vetrox.com.au" />
  </Helmet>
);

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/products", label: "PRODUCTS" },
    { path: "/colours", label: "COLOURS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="logo-text text-2xl font-bold tracking-[0.3em] text-white" data-testid="logo">
          VETROX
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-${link.label.toLowerCase()}`}
              className={`nav-link text-sm tracking-wider transition-colors ${
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
          className="hidden md:block px-6 py-2 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all font-medium"
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
          <h3 className="logo-text text-xl font-bold tracking-[0.2em] text-white mb-4">VETROX</h3>
          <p className="text-white/50 text-sm">Premium Paint Protection Film</p>
          <p className="text-white/50 text-sm">Best PPF Quality in Australia</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">PRODUCTS</h4>
          <div className="space-y-2">
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colours">Gloss PPF</Link>
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colours">Matte PPF</Link>
            <Link to="/products" className="block text-white/50 text-sm hover:text-white transition-colours">Coloured Car Wrap</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">COMPANY</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-white/50 text-sm hover:text-white transition-colours">About Us</Link>
            <Link to="/contact" className="block text-white/50 text-sm hover:text-white transition-colours">Contact</Link>
            <Link to="/colours" className="block text-white/50 text-sm hover:text-white transition-colours">Colour Gallery</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-medium mb-4">PARTNERS</h4>
          <div className="space-y-2">
            <a href="https://ppfdetailing.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/50 text-sm hover:text-white transition-colours">NorthShore PPF</a>
            <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/50 text-sm hover:text-white transition-colours">DIYPPFKIT.com.au</a>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-emerald-400 text-sm">Become a PPF Reseller</p>
            <Link to="/contact" className="text-white/50 text-xs hover:text-white">Apply now →</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-8 text-center">
        <p className="text-white/30 text-sm">© 2024 Vetrox PPF Australia. Premium Car Wrap & Paint Protection Film.</p>
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
    { title: "Gloss Series", desc: "Crystal-clear protection with showroom shine", image: IMAGES.gloss },
    { title: "Pro Satin Matte", desc: "Sophisticated matte car transformation", image: IMAGES.satin },
    { title: "Coloured Series", desc: "200+ colours to wrap your car", image: IMAGES.coloured },
  ];

  return (
    <div className="min-h-screen bg-black">
      <SEOHead 
        title="Vetrox PPF Australia | Best Paint Protection Film & Car Wrap"
        description="Premium PPF and car wrap solutions in Australia. Best quality paint protection film with 10-year warranty. Self-healing, matte car wraps, coloured PPF. Become a reseller today."
        keywords="PPF Australia, paint protection film, car wrap, matte car, wrap car, best PPF film, PPF reseller, car wrap Australia, vehicle protection, self-healing PPF, 10 year warranty PPF"
      />
      
      {/* Hero Section - Fixed padding */}
      <section className="relative h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Premium PPF car wrap protection Australia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-32">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-6">PREMIUM PAINT PROTECTION FILM</p>
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-none mb-8">
            <span className="italic">INVISIBLE</span><br />
            <span className="italic">ARMOUR.</span><br />
            <span className="text-emerald-400 italic">TIMELESS</span><br />
            <span className="text-emerald-400 italic">SHINE.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-10">
            Australia's best PPF with unmatched clarity, self-healing technology, and a 10-year warranty. Premium car wrap and matte car solutions.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/products')}
              data-testid="hero-explore-btn"
              className="px-8 py-3 bg-white text-black text-sm tracking-wider hover:bg-white/90 transition-all font-medium"
            >
              EXPLORE PRODUCTS
            </button>
            <button 
              onClick={() => navigate('/contact')}
              data-testid="hero-quote-btn"
              className="px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all font-medium"
            >
              GET A QUOTE
            </button>
          </div>
          <div className="mt-12">
            <span className="warranty-badge">
              <span className="text-emerald-400">●</span>
              10 Year Warranty
            </span>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-zinc-950" data-testid="technology-section">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">TECHNOLOGY</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Best Quality PPF Engineering</h2>
          
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
                Vetrox PPF utilises Lubrizol TPU substrate with USA Ashland adhesive, delivering benchmark performance for top-tier automotive protection. The best PPF quality available in Australia.
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
              <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CAR WRAP & PPF PRODUCTS</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Choose Your Protection</h2>
            </div>
            <Link to="/products" className="text-white/50 hover:text-white text-sm tracking-wider transition-colours">
              View All Products →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <Link to="/products" key={idx} className="group" data-testid={`product-${idx}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.title} - PPF car wrap Australia`}
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

      {/* Colours Preview */}
      <section className="py-24 bg-zinc-950" data-testid="colours-section">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CAR WRAP COLOURS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">200+ Premium Finishes</h2>
          <div className="flex justify-center gap-2 mb-8">
            {["#1a1a1a", "#3d3d3d", "#8b4513", "#1e3a5f", "#4a0000", "#2d4a2d", "#4a4a00", "#3d1a4a"].map((colour, idx) => (
              <div key={idx} className="w-12 h-12 rounded-full border-2 border-white/20" style={{ backgroundColor: colour }} />
            ))}
          </div>
          <Link to="/colours" className="inline-block px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all font-medium">
            View Colour Gallery
          </Link>
        </div>
      </section>

      {/* Resellers Section */}
      <section className="py-16 bg-emerald-900/20 border-y border-emerald-500/20" data-testid="resellers-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl text-white mb-4">Become a PPF Reseller</h3>
          <p className="text-white/60 mb-6">
            We welcome authorised PPF resellers across Australia. Join our network and offer premium car wrap and paint protection film solutions to your customers.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all font-medium"
          >
            Apply to Become a Reseller
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-black" data-testid="partners-section">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">PARTNERS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Authorised PPF Resellers</h2>
          <div className="flex justify-center gap-12">
            <a href="https://ppfdetailing.com.au/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-lg transition-colours">
              NorthShore PPF
            </a>
            <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-lg transition-colours">
              DIYPPFKIT.com.au
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Wrap Your Car?</h2>
          <p className="text-white/60 text-lg mb-10">
            Get in touch with our team to discuss the best PPF and car wrap solution for your vehicle.
          </p>
          <Link
            to="/contact"
            data-testid="cta-contact-btn"
            className="inline-block px-10 py-4 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all font-medium"
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
      subtitle: "Crystal-Clear PPF Protection",
      desc: "Our flagship Gloss Series delivers showroom-perfect shine with invisible protection. Engineered with premium Lubrizol TPU and self-healing technology, it maintains your vehicle's original finish while protecting against stone chips, scratches, and environmental damage. The best quality PPF available in Australia.",
      features: ["Self-healing technology", "10-year warranty", "Crystal-clear transparency", "UV protection"],
      image: IMAGES.gloss
    },
    {
      id: "satin",
      title: "Pro Satin Matte",
      subtitle: "Matte Car Transformation",
      desc: "Transform your vehicle with our Pro Satin Matte film. This premium finish delivers a sophisticated, factory-style matte car appearance while providing the same legendary protection as our Gloss Series. Perfect for those who want to wrap their car with a unique matte finish.",
      features: ["Matte finish transformation", "Self-healing capability", "10-year warranty", "Satin texture retention"],
      image: IMAGES.satin
    },
    {
      id: "coloured",
      title: "Coloured Series",
      subtitle: "Car Wrap in 200+ Colours",
      desc: "With over 200 premium colours available, our Coloured Series lets you completely wrap your car while maintaining full PPF protection. From classic metallics to bold custom shades - the ultimate car wrap solution in Australia.",
      features: ["200+ colour options", "Full PPF protection", "Colour-stable formula", "10-year warranty"],
      image: IMAGES.coloured
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="products-page">
      <SEOHead 
        title="PPF Products Australia | Car Wrap, Matte Car, Paint Protection Film"
        description="Premium PPF products including gloss, matte car wraps, and coloured car wrap films. Best quality paint protection film with 10-year warranty in Australia."
        keywords="PPF products, car wrap, matte car, wrap car, paint protection film Australia, gloss PPF, matte PPF, coloured car wrap"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CAR WRAP & PPF PRODUCTS</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Protection Solutions</h1>
        <p className="text-white/60 text-lg max-w-2xl mb-16">
          Every Vetrox product is engineered with premium materials and backed by our comprehensive 10-year warranty. The best PPF quality in Australia.
        </p>

        <div className="space-y-24">
          {products.map((product, idx) => (
            <div key={product.id} className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`} data-testid={`product-detail-${product.id}`}>
              <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                <img
                  src={product.image}
                  alt={`${product.title} - PPF car wrap Australia`}
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
                  className="inline-block px-8 py-3 border border-emerald-400 text-emerald-400 text-sm tracking-wider hover:bg-emerald-400 hover:text-black transition-all font-medium"
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

// Colours Page with TOP-TPU Color Chart
const Colours = () => {
  const colourCategories = [
    {
      name: "Whites & Pearls",
      colours: [
        { name: "TPU Pearl White", code: "TPU-HZ-1" },
        { name: "TPU Crystal White", code: "TPU-HZ-2" },
        { name: "TPU High Elegant White", code: "TPU-HZ-3" },
        { name: "TPU Pearlescent White", code: "TPU-HZ-4" },
        { name: "TPU Bright Moon White", code: "TPU-HZ-10" },
        { name: "TPU Razer White", code: "TPU-HZ-11" },
        { name: "TPU Pepper White", code: "TPU-HZ-12" },
      ]
    },
    {
      name: "Diamond Series",
      colours: [
        { name: "TPU Red Diamond", code: "TPU-HZ-5" },
        { name: "TPU Green Diamond", code: "TPU-HZ-6" },
        { name: "TPU Purple Diamond", code: "TPU-HZ-7" },
        { name: "TPU Diamond White Pink", code: "TPU-HZ-8" },
        { name: "TPU Diamond White Blue", code: "TPU-HZ-9" },
        { name: "TPU Diamond Aurora Green", code: "TPU-HZ-85" },
        { name: "TPU Diamond Blue", code: "TPU-HZ-101" },
      ]
    },
    {
      name: "Yellows & Oranges",
      colours: [
        { name: "TPU Sahara Yellow", code: "TPU-HZ-13" },
        { name: "TPU Cuban Sand", code: "TPU-HZ-14" },
        { name: "TPU Desert Yellow", code: "TPU-HZ-15" },
        { name: "TPU Milan Gold", code: "TPU-HZ-16" },
        { name: "TPU Sunflower Yellow", code: "TPU-HZ-18" },
        { name: "TPU McLaren Orange", code: "TPU-HZ-19" },
        { name: "TPU Racing Orange", code: "TPU-HZ-20" },
        { name: "TPU Lava Orange", code: "TPU-HZ-21" },
        { name: "TPU Coral Orange", code: "TPU-HZ-23" },
      ]
    },
    {
      name: "Pinks & Purples",
      colours: [
        { name: "TPU Laser Rouge Pink", code: "TPU-HZ-24" },
        { name: "TPU Shell Pink", code: "TPU-HZ-25" },
        { name: "TPU Fancy Rouge Pink", code: "TPU-HZ-26" },
        { name: "TPU Sky Mirror Pink", code: "TPU-HZ-29" },
        { name: "TPU Rouge Pearl Pink", code: "TPU-HZ-30" },
        { name: "TPU Iced Berry Pink", code: "TPU-HZ-31" },
        { name: "TPU Provence Purple", code: "TPU-HZ-34" },
        { name: "TPU Beetroot Purple", code: "TPU-HZ-35" },
        { name: "TPU Victoria Secret Purple", code: "TPU-HZ-53" },
      ]
    },
    {
      name: "Reds",
      colours: [
        { name: "TPU Starlight Ruby Red", code: "TPU-HZ-36" },
        { name: "TPU Glazed Tata Red", code: "TPU-HZ-37" },
        { name: "TPU Strawberry Red", code: "TPU-HZ-38" },
        { name: "TPU Ferrari Red", code: "TPU-HZ-39" },
        { name: "TPU Crimson", code: "TPU-HZ-40" },
        { name: "TPU Dracaena Red", code: "TPU-HZ-41" },
        { name: "TPU Renovating Ferrari Red", code: "TPU-HZ-200" },
      ]
    },
    {
      name: "Greens",
      colours: [
        { name: "TPU Turquoise Green", code: "TPU-HZ-55" },
        { name: "TPU Combat Green", code: "TPU-HZ-56" },
        { name: "TPU Khaki Green", code: "TPU-HZ-57" },
        { name: "TPU Armoured Green", code: "TPU-HZ-58" },
        { name: "TPU Mint Green", code: "TPU-HZ-65" },
        { name: "TPU Tiffany", code: "TPU-HZ-66" },
        { name: "TPU Alpine Green", code: "TPU-HZ-72" },
        { name: "TPU British Green", code: "TPU-HZ-80" },
        { name: "TPU Racing Green", code: "TPU-HZ-216" },
      ]
    },
    {
      name: "Blues",
      colours: [
        { name: "TPU Glacier Blue", code: "TPU-HZ-86" },
        { name: "TPU Sea Wind Blue", code: "TPU-HZ-88" },
        { name: "TPU Shark Blue", code: "TPU-HZ-90" },
        { name: "TPU Miami Blue", code: "TPU-HZ-92" },
        { name: "TPU Porcelain Blue", code: "TPU-HZ-94" },
        { name: "TPU Sepang Blue", code: "TPU-HZ-95" },
        { name: "TPU Gentian Blue", code: "TPU-HZ-96" },
        { name: "TPU Byron Bay Blue", code: "TPU-HZ-104" },
        { name: "TPU Neptune Blue", code: "TPU-HZ-236" },
      ]
    },
    {
      name: "Silvers & Golds",
      colours: [
        { name: "TPU Metal Silver", code: "TPU-HZ-108" },
        { name: "TPU GT Silver", code: "TPU-HZ-109" },
        { name: "TPU Akha Gold", code: "TPU-HZ-110" },
        { name: "TPU Champagne Gold", code: "TPU-HZ-111" },
        { name: "TPU Aquila Metal", code: "TPU-HZ-112" },
        { name: "TPU Liquid Aluminium Mercury", code: "TPU-HZ-113" },
        { name: "TPU Liquid Metallic Silver", code: "TPU-HZ-114" },
      ]
    },
    {
      name: "Greys",
      colours: [
        { name: "TPU Agate Grey", code: "TPU-HZ-115" },
        { name: "TPU Silver Fox Grey", code: "TPU-HZ-116" },
        { name: "TPU Cement Light Grey", code: "TPU-HZ-117" },
        { name: "TPU Mystery Grey", code: "TPU-HZ-118" },
        { name: "TPU Nardo Grey", code: "TPU-HZ-120" },
        { name: "TPU Brooklyn Grey", code: "TPU-HZ-123" },
        { name: "TPU Rock Grey", code: "TPU-HZ-124" },
        { name: "TPU Battleship Grey", code: "TPU-HZ-125" },
      ]
    },
    {
      name: "Blacks",
      colours: [
        { name: "TPU Black Rose", code: "TPU-HZ-135" },
        { name: "TPU Metallic Black", code: "TPU-HZ-139" },
        { name: "TPU Coal Grey", code: "TPU-HZ-140" },
        { name: "TPU Pearl Black", code: "TPU-HZ-142" },
        { name: "TPU Blue Crystal Black", code: "TPU-HZ-143" },
        { name: "TPU Santorini Black", code: "TPU-HZ-144" },
        { name: "TPU Obsidian Black", code: "TPU-HZ-145" },
        { name: "TPU Super Black", code: "TPU-HZ-146" },
      ]
    },
    {
      name: "Satin & Matte Finishes",
      colours: [
        { name: "TPU Satin Ceramic White", code: "TPU-HZ-151" },
        { name: "TPU Super Matte White", code: "TPU-HZ-152" },
        { name: "TPU AMG Mountain Grey", code: "TPU-HZ-155" },
        { name: "TPU Matte Dark Silver", code: "TPU-HZ-157" },
        { name: "TPU Satin Racing Blue", code: "TPU-HZ-159" },
        { name: "TPU Satin Army Green", code: "TPU-HZ-161" },
        { name: "TPU Matte Romani Red", code: "TPU-HZ-165" },
        { name: "TPU Super Matte Black", code: "TPU-HZ-177" },
      ]
    },
    {
      name: "Carbon Fibre",
      colours: [
        { name: "TPU Carbon Fibre", code: "TPU-HZ-173" },
        { name: "TPU Transparent Carbon Fibre", code: "TPU-HZ-289" },
        { name: "TPU Flower Carbon Silver", code: "TPU-HZ-290" },
        { name: "TPU Matte Transparent Carbon Fibre", code: "TPU-HZ-292" },
        { name: "TPU Carbon Fibre Liquid Aluminium", code: "TPU-HZ-293" },
      ]
    },
  ];

  const getColourSwatch = (name) => {
    const colourMap = {
      'white': '#f5f5f5', 'pearl': '#faf8f5', 'crystal': '#f0f8ff',
      'red': '#c41e3a', 'ferrari': '#ff2800', 'crimson': '#dc143c', 'ruby': '#e0115f', 'strawberry': '#fc5a8d',
      'green': '#228b22', 'mint': '#98fb98', 'tiffany': '#0abab5', 'alpine': '#4a5d23', 'british': '#004225', 'racing': '#00563f',
      'blue': '#4169e1', 'miami': '#00bfff', 'glacier': '#80d8ff', 'shark': '#1e90ff', 'neptune': '#1f75fe',
      'purple': '#800080', 'violet': '#8b00ff', 'beetroot': '#8e4585',
      'pink': '#ff69b4', 'rouge': '#c71585', 'berry': '#8e4585',
      'yellow': '#ffd700', 'sahara': '#f4a460', 'sunflower': '#ffda03',
      'orange': '#ff8c00', 'coral': '#ff7f50', 'lava': '#ff4500',
      'gold': '#ffd700', 'champagne': '#f7e7ce', 'milan': '#c5b358',
      'silver': '#c0c0c0', 'metal': '#aaa9ad',
      'grey': '#808080', 'gray': '#808080', 'nardo': '#7c7b7a', 'cement': '#857f72',
      'black': '#1a1a1a', 'obsidian': '#0a0a0a', 'coal': '#2c2c2c',
      'matte': '#3d3d3d', 'satin': '#4a4a4a',
      'carbon': '#2b2b2b',
    };
    
    const nameLower = name.toLowerCase();
    for (const [key, value] of Object.entries(colourMap)) {
      if (nameLower.includes(key)) return value;
    }
    return '#666666';
  };

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="colours-page">
      <SEOHead 
        title="Car Wrap Colours Australia | 200+ PPF Colour Options"
        description="Over 200 premium car wrap colours available. From matte car finishes to glossy PPF wraps. Find the perfect colour to wrap your car in Australia."
        keywords="car wrap colours, PPF colours, wrap car colours, matte car colours, car wrap Australia, coloured PPF, vehicle wrap"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CAR WRAP COLOUR GALLERY</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">200+ Premium Finishes</h1>
        <p className="text-white/60 text-lg max-w-2xl mb-16">
          From classic metallics to bold custom shades, find the perfect colour to wrap your car. All colours available in our TOP-TPU range with best quality guarantee.
        </p>

        <div className="space-y-16">
          {colourCategories.map((category) => (
            <div key={category.name} data-testid={`colour-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <h3 className="text-white text-2xl mb-6 border-b border-white/10 pb-4">{category.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {category.colours.map((colour, idx) => (
                  <div
                    key={idx}
                    className="group p-4 border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer"
                  >
                    <div
                      className="w-full h-16 rounded mb-3 border border-white/20"
                      style={{ backgroundColor: getColourSwatch(colour.name) }}
                    />
                    <p className="text-white text-sm font-medium truncate">{colour.name.replace('TPU ', '')}</p>
                    <p className="text-white/40 text-xs">{colour.code}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-12 border border-white/10 bg-zinc-900">
          <h3 className="text-2xl text-white mb-4">Can't Find Your Perfect Colour?</h3>
          <p className="text-white/60 mb-6">We offer custom colour matching services for your car wrap project.</p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all font-medium"
          >
            Request Custom Colour
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
      <SEOHead 
        title="About Vetrox PPF Australia | Best Quality Paint Protection Film"
        description="Vetrox provides Australia's best PPF with 10-year warranty. Premium car wrap and paint protection film solutions. Become a PPF reseller today."
        keywords="about Vetrox, PPF Australia, best PPF quality, car wrap Australia, PPF reseller, paint protection film"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">ABOUT VETROX</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Australian Excellence</h1>
        
        <div className="grid md:grid-cols-2 gap-16 mt-16">
          <div>
            <h2 className="text-2xl text-white mb-6">Our Story</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Vetrox was founded with a simple mission: to provide Australian vehicle owners with the best quality paint protection film and car wrap solutions available. We believe that protecting your investment shouldn't mean compromising on quality or appearance.
            </p>
            <p className="text-white/60 leading-relaxed mb-6">
              Our PPF films are engineered using the finest materials, including Lubrizol TPU substrate and USA Ashland adhesive, ensuring benchmark performance that exceeds industry standards for car wrap and matte car applications.
            </p>
            <p className="text-white/60 leading-relaxed">
              Every Vetrox product is backed by our comprehensive 10-year warranty, giving you peace of mind that your investment is protected.
            </p>
          </div>
          <div>
            <img
              src={IMAGES.hero}
              alt="Premium PPF car wrap protection Australia"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            { number: "10", label: "Year Warranty", suffix: "+" },
            { number: "200", label: "Wrap Colours", suffix: "+" },
            { number: "100", label: "Satisfied Customers", suffix: "%" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-8 border border-white/10">
              <div className="text-5xl text-emerald-400 font-bold mb-2">
                {stat.number}<span className="text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-white/60 text-sm tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reseller CTA */}
        <div className="mt-20 p-12 bg-emerald-900/20 border border-emerald-500/20 text-center">
          <h2 className="text-3xl text-white mb-4">Become a PPF Reseller</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Join our growing network of authorised PPF resellers across Australia. We provide full product training, marketing support, and competitive wholesale pricing for car wrap and paint protection film products.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 transition-all font-medium"
          >
            Become a Reseller
          </Link>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-white mb-8">Why Choose Vetrox PPF?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Best Quality PPF", desc: "Lubrizol TPU substrate with USA Ashland adhesive" },
              { title: "Self-Healing Technology", desc: "Minor scratches disappear with heat application" },
              { title: "Crystal Clear Finish", desc: "Virtually invisible protection that enhances your paint" },
              { title: "UV Protection", desc: "Prevents yellowing and maintains clarity for years" },
              { title: "Hydrophobic Coating", desc: "Water beads off, keeping your car cleaner longer" },
              { title: "Professional Network", desc: "Authorised PPF installers across Australia" }
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

// Contact Page with Updated Enquiry Form
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    enquiry_type: "",
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
        company: "",
        enquiry_type: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const enquiryTypes = [
    "General Enquiry",
    "Product Information",
    "Request a Quote",
    "Find an Installer",
    "Become a Reseller",
    "Warranty Claim"
  ];

  return (
    <div className="min-h-screen bg-black pt-24" data-testid="contact-page">
      <SEOHead 
        title="Contact Vetrox PPF Australia | Get a Quote, Become a Reseller"
        description="Contact us for PPF quotes, product information, find an installer, or become a PPF reseller in Australia. Best car wrap and paint protection film solutions."
        keywords="contact Vetrox, PPF quote, become PPF reseller, find PPF installer, car wrap quote Australia"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-emerald-400 text-sm tracking-[0.3em] mb-4">CONTACT US</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-white/60 text-lg mb-12">
              Ready to protect your vehicle with the best PPF? Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-white font-medium mb-2">Email</h3>
                <a href="mailto:admin@vetrox.com" className="text-emerald-400 hover:text-emerald-300 transition-colours">
                  admin@vetrox.com
                </a>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <p className="text-white/60">PO Box 426 St Ives NSW 2075</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Authorised Partners</h3>
                <div className="space-y-2">
                  <a href="https://ppfdetailing.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white transition-colours">
                    NorthShore PPF →
                  </a>
                  <a href="https://diyppfkit.com.au/" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white transition-colours">
                    DIYPPFKIT.com.au →
                  </a>
                </div>
              </div>
              
              {/* Reseller Notice */}
              <div className="p-6 bg-emerald-900/20 border border-emerald-500/30">
                <h3 className="text-emerald-400 font-medium mb-2">Become a PPF Reseller</h3>
                <p className="text-white/60 text-sm">
                  We welcome PPF resellers across Australia. Select "Become a Reseller" in the enquiry type to learn about partnership opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Enquiry Form - Updated */}
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
                  className="px-8 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all font-medium"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="enquiry-form">
                <h2 className="text-2xl text-white mb-2">Send an Enquiry</h2>
                <div className="warranty-badge mb-8">
                  <span className="text-emerald-400">●</span>
                  10 Year Warranty
                </div>
                
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
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours"
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
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours"
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
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours"
                        placeholder="+61 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        data-testid="input-company"
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Enquiry Type *</label>
                    <select
                      name="enquiry_type"
                      value={formData.enquiry_type}
                      onChange={handleChange}
                      required
                      data-testid="input-enquiry-type"
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours"
                    >
                      <option value="">Select enquiry type</option>
                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colours resize-none"
                      placeholder="Tell us about your enquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="submit-enquiry-btn"
                    className="w-full px-8 py-4 bg-emerald-500 text-white text-sm tracking-wider hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition-all font-medium"
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
          <Route path="/colours" element={<Colours />} />
          <Route path="/colors" element={<Colours />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
