// Footer component
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold text-blue-600 mb-4">IZZZI</h3>
            <p className="text-gray-600 text-sm">
              Plateforme de recueil d'avis étudiants pour l'enseignement supérieur
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Produit</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-blue-600 text-sm">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 text-sm">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions" className="text-gray-600 hover:text-blue-600 text-sm">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} IZZZI - Jedy Formation. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

