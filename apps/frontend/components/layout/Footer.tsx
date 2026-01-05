// Footer component
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <>
      {/* Decorative Hashtags Section - Above Footer */}
      <section className="relative w-full h-[250px] bg-gradient-to-b from-white to-[#FFF9D8] overflow-hidden">
        {/* Hashtag Pills */}
        <div 
          className="absolute bg-[#FFD93D] px-8 py-4 rounded-full font-bold text-gray-900 shadow-lg"
          style={{ 
            top: '80px', 
            left: '5%', 
            transform: 'rotate(-25deg)',
            fontSize: '18px'
          }}
        >
          #Love
        </div>

        <div 
          className="absolute bg-white px-6 py-3 rounded-full text-gray-800 shadow-md"
          style={{ 
            top: '100px', 
            left: '18%',
            fontSize: '16px'
          }}
        >
          IA + education = &lt;3
        </div>

        <div 
          className="absolute bg-[#FF8C42] px-10 py-5 rounded-full font-bold text-gray-900 shadow-lg"
          style={{ 
            top: '60px', 
            left: '35%', 
            transform: 'rotate(-15deg)',
            fontSize: '18px'
          }}
        >
          #QualiopiFriendly
        </div>

        <div 
          className="absolute bg-[#FFD93D] px-8 py-4 rounded-full font-bold text-gray-900 shadow-lg"
          style={{ 
            top: '40px', 
            left: '52%', 
            transform: 'rotate(15deg)',
            fontSize: '18px'
          }}
        >
          #Simple
        </div>

        <div 
          className="absolute bg-white px-6 py-3 rounded-full text-gray-800 shadow-md"
          style={{ 
            top: '100px', 
            left: '62%',
            fontSize: '16px'
          }}
        >
          #DoubleSatisfaction
        </div>

        <div 
          className="absolute bg-[#FF8C42] px-8 py-4 rounded-full font-bold text-gray-900 shadow-lg"
          style={{ 
            top: '70px', 
            left: '75%', 
            transform: 'rotate(20deg)',
            fontSize: '18px'
          }}
        >
          #LiveReview
        </div>

        <div 
          className="absolute bg-[#FFD93D] px-8 py-4 rounded-full font-bold text-gray-900 shadow-lg"
          style={{ 
            top: '20px', 
            left: '88%', 
            transform: 'rotate(35deg)',
            fontSize: '18px'
          }}
        >
          #Sincère
        </div>

        {/* Orange Bar at bottom */}
        <div className="absolute bottom-0 w-full h-2 bg-[#F26103]"></div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F26103] text-white">
        <div className="max-w-7xl mx-auto px-[80px] py-16">
          <div className="relative min-h-[280px]">
            <div className="flex items-start justify-between">
              {/* Left - Logo */}
              <div className="flex-shrink-0">
                <Image 
                  src="/logo-footre.png" 
                  alt="IZZZI Logo" 
                  width={150} 
                  height={50}
                  className="object-contain"
                />
              </div>

              {/* Right - Navigation sections */}
              <div className="flex gap-32">
                {/* Plan du site */}
                <div>
                  <h4 className="font-semibold text-white mb-4 text-base">Plan du site</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/pricing" prefetch={true} className="text-white hover:text-white/80 text-sm transition-colors">
                        Nos tarifs
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/register" prefetch={true} className="text-white hover:text-white/80 text-sm transition-colors">
                        S'inscrire
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/login" prefetch={true} className="text-white hover:text-white/80 text-sm transition-colors">
                        Se connecter
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Nous contacter */}
                <div>
                  <h4 className="font-semibold text-white mb-4 text-base">Nous contacter</h4>
                  <a 
                    href="mailto:hello@izzzi.io" 
                    className="inline-block text-white text-sm border-2 border-white rounded-lg px-6 py-2 hover:bg-white hover:text-[#F26103] transition-colors"
                  >
                    hello@izzzi.io
                  </a>
                </div>
              </div>
            </div>

            {/* Legal Links - Bottom Right */}
            <div className="absolute bottom-0 right-0 flex gap-8">
              <Link href="/legal/mentions" prefetch={true} className="text-white hover:text-white/80 text-sm transition-colors">
                Mentions légales
              </Link>
              <Link href="/legal/faq" prefetch={true} className="text-white hover:text-white/80 text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

