export default function MentionsLegalesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Title */}
      <section className="bg-[#F4F4F4] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-6">
            Mentions légales
          </h1>
          <p className="text-gray-700 text-center leading-relaxed">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en 
            l'économie numérique, il est précisé aux utilisateurs du site izzzi l'identité des différents 
            intervenants dans le cadre de sa réalisation et de son suivi.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="space-y-12">
            {/* Edition du site */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edition du site</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Le présent site, accessible à l'URL www.izzzi.io (le « Site »), est édité par :
                </p>
                <p>
                  Jedy formation, société au capital de 1000 euros, inscrite au R.C.S. de PARIS sous le 
                  numéro Paris B 842017196, dont le siège social est situé au 5 rue de charonne, 75011 Paris, 
                  représenté(e) par Jeremy Serval dûment habilité(e)
                </p>
                <p>
                  Le numéro individuel TVA de l'éditeur est : FR07842017196.
                </p>
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
              <p className="text-gray-700 leading-relaxed">
                Le Site est hébergé par la société OVH SAS, situé 2 rue Kellermann - BP 80157 - 59053 
                Roubaix Cedex 1, (contact téléphonique ou email : 1007).
              </p>
            </div>

            {/* Directeur de publication */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de publication</h2>
              <p className="text-gray-700 leading-relaxed">
                Le Directeur de la publication du Site est Jeremy Serval.
              </p>
            </div>

            {/* Nous contacter */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h2>
              <div className="space-y-2 text-gray-700 leading-relaxed">
                <p>Par téléphone : +33610383288</p>
                <p>Par email : hello@izzzi.io</p>
                <p>Par courrier : 5 rue de charonne, 75011 Paris</p>
              </div>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Données personnelles</h2>
              <p className="text-gray-700 leading-relaxed">
                Le traitement de vos données à caractère personnel est régi par notre Charte du respect 
                de la vie privée, disponible depuis la section "Charte de Protection des Données 
                Personnelles", conformément au Règlement Général sur la Protection des Données 
                2016/679 du 27 avril 2016 («RGPD»).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

