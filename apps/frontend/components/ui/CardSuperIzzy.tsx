import { Badge } from './Badge';
import { Button } from './Button';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function CardSuperIzzy() {
  return (
    <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-2xl p-8 text-white relative">
      {/* Badge Super Izzzi en haut */}
      <div className="mb-6">
        <Badge variant="yellow">Super Izzzi</Badge>
      </div>
      
      {/* Section estimation du prix */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Estimez le prix de votre abonnement</h3>
        
        {/*Slider de classe - simulation visuelle */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>7 classes</span>
          </div>
          <div className="relative">
            <div className="w-full h-2 bg-orange-300 rounded-full">
              <div className="w-1/3 h-2 bg-white rounded-full relative">
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-orange-500"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-1 opacity-75">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>+20</span>
            </div>
          </div>
        </div>
        
        {/* Prix calculé */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">17€</span>
            <span className="ml-2 opacity-90">par mois / par classe</span>
          </div>
        </div>
      </div>
      
      {/* Bouton principal */}
      <div className="mb-8">
        <Link href={routes.auth.register}>
          <Button 
            className="w-full bg-[#FFE552] text-gray-900 hover:bg-[#FFD700] border-0"
          >
            Je choisis ce plan ↗
          </Button>
        </Link>
      </div>
      
      {/* Section "Tout ce qu'il y a dans le plan gratuit, et en plus:" */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          Tout ce qu'il y a dans le plan gratuit,<br/>
          et en plus:
        </h3>
        
        <ul className="space-y-4">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">Nombre de retours illimité</span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">IA générative pour répondre aux alertes</span><br/>
              <span className="text-sm opacity-90">(un mail prêt à envoyer en un clic)</span>
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">Levée d'anonymat activée par l'étudiant</span><br/>
              <span className="text-sm opacity-90">(Bientôt disponible)</span>
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">Formulaires personnalisables</span><br/>
              <span className="text-sm opacity-90">(Bientôt disponible)</span>
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">Envoi automatique du formulaire</span><br/>
              <span className="text-sm opacity-90">(Bientôt disponible)</span>
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">Branding personnalisé (couleurs, logo)</span><br/>
              <span className="text-sm opacity-90">(Au début et à la fin du cours, etc.)</span>
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">
              <span className="font-medium">Suppression du logo Izzzi</span><br/>
              <span className="text-sm opacity-90">(Bientôt disponible)</span>
            </span>
          </li>
        </ul>
      </div>
      
      {/* Lien vers les détails */}
      <div>
        <Link href="#" className="inline-flex items-center text-white hover:text-yellow-200 underline">
          Voir les détails du plan ↗
        </Link>
      </div>
    </div>
  );
}
