"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import React from "react";
import { Eye, MoveUpRight, PencilLine } from "lucide-react";
import Image from "next/image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { routes } from "@/config/routes";

const featuresData = [
  {
    title: "Amélioration continue",
    descLines: [
      "Améliorez vos cours pendant qu'ils sont",
      "en cours. Recueillez les retours à chaud,",
      "ajustez immédiatement. Ne laissez pas",
      "vos étudiants repartir déçus.",
    ],
    tone: "yellow",
    height: 452,
    offsetY: 74,
    scribble: "Ne soyez plus désolé",
  },
  {
    title: "Double satisfaction",
    descLines: [
      "Vos étudiants sont écoutés. Vous",
      "intervenez au bon moment. Résultat : un",
      "vrai sentiment d'écoute et une",
      "progression immédiate.",
    ],
    tone: "white",
    height: 452,
    offsetY: 177,
    scribble: "Mieux que mieux !",
  },
  {
    titleLines: ["L'IA est la pour", "vous assister"],
    descLines: [
      "Elle repère les retours sensibles, vous",
      "notifie et vous aide à formuler une",
      "réponse efficace.",
    ],
    tone: "orange",
    height: 583,
    offsetY: 0,
    scribble: "Vous n'avez pas le temps !",
  },
  {
    title: "Qualiopi Friendly",
    descLines: [
      "Les deux indicateurs principaux de",
      "Qualiopi validé avec un seul outil.",
      "\u00A0",
      "Indicateur 30 : Recueil des appréciations",
      "\u00A0",
      "Indicateur 31 : Traitement des réclamations",
    ],
    tone: "white",
    height: 509,
    offsetY: -83,
    scribble: "Mieux que mieux !",
    titleNoWrap: true,
  },
  {
    title: "Retours garantis 100% sincères",
    descLines: [
      "Des retours vraiment libres. Vos",
      "étudiants répondent sans compte, en",
      "toute confidentialité. Les retours sont",
      "anonymes par défaut.",
    ],
    tone: "orange",
    height: 406,
    offsetY: 20,
    scribble: "Même pas peur !",
    bgClass: "bg-primary-light",
    textClass: "text-content",
  },
  {
    title: "Prêt en 10 minutes chrono",
    descLines: [
      "Import CSV, génération automatique de",
      "QR code, lien à partager. Vos étudiants",
      "accèdent directement à leur formulaire,",
      "sans friction.",
    ],
    tone: "yellow",
    height: 452,
    offsetY: -162,
    scribble: "C'est trop zzzz !",
  },
];

