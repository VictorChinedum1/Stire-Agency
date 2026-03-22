import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, CheckCircle2, Share2, Check, Facebook, Twitter, Linkedin, Instagram, Menu, X, Link } from 'lucide-react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ children, className = "" }: { children: string, className?: string }) => {
  return (
    <span className={className}>
      {children.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
          <span className="word inline-block translate-y-full pb-1">{word}</span>
        </span>
      ))}
    </span>
  );
};

interface NewsItem {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  shareCount: number;
  category: string;
}

function NewsCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeShareIndex, setActiveShareIndex] = useState<number | null>(null);
  const [linkCopiedIndex, setLinkCopiedIndex] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchNews = () => {
    setIsLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setNews([
        {
          id: "1",
          title: "10 Web Design Trends Dominating 2026.",
          author: "Sarah Jenkins",
          date: "Mar 18, 2026",
          imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 124,
          category: "Design"
        },
        {
          id: "2",
          title: "Mastering CSS Grid for Complex Layouts.",
          author: "Marcus Chen",
          date: "Mar 15, 2026",
          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 89,
          category: "Development"
        },
        {
          id: "3",
          title: "Why Minimalist Web Design is Here to Stay.",
          author: "Elena Rodriguez",
          date: "Mar 10, 2026",
          imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 256,
          category: "Design"
        },
        {
          id: "4",
          title: "The Psychology of Color in UI/UX.",
          author: "David Kim",
          date: "Mar 05, 2026",
          imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 412,
          category: "UX"
        },
        {
          id: "5",
          title: "Designing for Accessibility: A Practical Guide.",
          author: "Aisha Patel",
          date: "Feb 28, 2026",
          imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 178,
          category: "UX"
        },
        {
          id: "6",
          title: "Micro-interactions That Delight Users.",
          author: "Tom Wilson",
          date: "Feb 20, 2026",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 305,
          category: "UX"
        },
        {
          id: "7",
          title: "Responsive Typography Best Practices.",
          author: "Sarah Jenkins",
          date: "Feb 15, 2026",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 92,
          category: "Design"
        },
        {
          id: "8",
          title: "The Future of AI in Creative Agencies.",
          author: "Marcus Chen",
          date: "Feb 10, 2026",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 534,
          category: "AI"
        },
        {
          id: "9",
          title: "Building Scalable Design Systems.",
          author: "Elena Rodriguez",
          date: "Feb 05, 2026",
          imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 145,
          category: "Design"
        },
        {
          id: "10",
          title: "Animation Performance in Modern Browsers.",
          author: "David Kim",
          date: "Jan 28, 2026",
          imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=400&h=300",
          shareCount: 210,
          category: "Development"
        }
      ]);
      setCurrentPage(1);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyLink = (index: number) => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopiedIndex(index);
    setTimeout(() => setLinkCopiedIndex(null), 2000);
    incrementShareCount(startIndex + index, index);
  };

  const incrementShareCount = (globalIndex: number, localIndex: number) => {
    setNews(prevNews => {
      const newNews = [...prevNews];
      newNews[globalIndex] = {
        ...newNews[globalIndex],
        shareCount: newNews[globalIndex].shareCount + 1
      };
      return newNews;
    });
    
    gsap.fromTo(`.share-count-${localIndex}`, 
      { scale: 1.5, color: '#10b981' }, 
      { scale: 1, color: 'rgba(26, 26, 26, 0.8)', duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const toggleShareMenu = (index: number) => {
    setActiveShareIndex(activeShareIndex === index ? null : index);
  };

  // Pagination logic
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = news.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useGSAP(() => {
    if (currentNews.length > 0) {
      gsap.fromTo('.share-count-text',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, { dependencies: [currentPage, isLoading], scope: containerRef });

  return (
    <div ref={containerRef} className="border-2 border-[#1a1a1a] p-8 md:p-12 bg-white text-[#1a1a1a] relative group transition-colors duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest mb-2 text-[#b89595]">Latest Updates</div>
          <h3 className="text-3xl font-serif font-bold">Industry Insights</h3>
        </div>
        <button 
          onClick={fetchNews}
          disabled={isLoading}
          className="bg-[#1a1a1a] text-[#e5e5e5] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#b89595] hover:text-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#1a1a1a]"
        >
          {isLoading ? "Fetching..." : "Fetch Latest News"}
        </button>
      </div>

      <div className="border-t-2 border-[#1a1a1a] pt-8 min-h-[150px]">
        {selectedArticle ? (
          <div className="animate-in fade-in duration-500">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="mb-6 text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 hover:text-[#1a1a1a] flex items-center gap-2 transition-colors"
            >
              ← Back to News
            </button>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 text-sm font-bold uppercase tracking-widest text-[#b89595]">
                <span>{selectedArticle.category}</span>
              </div>
              <h4 className="text-3xl md:text-4xl font-serif font-bold leading-snug mb-4">{selectedArticle.title}</h4>
              <div className="text-base text-[#1a1a1a]/70 font-mono leading-relaxed flex items-center gap-3 flex-wrap mb-8">
                <span>{selectedArticle.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b89595]"></span>
                <span>By {selectedArticle.author}</span>
              </div>
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title} 
                className="w-full h-64 md:h-96 object-cover rounded-sm border-2 border-[#1a1a1a] mb-8"
                referrerPolicy="no-referrer"
              />
              <div className="prose prose-lg max-w-none text-[#1a1a1a]/80 font-serif">
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t-2 border-[#1a1a1a]/10">
              <h5 className="text-xl font-serif font-bold mb-6">Related Articles</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news
                  .filter(item => item.category === selectedArticle.category && item.id !== selectedArticle.id)
                  .slice(0, 2)
                  .map((relatedItem, idx) => (
                    <div 
                      key={idx} 
                      className="border-2 border-[#1a1a1a]/20 p-4 rounded-sm cursor-pointer hover:border-[#1a1a1a] transition-colors flex gap-4 group/related"
                      onClick={() => {
                        setSelectedArticle(relatedItem);
                        window.scrollTo({ top: containerRef.current?.offsetTop, behavior: 'smooth' });
                      }}
                    >
                      <img 
                        src={relatedItem.imageUrl} 
                        alt={relatedItem.title} 
                        className="w-20 h-20 object-cover rounded-sm shrink-0 border border-[#1a1a1a]/20"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col justify-center">
                        <h6 className="font-semibold text-sm mb-2 line-clamp-2 group-hover/related:text-[#b89595] transition-colors">{relatedItem.title}</h6>
                        <span className="text-xs font-mono text-[#1a1a1a]/60">{relatedItem.date}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : news.length > 0 ? (
          <>
            <ul className="space-y-6">
              {currentNews.map((item, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#1a1a1a]/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row items-start gap-6 w-full">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-sm shrink-0 border border-[#1a1a1a]/20 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedArticle(item)}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#b89595] mb-2">{item.category}</div>
                      <h4 
                        className="text-2xl font-semibold leading-snug mb-3 cursor-pointer hover:text-[#b89595] transition-colors"
                        onClick={() => setSelectedArticle(item)}
                      >
                        {item.title}
                      </h4>
                      <div className="text-base text-[#1a1a1a]/70 font-mono leading-relaxed flex items-center gap-3 flex-wrap">
                        <span>{item.date}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b89595]"></span>
                        <span>By {item.author}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-center shrink-0">
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleCopyLink(index)}
                        className="p-3 hover:bg-[#e5e5e5] rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-[#1a1a1a]/20"
                        title="Copy link"
                      >
                        {linkCopiedIndex === index ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Link className="w-5 h-5 text-[#1a1a1a]" />
                        )}
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => toggleShareMenu(index)}
                          className="p-3 hover:bg-[#e5e5e5] rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-[#1a1a1a]/20"
                          title="Share article"
                        >
                          <Share2 className="w-5 h-5 text-[#1a1a1a]" />
                        </button>
                        
                        {activeShareIndex === index && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] rounded-sm p-1.5 flex gap-1 z-20">
                            <a onClick={() => incrementShareCount(startIndex + index, index)} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#b89595] hover:text-white rounded-full transition-colors text-[#1a1a1a]" title="Share on Facebook">
                              <Facebook className="w-4 h-4" />
                            </a>
                            <a onClick={() => incrementShareCount(startIndex + index, index)} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#b89595] hover:text-white rounded-full transition-colors text-[#1a1a1a]" title="Share on Twitter">
                              <Twitter className="w-4 h-4" />
                            </a>
                            <a onClick={() => incrementShareCount(startIndex + index, index)} href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#b89595] hover:text-white rounded-full transition-colors text-[#1a1a1a]" title="Share on LinkedIn">
                              <Linkedin className="w-4 h-4" />
                            </a>
                            <a onClick={() => incrementShareCount(startIndex + index, index)} href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#b89595] hover:text-white rounded-full transition-colors text-[#1a1a1a]" title="Share on Instagram">
                              <Instagram className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                      <span className={`share-count-text share-count-${index} inline-block text-sm font-mono font-medium text-[#1a1a1a]/80 ml-1 mr-2`}>
                        {item.shareCount}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t-2 border-[#1a1a1a]/10">
                <div className="flex w-full sm:w-auto justify-between gap-4 order-2 sm:order-1">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="px-4 py-3 sm:py-2 text-sm font-bold uppercase tracking-wider border-2 border-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:text-white transition-colors flex-1 sm:flex-none min-h-[44px]"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="px-4 py-3 sm:py-2 text-sm font-bold uppercase tracking-wider border-2 border-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:text-white transition-colors flex-1 sm:flex-none min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-mono border-2 transition-colors ${
                        currentPage === page 
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                          : 'border-transparent hover:border-[#1a1a1a]/30'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-[#1a1a1a]/50 italic font-serif text-lg">
            Click the button above to load the latest articles and insights.
          </p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo('.mobile-nav-link', 
        { y: 40, opacity: 0, scale: 0.8, transformOrigin: 'left center' }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.3 }
      );
      gsap.fromTo('.mobile-contact-info',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.6 }
      );
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { contextSafe } = useGSAP(() => {
    // Lenis setup
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline();

    // Page load sequence
    tl.from('.logo', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.nav-link', { y: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
      .to('.hero-title .word', { y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.2')
      .from('.hero-subtext', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero-cta', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');

    gsap.from('.hero-box', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      delay: 0.5,
    });

    // Scroll Animations for sections
    const sections = gsap.utils.toArray('section:not(.hero-section)');
    sections.forEach((section: any) => {
      // Word-by-word title reveals
      const titles = section.querySelectorAll('.section-title .word');
      if (titles.length > 0) {
        gsap.to(titles, {
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        });
      }

      // Paragraph fades
      const paragraphs = section.querySelectorAll('p:not(.hero-subtext)');
      if (paragraphs.length > 0) {
        gsap.from(paragraphs, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        });
      }
    });

    // Staggered grid boxes
    gsap.from('.grid-box', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.grid-container',
        start: 'top 75%',
      },
    });

    // Offer cards stagger scale from 0.97
    gsap.from('.service-card', {
      scale: 0.97,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-container',
        start: 'top 80%',
      },
    });

    // Layers slide in from alternating left/right with amber underline drawing in on enter
    const layers = gsap.utils.toArray('.layer-card');
    layers.forEach((layer: any, i: number) => {
      const direction = i % 2 === 0 ? -50 : 50;
      const tlLayer = gsap.timeline({
        scrollTrigger: {
          trigger: layer,
          start: 'top 85%',
        }
      });
      
      tlLayer.from(layer, {
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      const underline = layer.querySelector('.amber-underline');
      if (underline) {
        tlLayer.from(underline, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.4');
      }
    });

    // Loop: vertical amber line scales down, then 5 steps stagger in sequentially
    const loopTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.stire-loop-container',
        start: 'top 80%',
      }
    });

    loopTl.from('.loop-line', {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.loop-step', {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=0.4');

    // CTA band: word-by-word headline reveal
    gsap.to('.cta-headline .word', {
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
      }
    });

    // Continuous pulse/color shift for the footer heading
    gsap.to('.work-with-us-heading', {
      color: '#ffffff',
      scale: 1.02,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: 'left center',
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, { scope: container });

  const handleCardHover = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      y: -8,
      boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.12)',
      duration: 0.4,
      ease: 'power3.out'
    });
  });

  const handleCardLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.4,
      ease: 'power3.out'
    });
  });

  const handleNavLinkHover = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  const handleNavLinkLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  const handleMobileLinkHover = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      x: 10,
      transformOrigin: 'left center',
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  const handleMobileLinkLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      x: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  return (
    <div ref={container} className="min-h-screen bg-[#b89595] text-[#1a1a1a] selection:bg-[#1a1a1a] selection:text-[#b89595]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 mix-blend-difference text-white pointer-events-none">
        <div className="logo font-serif text-xl md:text-2xl font-bold tracking-widest pointer-events-auto">STIRE</div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4 md:gap-6 pointer-events-auto">
          <button 
            onClick={() => scrollToSection('services')}
            className="nav-link text-sm font-medium uppercase tracking-wider hover:underline"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkLeave}
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('news')}
            className="nav-link text-sm font-medium uppercase tracking-wider hover:underline"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkLeave}
          >
            News
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="nav-link text-sm font-medium uppercase tracking-wider hover:underline"
            onMouseEnter={handleNavLinkHover}
            onMouseLeave={handleNavLinkLeave}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Mobile Toggle (Fixed Position) */}
      <button 
        className="md:hidden fixed top-4 right-4 z-[100] p-2 mix-blend-difference text-white transition-transform duration-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#1a1a1a] text-[#e5e5e5] z-[60] flex flex-col p-6 pt-24 transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-8 text-4xl font-serif mt-8">
          <button 
            className="mobile-nav-link text-left hover:text-[#b89595] transition-colors" 
            onClick={() => scrollToSection('services')}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
          >
            Services
          </button>
          <button 
            className="mobile-nav-link text-left hover:text-[#b89595] transition-colors" 
            onClick={() => scrollToSection('news')}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
          >
            News
          </button>
          <button 
            className="mobile-nav-link text-left hover:text-[#b89595] transition-colors" 
            onClick={() => scrollToSection('contact')}
            onMouseEnter={handleMobileLinkHover}
            onMouseLeave={handleMobileLinkLeave}
          >
            Contact
          </button>
        </div>
        <div className="mobile-contact-info mt-auto pb-8">
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">Get in touch</p>
          <a href="mailto:hello@stire.agency" className="text-xl border-b border-[#e5e5e5] pb-1 hover:text-[#b89595] hover:border-[#b89595] transition-colors">hello@stire.agency</a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Floating Boxes Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-7xl h-full min-h-[800px]">
            {/* Original Boxes */}
            <div className="hero-box absolute top-[15%] left-[20%] w-32 h-32 bg-[#e5e5e5] opacity-50 mix-blend-overlay"></div>
            <div className="hero-box absolute top-[25%] right-[25%] w-40 h-40 bg-[#e5e5e5] opacity-50 mix-blend-overlay"></div>
            <div className="hero-box absolute bottom-[25%] left-[30%] w-24 h-24 bg-[#e5e5e5] opacity-50 mix-blend-overlay"></div>
            
            {/* New Added Boxes */}
            <div className="hero-box absolute top-[40%] left-[5%] w-48 h-48 bg-[#e5e5e5] opacity-30 mix-blend-overlay"></div>
            <div className="hero-box absolute bottom-[15%] right-[15%] w-56 h-56 bg-[#e5e5e5] opacity-40 mix-blend-overlay"></div>
            <div className="hero-box absolute top-[10%] right-[45%] w-20 h-20 bg-[#e5e5e5] opacity-60 mix-blend-overlay"></div>
            <div className="hero-box absolute bottom-[40%] left-[45%] w-36 h-36 bg-[#e5e5e5] opacity-40 mix-blend-overlay"></div>
            <div className="hero-box absolute top-[60%] right-[35%] w-28 h-28 bg-[#e5e5e5] opacity-50 mix-blend-overlay"></div>
            <div className="hero-box absolute top-[5%] left-[40%] w-16 h-16 bg-[#e5e5e5] opacity-70 mix-blend-overlay"></div>
            <div className="hero-box absolute bottom-[30%] right-[5%] w-32 h-32 bg-[#e5e5e5] opacity-40 mix-blend-overlay"></div>
          </div>
        </div>

        <div className="z-10 text-center px-4 flex flex-col items-center">
          <h1 className="hero-title text-[15vw] md:text-[12vw] lg:text-9xl font-bold text-white tracking-tight mb-6 flex flex-col items-center leading-none">
            <SplitText>STIRE AGENCY</SplitText>
          </h1>
          <p className="hero-subtext text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            We help brands turn attention into results by improving how their design actually performs.
          </p>
          <button className="hero-cta bg-white text-[#1a1a1a] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#b89595] transition-colors border-2 border-transparent hover:border-[#1a1a1a]">
            View Our Work
          </button>
        </div>
      </section>

      {/* Wireframe Grid Section */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-4xl font-serif font-bold mb-12 text-center"><SplitText>Our Capabilities</SplitText></h2>
          <div className="grid-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
            {/* Row 1 */}
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Research &<br/>Insight
            </div>
            <div className="hidden md:block"></div>
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Design<br/>Systems
            </div>
            <div className="hidden md:block"></div>

            {/* Row 2 */}
            <div className="hidden md:block"></div>
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Concept &<br/>Direction
            </div>
            <div className="hidden md:block"></div>
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Digital<br/>Experiences
            </div>

            {/* Row 3 */}
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Brand &<br/>Identity
            </div>
            <div className="hidden md:block"></div>
            <div className="grid-box aspect-square bg-[#e5e5e5] border-2 border-[#1a1a1a] p-4 flex items-center justify-center text-center font-bold uppercase text-sm md:text-base">
              Automation<br/>& AI
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-16 md:py-32 px-4 md:px-12 bg-[#1a1a1a] text-[#b89595]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-3xl md:text-5xl font-serif leading-tight uppercase tracking-wide">
            <SplitText>We design at the intersection of systems and culture, creating work that lives beyond the screen.</SplitText>
          </h2>
          <p className="mt-8 text-sm tracking-widest uppercase font-bold text-white/50">Design That Matters</p>
        </div>
      </section>

      {/* The 3 Layers */}
      <section className="py-16 md:py-32 px-4 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-5xl md:text-7xl font-serif font-bold mb-20"><SplitText>STIRE = 3 Layers</SplitText></h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Experience Design",
                subtitle: "(Front)",
                desc: "What people see and use",
                items: ["UX/UI", "Websites", "Interfaces", "Brand touchpoints"]
              },
              {
                num: "02",
                title: "Brand Systems",
                subtitle: "(Middle)",
                desc: "What people recognize and remember",
                items: ["Identity systems", "Visual language", "Content direction", "Social presence"]
              },
              {
                num: "03",
                title: "Insight Layer",
                subtitle: "(Back — your unfair advantage)",
                desc: "What people actually do",
                items: ["CRM systems", "User behavior tracking", "Analytics dashboards", "Conversion insights"]
              }
            ].map((layer, i) => (
              <div key={i} className="layer-card bg-[#e5e5e5] border-2 border-[#1a1a1a] p-8 relative group hover:bg-[#1a1a1a] hover:text-[#e5e5e5] transition-colors duration-500">
                <div className="text-6xl font-serif opacity-20 absolute top-4 right-4 group-hover:opacity-10 transition-opacity">{layer.num}</div>
                <h3 className="text-2xl font-serif font-bold mb-1 relative inline-block">
                  {layer.title}
                  <div className="amber-underline absolute -bottom-1 left-0 w-full h-1 bg-amber-500"></div>
                </h3>
                <p className="text-sm uppercase tracking-wider mb-8 opacity-70 mt-2">{layer.subtitle}</p>
                
                <ul className="space-y-3 mb-12">
                  {layer.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="absolute bottom-8 left-8 right-8 pt-4 border-t border-current/20 font-medium flex items-center gap-2">
                  <span className="text-xl">👉</span> {layer.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="services" className="py-16 md:py-32 px-4 md:px-12 bg-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-5xl md:text-7xl font-serif font-bold mb-20"><SplitText>Services</SplitText></h2>
          
          <div className="space-y-8 services-container">
            {/* Entry Offer */}
            <div 
              className="service-card border-2 border-[#1a1a1a] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start bg-[#b89595] text-[#1a1a1a]"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="md:w-1/3">
                <div className="text-sm font-bold uppercase tracking-widest mb-2">1. Entry Offer (Hook)</div>
                <h3 className="text-3xl font-serif font-bold mb-4">Low friction.<br/>Gets clients in.</h3>
                <div className="inline-block bg-[#1a1a1a] text-[#b89595] px-4 py-2 text-sm font-bold mt-4">
                  €50–€300 starting phase
                </div>
              </div>
              <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Website audit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Brand audit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> UX teardown</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> "Why your site isn't converting"</li>
                </ul>
                <div className="flex items-end">
                  <p className="text-lg font-serif italic">👉 This builds trust + shows your thinking</p>
                </div>
              </div>
            </div>

            {/* Core Offer */}
            <div 
              className="service-card border-2 border-[#1a1a1a] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start bg-white"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="md:w-1/3">
                <div className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">2. Core Offer (Main Money)</div>
                <h3 className="text-3xl font-serif font-bold mb-4">This is your<br/>main engine.</h3>
                <div className="inline-block bg-[#b89595] text-[#1a1a1a] px-4 py-2 text-sm font-bold mt-4">
                  €500–€3000+
                </div>
              </div>
              <div className="md:w-2/3 grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-4 border-b-2 border-[#1a1a1a] pb-2">Option A: Experience Build</h4>
                  <ul className="space-y-2">
                    <li>• Website / product design</li>
                    <li>• UX/UI system</li>
                    <li>• Brand integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-4 border-b-2 border-[#1a1a1a] pb-2">Option B: Brand System Build</h4>
                  <ul className="space-y-2">
                    <li>• Identity</li>
                    <li>• Visual direction</li>
                    <li>• Content system</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Retainer */}
            <div 
              className="service-card border-2 border-[#1a1a1a] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start bg-[#1a1a1a] text-[#e5e5e5]"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="md:w-1/3">
                <div className="text-sm font-bold uppercase tracking-widest mb-2 text-[#b89595]">3. Retainer</div>
                <h3 className="text-3xl font-serif font-bold mb-4">Where you become dangerous.</h3>
                <p className="text-white/70">This is where STIRE becomes different.</p>
              </div>
              <div className="md:w-2/3 flex flex-col sm:flex-row gap-12">
                <div className="flex-1">
                  <h4 className="font-bold uppercase tracking-wider mb-4 text-[#b89595]">Monthly Service</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#b89595]" /> Track user behavior</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#b89595]" /> Improve conversions</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#b89595]" /> Adjust design based on data</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#b89595]" /> Optimize flows</li>
                  </ul>
                </div>
                <div className="flex-1 bg-white/5 p-6 border border-white/10 stire-loop-container relative pl-10">
                  <div className="loop-line absolute left-6 top-6 bottom-6 w-0.5 bg-amber-500"></div>
                  <h4 className="font-serif text-xl font-bold mb-4 text-white">The STIRE Loop</h4>
                  <ol className="space-y-3 font-mono text-sm">
                    <li className="loop-step relative"><span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>1. Design</li>
                    <li className="loop-step relative"><span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>2. Deploy</li>
                    <li className="loop-step relative"><span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>3. Track (CRM / analytics)</li>
                    <li className="loop-step relative"><span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>4. Learn</li>
                    <li className="loop-step relative"><span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500"></span>5. Refine</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-16 md:py-32 px-4 md:px-12 bg-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-5xl md:text-7xl font-serif font-bold mb-20"><SplitText>Latest News</SplitText></h2>
          <div>
            <NewsCard />
          </div>
        </div>
      </section>

      {/* Target Audience Marquee */}
      <section className="py-12 md:py-20 overflow-hidden bg-[#1a1a1a] text-white border-y-2 border-[#1a1a1a]">
        <div className="flex whitespace-nowrap opacity-50 font-serif text-3xl md:text-5xl italic">
          <div className="animate-marquee inline-block">
            Cafés & coffee shops • Salons and barbershops • Small restaurants • Boutique gyms/fitness • Spas and wellness centres • Small hotels/motels • Clothing/retail boutiques • Med spas • Physical therapy clinics •&nbsp;
          </div>
          <div className="animate-marquee inline-block" aria-hidden="true">
            Cafés & coffee shops • Salons and barbershops • Small restaurants • Boutique gyms/fitness • Spas and wellness centres • Small hotels/motels • Clothing/retail boutiques • Med spas • Physical therapy clinics •&nbsp;
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section id="contact" className="cta-section py-16 md:py-32 px-4 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div>
            <h2 className="cta-headline work-with-us-heading text-6xl md:text-9xl font-serif font-bold leading-none mb-6 text-[#1a1a1a]">
              <SplitText>Work With Us</SplitText>
            </h2>
            <div className="flex flex-col items-start gap-8">
              <a href="mailto:hello@stire.agency" className="text-2xl font-medium border-b-2 border-[#1a1a1a] pb-1 hover:text-[#b89595] hover:border-[#b89595] transition-colors">
                hello@stire.agency
              </a>
              <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors" title="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 aspect-video bg-[#e5e5e5] border-2 border-[#1a1a1a] flex items-center justify-center p-8 text-center">
            <p className="font-serif text-2xl italic">"Ready to turn attention into results?"</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white/50 py-8 px-4 md:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-xl font-bold tracking-widest text-white">STIRE</div>
          <div className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Stire Agency. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}
