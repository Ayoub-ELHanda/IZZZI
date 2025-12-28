import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';

export default function HomePage() {
  return (
    <div className="bg-[#FFF9D8] min-h-screen relative overflow-hidden">
      {/* Decorative curved line in top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none overflow-hidden">
        <svg className="absolute -top-20 -right-20" width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M800 0Q800 200 600 400T200 800" stroke="#FFE8A3" strokeWidth="100" opacity="0.4" fill="none"/>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="px-[80px] pt-[120px] pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 max-w-[550px]">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
              Collectez{' '}
              <span className="text-orange-500">?</span>
              <br />
              les{' '}
              <span className="relative inline-block">
                <span className="relative z-10">retours</span>
                <span className="absolute bottom-1 left-0 w-full h-4 bg-orange-500 -z-0"></span>
              </span>{' '}
              des
              <br />
              étudiants en live
            </h1>
            
            <div className="space-y-2 text-gray-800 text-lg pt-1">
              <p className="flex items-center gap-2">
                <span className="text-orange-500 font-bold text-xl">+</span> de retours d'étudiants
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500 font-bold text-xl">+</span> de satisfaction
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link href={routes.auth.register}>
                <button className="bg-[#FFD93D] hover:bg-[#FFC933] text-gray-900 px-8 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                  Essayez gratuitement
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
              <p className="text-sm text-gray-700 max-w-md leading-relaxed">
                C'est gratuit. 4 mois en illimité. Sans carte. Vos premiers retours sont immédiats.
              </p>
            </div>

            {/* Lightning bolt decoration */}
            <div className="pt-4">
              <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 5L15 35H30L20 75L35 45H20L30 15L25 5Z" fill="#FFD93D" stroke="#FF8C42" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Right Content - Composite Image */}
          <div className="relative w-full h-[800px] flex items-center">
            <div className="relative w-full h-full">
              <Image
                src="/Compo.png"
                alt="IZZZI Platform Mockups"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner - Slanted (Right after Hero) */}
      <section className="relative w-full overflow-hidden mb-16">
        <div 
          className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white"
          style={{
            width: '100vw',
            height: '53px',
            transform: 'rotate(-3deg)',
            transformOrigin: 'center',
            marginLeft: 'calc(-50vw + 50%)',
          }}
        >
          <div 
            className="flex items-center justify-center h-full px-8"
            style={{ transform: 'rotate(3deg)', transformOrigin: 'center' }}
          >
            <div className="flex items-center gap-4 text-sm font-bold whitespace-nowrap">
              <span>100% Made in france</span>
              <span className="text-white/60">•</span>
              <span>Assistance via IA</span>
              <span className="text-white/60">•</span>
              <span>Retours sincères</span>
              <span className="text-white/60">•</span>
              <span>Qualiopi Friendly</span>
              <span className="text-white/60">•</span>
              <span>Double satisfaction</span>
              <span className="text-white/60">•</span>
              <span>Pôle qualité</span>
              <span className="text-white/60">•</span>
              <span>Version gratuite à vie</span>
              <span className="text-white/60">•</span>
              <span>+73% de retours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Amélioration continue */}
            <div className="bg-[#FFE566] rounded-3xl p-8 relative">
              <p className="text-xs italic text-gray-700 absolute top-4 right-8">Ils seront plus motivés</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Amélioration<br />continue
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                Améliorez vos cours pendant qu'ils sont en cours. Recueillez les retours à chaud, ajustez immédiatement. Ne laissez pas vos étudiants repartir déçus.
              </p>
              <p className="text-xs italic text-gray-600 mt-4">Meilleur ancrage !</p>
            </div>

            {/* Double satisfaction */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 relative">
              <p className="text-xs italic text-gray-700 absolute top-4 right-8">Meilleure musique !</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Double<br />satisfaction
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                Vos étudiants sont écoutés. Vous intervenez au bon moment. Résultat : un vrai sentiment d'écoute et une progression immédiate.
              </p>
            </div>

            {/* L'IA est là pour vous assister */}
            <div className="bg-[#FF6B35] rounded-3xl p-8 text-white relative">
              <p className="text-xs italic absolute top-4 right-8">Vous n'avez pas de temps !</p>
              <h3 className="text-2xl font-bold mb-4 mt-8">
                L'IA est là pour<br />vous assister
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                Elle repère les retours sensibles, vous notifie et vous aide à formuler une réponse efficace.
              </p>
            </div>

            {/* Qualiopi Friendly */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Qualiopi Friendly
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed mb-4">
                Les deux indicateurs principaux de Qualiopi validé avec un seul outil.
              </p>
              <p className="text-xs text-gray-700 mb-1">Indicateur 30 : Recueil des appréciations</p>
              <p className="text-xs text-gray-700">Indicateur 31 : Traitement des réclamations</p>
            </div>

            {/* Retours garantis 100% sincères */}
            <div className="bg-[#FF9500] rounded-3xl p-8 text-white relative">
              <p className="text-xs italic text-gray-900 absolute top-4 right-8">Meilleure pas là-bas !</p>
              <h3 className="text-2xl font-bold mb-4 mt-4">
                Retours garantis<br />100% sincères
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                Des retours vraiment libres, vos étudiants répondent sans compte, en toute confidentialité. Les retours sont anonymes par défaut.
              </p>
            </div>

            {/* Prêt en 10 minutes chrono */}
            <div className="bg-[#FFE566] rounded-3xl p-8 relative">
              <p className="text-xs italic text-gray-700 absolute top-4 right-8">C'est trop facile !</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Prêt en 10<br />minutes chrono.
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                Import CSV, génération automatique de QR code, lien à partager. Vos étudiants accèdent directement à leur formulaire, sans friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-md">
              <h2 className="text-6xl font-bold text-gray-900 mb-2">+73%</h2>
              <p className="text-xl font-semibold text-gray-900 mb-4">
                de retours collectés en moyenne*
              </p>
              <p className="text-gray-700 mb-6">
                Les étudiants savent que leur avis change leur cours, pas celui du prochain semestre.
              </p>
              <p className="text-gray-700 mb-4">
                Résultat : ils répondent plus, mieux, et plus vite.
              </p>
              <p className="text-xs text-gray-500 italic">
                *par rapport aux méthodes conventionnelles
              </p>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              <Image
                src="/students discussing.jpg"
                alt="Students discussing"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-20 mx-8 rounded-3xl my-20 relative overflow-hidden">
        <div className="absolute top-8 left-8">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 5L15 35H30L20 75L35 45H20L30 15L25 5Z" fill="#FFD93D" stroke="#FF8C42" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="container mx-auto px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Créez une classe test<br />en quelques minutes.
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            C'est gratuit. 4 mois en illimité. Sans carte.<br />
            Vos premiers retours sont immédiats.
          </p>
          <Link href={routes.auth.register}>
            <button className="bg-[#FFD93D] hover:bg-[#FFC933] text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl">
              Créer une classe gratuitement
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>
        <div className="absolute bottom-8 right-8">
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30Q20 10 40 20T70 30" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </section>
    </div>
  );
}