export default function Page() {
  function getFeatureStyles(f: any) {
    const toneClasses =
      (f as any).bgClass
        ? `${(f as any).bgClass} text-content`
        : f.tone === "yellow"
        ? "bg-secondary-dark text-content"
        : f.tone === "orange"
        ? "bg-primary-dark text-white"
        : "bg-background-muted border border-input-normal text-content";
    const bgStyle =
      (f as any).bgClass ? undefined : f.tone === "yellow" ? undefined : undefined;
    const textColor =
      (f as any).textClass ? undefined
      : f.tone === "orange"
      ? "#white"
      : "content";

    return { toneClasses, bgStyle, textColor };
  }

  function FeatureCard({
    feature,
    toneClasses,
    bgStyle,
    textColor,
    height,
    marginTop,
    gridRowEnd,
  }: {
    feature: any;
    toneClasses: string;
    bgStyle?: React.CSSProperties;
    textColor: string | undefined;
    height: number;
    marginTop: number;
    gridRowEnd?: string;
  }) {
    const f = feature;

    return (
      <Card
        className={`relative flex flex-col justify-end items-start gap-[30px] isolation-auto rounded-[18px] pt-[60px] pr-[58px] pb-[60px] pl-[58px] w-[369px] shadow-sm ${toneClasses}`}
        style={{
          ...bgStyle,
          height,
          marginTop,
          ...(gridRowEnd ? { gridRowEnd } : {}),
        }}
      >
        {f.title === "Double satisfaction" && (
          <Image
            src="/images/arrow3.svg"
            alt="Décor flèche pour la carte Double satisfaction"
            width={76}
            height={78}
            className="absolute -top-8 right-[7rem] w-[76px] h-[78px] pointer-events-none select-none"
          />
        )}
        {f.scribble && (
          <span
            className="absolute top-[26px] right-[24px] block text-center rotate-[15deg]"
            style={{
              fontFamily: "Pecita, cursive",
              fontSize: "22px",
              lineHeight: "27px",
              width: 118,
              height: 54,
              color: textColor,
            }}
          >
            {f.scribble}
          </span>
        )}

        <CardTitle
          className="text-subtitle leading-[46px] mb-1"
          style={{
            fontFamily: '"Mochiy Pop One", sans-serif',
            fontWeight: 400,
            maxWidth: "327px",
            color: textColor,
          }}
        >
          {"titleLines" in f && Array.isArray((f as any).titleLines)
            ? (f as any).titleLines.map((line: string, i: number) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))
            : (f as any).title}
        </CardTitle>

        <CardDescription
          className="text-[13px] leading-[24px] whitespace-pre-line"
          style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 400,
            maxWidth: "327px",
            color: "#2F2E2C",
          }}
        >
          {"descLines" in f && Array.isArray((f as any).descLines)
            ? (f as any).descLines.map((line: string, i: number) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))
            : (f as any).desc}
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <main>
        <div className="relative overflow-hidden">
          <div className="bg-[#FFFBF0]">
            <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 relative z-10">
                <h1 className="text-title font-title leading-title text-content">
                  <span className="relative inline-block">
                    Collectez
                    <Image
                      src="/images/arrow1.svg"
                      alt="Décor flèche (SVG)"
                      width={64}
                      height={64}
                      className="absolute -right-12 -top-6 md:-right-16 md:-top-2 w-12 h-12 md:w-16 md:h-16 pointer-events-none select-none"
                    />
                  </span>
                  <br />
                  les{" "}
                  <span className="underline decoration-primary-dark decoration-[6px] underline-offset-8">
                    retours
                  </span>{" "}
                  des <br />
                  étudiants en live
                </h1>

                <ul className="mt-6 space-y-2 text-content font-content text-base">
                  <li className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-content text-xl leading-none">+</span>
                    de retours d'étudiants
                  </li>
                  <li className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-content text-xl leading-none">+</span>
                    de satisfaction
                  </li>
                </ul>

                <div className="mt-8">
                  <Link href={routes.auth.register} prefetch={true} className="inline-flex items-center justify-between bg-[#FFD93D] hover:bg-[#FFC933] text-gray-900 w-fit h-[56px] rounded-[8px] px-[26px] py-[20px] font-medium transition-all">
                    Essayez gratuitement
                    <MoveUpRight className="ml-2" />
                  </Link>

                  <p className="mt-3 font-content text-[12px] text-content font-semibold">
                    4 mois d'essai illimités. Facturation simple par<br></br> classe une fois la période d'essai terminée.
                  </p>
                </div>

                <Image
                  src="/images/arrow2.svg"
                  alt="Décor (placeholder)"
                  width={64}
                  height={64}
                  className="hidden md:block mt-8 w-12 h-12 md:w-16 md:h-16 -ml-8 md:-ml-12"
                />
              </div>

              <div className="lg:col-span-6 relative h-[720px] overflow-visible z-0">
                <div className="absolute top-[160px] left-[15px] rotate-[-15deg] origin-left w-[420px] md:w-[520px] z-10">
                  <div className="flex flex-col items-start">
                    <div
                      className="w-[200px] h-[110px] rounded-[28px] overflow-hidden shadow-md bg-no-repeat"
                      style={{
                        backgroundImage: "url('/images/landing-page1.jpg')",
                        backgroundSize: "100% 200%",
                        backgroundPosition: "center top",
                      }}
                    />
                    <div
                      className="w-[200px] h-[110px] rounded-[28px] overflow-hidden shadow-md bg-no-repeat -mt-[1px]"
                      style={{
                        backgroundImage: "url('/images/landing-page1.jpg')",
                        backgroundSize: "100% 200%",
                        backgroundPosition: "center bottom",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute top-[85px] right-[-120px] rotate-[-15deg] z-30">
                  <div className="w-[460px] h-[96px] rounded-[24px] border border-yellow-300 shadow-lg bg-gradient-to-r from-yellow-100 via-white to-yellow-100">
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 rounded-[12px] bg-white shadow-sm flex items-center justify-center">
                        <Eye className="w-5 h-5 text-gray-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-title text-content font-semibold text-[20px]">Basique</p>
                        <p className="font-content text-[14px] text-content">Adapté à tous les cours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-44 left-24 md:left-40 rotate-[-15deg] z-20">
                  <div className="w-[620px] md:w-[700px] rounded-3xl overflow-hidden bg-white shadow-2xl">
                    <Image
                      src="/images/landing-page2.jpg"
                      alt="Aperçu produit (placeholder)"
                      width={700}
                      height={400}
                      className="w-full h-auto"
                      sizes="(min-width: 768px) 700px, 100vw"
                    />
                  </div>
                </div>

                <div className="absolute bottom-[-160px] right-[-220px] md:bottom-[-125px] md:right-[-300px] rotate-[-15deg] z-10 pointer-events-none">
                  <div className="flex flex-col items-start">
                    <div
                      className="w-[474px] h-[172px] rounded-[75px] overflow-hidden shadow-md bg-no-repeat"
                      style={{
                        backgroundImage: "url('/images/landing-page3.jpg')",
                        backgroundSize: "100% 200%",
                        backgroundPosition: "center top",
                      }}
                    />
                    <div
                      className="w-[474px] h-[172px] rounded-[75px] overflow-hidden shadow-md bg-no-repeat -mt-[1px]"
                      style={{
                        backgroundImage: "url('/images/landing-page3.jpg')",
                        backgroundSize: "100% 200%",
                        backgroundPosition: "center bottom",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute top-[440px] -left-10 rotate-[-15deg] z-40">
                  <div className="absolute -top-20 -left-8 z-0 pointer-events-none">
                    <div className="flex flex-col items-start">
                      <div
                        className="w-[140px] h-[80px] rounded-[28px] overflow-hidden shadow-md bg-no-repeat"
                        style={{
                          backgroundImage: "url('/images/landing-page4.jpg')",
                          backgroundSize: "100% 200%",
                          backgroundPosition: "center top",
                        }}
                      />
                      <div
                        className="w-[140px] h-[80px] rounded-[28px] overflow-hidden shadow-md bg-no-repeat -mt-[1px]"
                        style={{
                          backgroundImage: "url('/images/landing-page4.jpg')",
                          backgroundSize: "100% 200%",
                          backgroundPosition: "center bottom",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="relative z-10 w-[520px] rounded-[24px] shadow-lg bg-gradient-to-r from-yellow-100 via-white to-yellow-100 px-6 py-5 backdrop-blur-[60px]"
                  >
                    <div className="absolute right-16 top-6 w-40 h-24 bg-primary-light/30 blur-xl rounded-full pointer-events-none" />
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-title text-content text-[20px]">A3UI</p>
                        <p className="font-content text-[14px] text-content">Description de la classe</p>
                        <p className="font-content text-[12px] text-content">24 étudiants</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-content text-[13px]">Voir la classe</span>
                        <div
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-content shadow-md bg-secondary-dark cursor-default select-none"
                        >
                          <MoveUpRight className="w-4 h-4" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-content underline text-[14px] cursor-default select-none">
                        <PencilLine className="w-4 h-4" aria-hidden="true" />
                        Modifier la classe
                      </span>
                      <span className="text-content underline text-[14px] cursor-default select-none">
                        Archiver
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-50 -mt-12 pointer-events-none">
          <div className="rotate-[3deg] bg-[#F26103] shadow-lg">
            <div className="px-4 py-3 md:py-4 overflow-x-hidden">
              <div className="marquee">
                <div className="marquee__inner">
                  <span
                    className="orange-ribbon text-white leading-none whitespace-nowrap tracking-[-0.01em] font-title text-[clamp(10px,1.3vw,18px)]"
                  >
                    100% Made in france • Assistance via IA • Retours sincères • Qualiopi Friendly • Double satisfaction • Pôle qualité • Version gratuite à vie • +73% de retours
                  </span>
                  <span
                    aria-hidden="true"
                    className="orange-ribbon text-white leading-none whitespace-nowrap tracking-[-0.01em] font-title text-[clamp(10px,1.3vw,18px)]"
                  >
                    100% Made in france • Assistance via IA • Retours sincères • Qualiopi Friendly • Double satisfaction • Pôle qualité • Version gratuite à vie • +73% de retours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="w-full mt-16">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="block sm:hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {featuresData.map((f) => {
                    const { toneClasses, bgStyle, textColor } = getFeatureStyles(f);

                    return (
                      <CarouselItem
                        key={(f as any).title ?? (f as any).titleLines?.join(" / ")}
                        className="flex justify-center"
                      >
                        <FeatureCard
                          feature={f}
                          toneClasses={toneClasses}
                          bgStyle={bgStyle}
                          textColor={textColor}
                          height={452}
                          marginTop={74}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>

            <div className="hidden sm:grid justify-center [grid-template-columns:repeat(1,369px)] sm:[grid-template-columns:repeat(2,369px)] lg:[grid-template-columns:repeat(3,369px)] gap-x-[30px]">
              {featuresData.map((f) => {
                const { toneClasses, bgStyle, textColor } = getFeatureStyles(f);

                const unit = 10;
                const span = Math.ceil((f.height ?? 452) / unit);

                return (
                  <FeatureCard
                    key={(f as any).title ?? (f as any).titleLines?.join(" / ")}
                    feature={f}
                    toneClasses={toneClasses}
                    bgStyle={bgStyle}
                    textColor={textColor}
                    height={f.height}
                    marginTop={f.offsetY ?? 0}
                    gridRowEnd={`span ${span}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-items-center lg:justify-items-start">
            <div className="lg:col-span-4 w-[369px] mx-auto lg:ml-[40px]">
              <Card className="w-[369px] h-[428px] rounded-2xl bg-white shadow px-6 py-6 text-content flex flex-col lg:text-left">
                <CardTitle className="font-title text-[54px] leading-[62px]">
                  <span className="block">+73%</span>
                  <span className="block text-[18px] leading-[24px] font-content font-semibold mt-2">
                    de retours collectés en moyenne*
                  </span>
                </CardTitle>

                <CardDescription className="font-content text-[15px] leading-[24px] mt-6">
                  <span className="block">Les étudiants savent que leur avis</span>
                  <span className="block">change leur cours, pas celui du</span>
                  <span className="block">prochain semestre.</span>
                  <span className="block">&nbsp;</span>
                  <span className="block">Résultat : ils répondent plus, mieux, et</span>
                  <span className="block">plus vite.</span>
                </CardDescription>

                <p className="font-content text-[13px] mt-auto opacity-70">
                  *par rapport aux méthodes conventionnelles
                </p>
              </Card>
            </div>

            <div className="lg:col-span-7 w-full max-w-[760px] mx-auto">
              <div className="relative rounded-2xl overflow-hidden h-[428px] w-[369px] sm:w-[480px] md:w-[640px] lg:w-[760px] mx-auto lg:ml-[20px]">
                <Image
                  src="/images/landing-page5.jpg"
                  alt="Illustration"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 760px, (min-width: 768px) 640px, (min-width: 640px) 480px, 369px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full mb-8 hidden sm:block">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="rounded-3xl bg-primary-dark text-white px-6 py-12 flex flex-col items-center gap-6">
              <h3
                className="font-title text-headline text-center text-white"
                style={{ color: "white" }}
              >
                Créez une classe test <br />en quelques minutes.
              </h3>
              <p
                className="font-content text-[15px] text-center opacity-90 text-white"
                style={{ color: "white" }}
              >
                C'est gratuit. 4 mois en illimité. Sans carte.<br /> Vos premiers retours sont immédiats.
              </p>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="inline-block relative -top-8 md:-top-5">
                  <Image
                    src="/images/arrow2.svg"
                    alt="Flèche décorative"
                    width={39}
                    height={67}
                    className="w-[39px] h-[67px]"
                  />
                </span>
                <Link 
                  href={routes.auth.register}
                  prefetch={true}
                  className="bg-[#FFD93D] hover:bg-[#FFC933] text-gray-900 flex items-center justify-center gap-2 w-[286px] h-[56px] rounded-[8px] pt-[20px] pr-[26px] pb-[20px] pl-[26px] ml-3 md:ml-6 font-medium transition-all"
                >
                  Créer une classe gratuitement
                  <MoveUpRight className="ml-2" />
                </Link>
                <span aria-hidden="true" className="inline-block relative -top-8 md:-top-32">
                  <Image
                    src="/images/arrow1.svg"
                    alt="Flèche décorative"
                    width={70}
                    height={72}
                    className="w-[69px] h-[71px]"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
