import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lock, ShieldCheck, Medal, Play } from "lucide-react";
import grifoIconGold from "@/assets/grifo-icon-gold.png";
import webinarCover from "@/assets/webinar-cover.png";
import danielGedeon from "@/assets/daniel-gedeon.png";
const MasterclassLanding = () => {
  const ctaUrl = "https://lastlink.com/p/C9F920EE8?cp=MASTER150";
  const scrollToVideo = () => {
    document.getElementById('video-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <>
      <Helmet>
        <title>Fast Construction: Como se Diferenciar na Construção Civil | Grifo</title>
        <meta name="description" content="Aprenda como transformar sua construtora em referência no mercado com gestão financeira sólida, processos independentes e posicionamento de autoridade." />
      </Helmet>

      <div className="min-h-screen bg-[#2a3441]">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Fast Construction: como se{" "}
                  <span className="text-[#b8860b]">diferenciar</span> e crescer no
                  mercado da construção civil
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  O mercado da construção civil está aquecido em 2025, mas quem não se diferencia continua invisível.
                </p>
                <p className="text-gray-300 leading-relaxed">Nesta Masterclass, Daniel Gedeon mostra como transformar sua construtora em referência: gestão financeira sólida, processos independentes do dono, equipe engajada e posicionamento de autoridade que atrai clientes maiores.</p>
                <Button onClick={scrollToVideo} className="bg-[#b8860b] hover:bg-[#9a7209] text-white font-bold text-lg px-8 py-6 w-full md:w-auto uppercase tracking-wide">
                  Quero me diferenciar
                </Button>
              </div>
              <div className="flex justify-center">
                <img src={webinarCover} alt="Como se Diferenciar na Construção Civil - Grifo" className="rounded-lg shadow-2xl max-w-md w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section id="video-section" className="bg-[#d4cfc4] py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Pe5yzImnXxU" title="Fast Construction - Como se Diferenciar na Construção Civil" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2a3441] uppercase">
                  Sobre o<br />Conteúdo
                </h2>
                <p className="text-[#2a3441] leading-relaxed">
                  A maioria das construtoras vive a mesma rotina: briga por preço, não sabe se lucra ou perde, depende do dono pra tudo e frustra o cliente. Esse ciclo trava o crescimento — mesmo em um mercado cheio de oportunidades.
                </p>
                <div className="space-y-3 text-[#2a3441]">
                  <p className="font-semibold">No Fast Construction, você vai aprender:</p>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-[#b8860b] font-bold">-</span>
                      Como criar previsibilidade financeira para crescer com segurança.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#b8860b] font-bold">-</span>
                      Processos de gestão de obras que funcionam sem você presente.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#b8860b] font-bold">-</span>
                      Estratégias para engajar o time e alinhar todo mundo na mesma direção.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#b8860b] font-bold">-</span>
                      Como definir um posicionamento forte que faz a sua empresa deixar de ser só mais um orçamento e virar a escolha óbvia.
                    </li>
                  </ul>
                </div>
                <p className="text-[#2a3441] font-medium">
                  Tudo com exemplos reais com cases que transformaram a Grifo em referência no mercado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Daniel Section */}
        <section className="bg-[#2a3441] py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-[#b8860b] font-medium">Quem está por trás do Fast Construction?</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Daniel Gedeon | Grifo
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Daniel Gedeon é engenheiro civil e fundador da Grifo Engenharia, empresa referência na entrega rápida e eficiente de obras por meio do método Fast Construction. Com espírito empreendedor, iniciou a empresa com apenas R$ 500 e transformou desafios em oportunidades, revolucionando o mercado com inovação, gestão ágil e compromisso com a qualidade. Apaixonado por otimização de processos, acredita que cada minuto importa na construção e no crescimento dos negócios.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 border-4 border-[#b8860b]" />
                  <img src={danielGedeon} alt="Daniel Gedeon - Fundador da Grifo Engenharia" className="relative w-80 h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#d4cfc4] py-16 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2a3441] italic uppercase">
              Quero aprender com quem faz.
            </h2>
            <Button asChild className="bg-[#b8860b] hover:bg-[#9a7209] text-white font-bold text-lg px-12 py-6 uppercase tracking-wide">
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                Comprar Agora
              </a>
            </Button>
          </div>
        </section>

        {/* Practical Content Section */}
        <section className="bg-[#2a3441] py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <img src={grifoIconGold} alt="Grifo" className="w-64 h-64 object-contain" />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight">
                  Esse não é mais<br />um conteúdo<br />teórico.
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  O Fast Construction nasceu dentro da obra, na prática, resolvendo os problemas reais de quem fatura, mas não cresce. Aqui você vai entender a lógica por trás da diferenciação que transforma construtoras comuns em empresas sólidas e reconhecidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-[#d4cfc4] py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#2a3441] rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Promo Badge */}
              <div className="absolute -right-12 top-8 bg-red-600 text-white px-16 py-2 rotate-45 font-bold text-sm uppercase tracking-wide shadow-lg">
                Promoção
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Aproveite o conteúdo em qualquer dispositivo.
                  </h3>
                  <div className="w-24 h-1 bg-[#b8860b]" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Lock className="w-5 h-5 text-[#b8860b]" />
                      <span>Seus dados pessoais são confidenciais</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <ShieldCheck className="w-5 h-5 text-[#b8860b]" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Medal className="w-5 h-5 text-[#b8860b]" />
                      <span>Garantia: seu dinheiro de volta sem perguntas</span>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  {/* Discount Badge */}
                  <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase animate-pulse">
                    🔥 Oferta por tempo limitado
                  </div>
                  
                  <p className="text-gray-400 text-sm">de</p>
                  <p className="text-2xl text-gray-500 line-through decoration-red-500 decoration-2">
                    R$ 247,00
                  </p>
                  <p className="text-gray-400 text-sm">por apenas</p>
                  <div className="relative inline-block">
                    <p className="text-5xl md:text-7xl font-bold text-white">
                      R$ 97<span className="text-3xl md:text-4xl">,00</span>
                    </p>
                  </div>
                  
                  {/* Savings Badge */}
                  <div className="inline-block bg-green-600/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold">
                    Economia de R$ 150,00
                  </div>
                  
                  <p className="text-[#b8860b] font-medium">ou 3x de R$ 34,95</p>
                  
                  <Button asChild className="bg-[#b8860b] hover:bg-[#9a7209] text-white font-bold text-lg px-12 py-6 w-full uppercase tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                      Quero Aproveitar
                    </a>
                  </Button>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Pagamento 100% seguro com acesso imediato
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#2a3441] py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 uppercase">
              Perguntas Frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border-b border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#b8860b] text-left uppercase text-sm font-semibold">
                  Para quem é esse produto?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-2">
                  <p><strong>ENGENHEIROS</strong><br />Domine um método validado para entregar projetos com mais eficiência e menos custos.</p>
                  <p><strong>PRESTADORES DE SERVIÇO</strong><br />Execute com mais organização e produtividade, fortalecendo sua reputação e conquistando mais contratos.</p>
                  <p><strong>EMPREITEIROS</strong><br />Reduza desperdícios, aumente sua margem e entregue no prazo sem dor de cabeça.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#b8860b] text-left uppercase text-sm font-semibold">
                  Como funciona o prazo de garantia?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  O Prazo de Garantia é o período que você tem para pedir o reembolso integral do valor pago pela sua compra, caso o produto não seja satisfatório.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#b8860b] text-left uppercase text-sm font-semibold">
                  O que é e como funciona o certificado de conclusão digital?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Alguns cursos online oferecem um certificado digital de conclusão. Alunos podem emitir esse certificado ao final do curso ou entrando em contato com o Autor ou Autora. Esses certificados podem ser compartilhados em redes sociais como o LinkedIn e inseridos em informações curriculares.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-b border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#b8860b] text-left uppercase text-sm font-semibold">
                  Como acessar o produto?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-2">
                  <p>Você receberá o acesso por email. O conteúdo será acessado ou baixado através de um computador, celular, tablet ou outro dispositivo digital. Você também pode acessar o produto comprado nesta página:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Faça login no Hotmart clicando em "Entrar"</li>
                    <li>Acesse o menu lateral, clique em "Minha conta"</li>
                    <li>Clique em "Minhas compras" e lá estarão todos os produtos que você já comprou</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-b border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#b8860b] text-left uppercase text-sm font-semibold">
                  Como faço para comprar?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Para comprar este curso, clique no botão "Comprar agora". Lembre-se de que nem todos os cursos estarão sempre disponíveis para compra. É possível que o produtor esteja preparando uma nova turma ainda sem inscrições abertas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#d4cfc4] py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#2a3441] text-sm uppercase tracking-wide">
              Copyright © Grifo Engenharia
            </p>
            <p className="text-[#2a3441] text-xs mt-2">
              Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>;
};
export default MasterclassLanding;