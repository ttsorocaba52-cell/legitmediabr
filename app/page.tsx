import Header from "./components/Header";
import Btn from "./components/Btn";
import ButtonFx from "./components/ButtonFx";
import HeroVideo from "./components/HeroVideo";
import Pillars from "./components/Pillars";
import Reveal from "./components/Reveal";
import Services from "./components/Services";
import Works from "./components/Works";
import { DIRECT_URL, INSTAGRAM_URL, VIMEO_URL, YOUTUBE_URL } from "./config";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function SectionHead({ label, italic, title, text, xl }: { label: string; italic: string; title: string; text?: string; xl?: boolean }) {
  return (
    <div data-reveal="" className="sec-head">
      <span className="label">{label}</span>
      <span className="sec-italic">{italic}</span>
      <h2 className={`sec-title${xl ? " xl" : ""}`}>{title}</h2>
      {text && <p className="sec-text">{text}</p>}
    </div>
  );
}

const AUDIENCE = [
  { img: "/assets/publico-proprietarios-teste.webp", pos: "50% 55%", title: "Proprietários & entusiastas", text: "Para quem sabe que um carro pode representar anos de dedicação, uma conquista ou uma fase inesquecível da vida.", chips: ["Ensaio fotográfico", "Filme do carro"] },
  { img: "/assets/p12.webp", pos: "50% 55%", title: "Concessionárias & lojas", text: "Para quem deseja apresentar seus veículos com uma produção visual que desperte interesse e valorize cada detalhe.", chips: ["Produção comercial", "Conteúdo audiovisual"] },
  { img: "/assets/publico-preparadoras.webp", pos: "50% 45%", title: "Marcas & preparadoras", text: "Para quem faz parte da cultura automotiva e quer transmitir sua identidade através de fotografias e filmes autorais.", chips: ["Campanhas", "Eventos", "Bastidores"] },
];

const FORMATS = [
  { title: "Ensaio", tagline: "Cada detalhe tem seu valor.", text: "Um registro fotográfico para valorizar seu carro e preservar essa fase da sua história.", items: ["Direção de fotos e locação", "Fotos tratadas em alta resolução", "Seleção pronta para redes"] },
  { title: "Produção completa", tagline: "Sua experiência em cada perspectiva.", text: "Fotografia e filme reunidos em uma produção audiovisual com direção criativa personalizada.", items: ["Roteiro e direção", "Filme principal + fotos", "Cortes verticais para Reels", "Bastidores da produção"], featured: true },
  { title: "Filme", tagline: "Sua história em movimento.", text: "Uma produção cinematográfica para transformar a relação com seu carro em cenas que você vai querer rever.", items: ["Roteiro e roteiro de cenas", "Filme principal em 16:9", "Versão vertical para redes"] },
];

const STEPS = [
  { title: "Sua ideia", text: "Me conta sobre seu carro, sua história e o que você gostaria de registrar." },
  { title: "Planejamento", text: "Definimos juntos o estilo, a locação e a proposta criativa da produção." },
  { title: "Produção", text: "Chegou a hora de transformar sua ideia em imagens, explorando cada detalhe com um olhar autoral." },
  { title: "Sua recordação", text: "Você recebe o material finalizado, pronto para guardar, compartilhar e revisitar." },
];

export default function Home() {
  return (
    <div className="page">
      <Header />
      <Reveal />
      <ButtonFx />

      <main id="conteudo" tabIndex={-1}>
      <section id="top" className="hero">
        <HeroVideo />
        <div className="shade hero-shade-v" />
        <div className="shade hero-shade-h" />
        <div className="wrap hero-content">
          <div className="hero-titles">
            <span data-reveal="" className="hero-line" />
            <span data-reveal="" className="serif hero-italic">a sua história, em cada detalhe</span>
            <h1 data-reveal="">Além do quadro.</h1>
          </div>
          <div className="hero-foot">
            <p data-reveal="">
              Seu carro carrega conquistas, momentos e histórias que só você conhece. A gente transforma essa conexão
              em fotografias e filmes para você reviver sempre que quiser.
            </p>
            <Btn reveal href="#vitrine">Explorar projetos ↓</Btn>
            <Btn reveal external strong variant="secondary" href={DIRECT_URL}>Quero registrar meu carro ↗</Btn>
          </div>
        </div>
      </section>

      <section id="manifesto" className="manifesto">
        <div className="wrap">
          <div className="grid12">
            <div data-reveal="" className="label man-label">(01) Manifesto</div>
            <p data-reveal="" className="man-text">
              Algumas histórias só fazem sentido para quem viveu cada momento.{" "}
              <span className="serif">A primeira volta, cada detalhe escolhido, a conquista de ter aquele carro na garagem.</span>{" "}
              <span className="dim">Nosso olhar transforma essa conexão em imagens feitas para durar.</span>
            </p>
          </div>
          <Pillars />
        </div>
      </section>

      <section id="vitrine" className="works">
        <SectionHead
          label="(02) Trabalhos selecionados"
          italic="cada história, uma perspectiva"
          title="Projetos"
          text="Diferentes carros, estilos e experiências. Cada produção revela um olhar particular sobre essa paixão."
          xl
        />
        <Works />
      </section>

      <section id="para-quem" className="stack-sec">
        <SectionHead label="(03) Para quem é" italic="pensado para" title="quem vive isso" />
        <div className="wrap cards3 audience">
          {AUDIENCE.map((a, i) => (
            <article data-reveal="" className="aud-card" key={a.title}>
              <div className="aud-img">
                <img src={a.img} alt={a.title} style={{ objectPosition: a.pos }} loading="lazy" />
              </div>
              <div className="aud-title">
                <span className="num accent" aria-hidden="true">0{i + 1}</span>
                <h3>{a.title}</h3>
              </div>
              <p className="body-15">{a.text}</p>
              <div className="chips">
                {a.chips.map((c) => <span key={c}>{c}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="servicos" className="services alt">
        <SectionHead
          label="(04) Especialidades"
          italic="feito para"
          title="Ser lembrado"
          text="Cada momento merece um jeito de ser registrado. Descubra como podemos transformar a sua paixão em imagens."
          xl
        />
        <Services />
      </section>

      <section id="formatos" className="stack-sec">
        <SectionHead
          label="(05) Formatos"
          italic="escolha o seu"
          title="formato"
          text="Você escolhe como quer guardar esse momento. A gente cuida de transformá-lo em imagens."
        />
        <div className="wrap cards3 formats">
          {FORMATS.map((f, i) => (
            <article data-reveal="" className={`format${f.featured ? " featured" : ""}`} key={f.title}>
              <div className="format-top">
                <span className="num">0{i + 1}</span>
                {f.featured && <span className="tag">Mais completo</span>}
              </div>
              <div className="format-head">
                <h3>{f.title}</h3>
                <strong>{f.tagline}</strong>
                <p>{f.text}</p>
              </div>
              <ul>
                {f.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <div className="format-foot">
                <small>Valor sob consulta</small>
                <Btn external variant={f.featured ? "primary" : "secondary"} href={DIRECT_URL}>Conversar sobre meu projeto ↗</Btn>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="processo" className="stack-sec alt">
        <SectionHead label="(06) Como funciona" italic="do Direct" title="à entrega" />
        <div className="wrap steps">
          {STEPS.map((s, i) => (
            <div data-reveal="" className="step" key={s.title}>
              <span className="step-n" data-n={`0${i + 1}`} aria-hidden="true" />
              <h3>{s.title}</h3>
              <p className="body-15">{s.text}</p>
            </div>
          ))}
        </div>
        <div data-reveal="" className="btn-row center-row">
          <Btn external href={DIRECT_URL}>Começar pelo Direct ↗</Btn>
          <Btn variant="secondary" href="#vitrine">Ver projetos</Btn>
        </div>
      </section>

      <section id="sobre" className="about">
        <div className="wrap grid12">
          <div data-reveal="" className="about-img">
            <img src="/assets/felipe.webp" alt="Felipe Xavier" loading="lazy" />
          </div>
          <div className="about-text">
            <div data-reveal="" className="label">(07) O criador</div>
            <div data-reveal="" className="hero-titles">
              <span className="serif about-italic">o olhar de</span>
              <h2>Felipe Xavier</h2>
            </div>
            <p data-reveal="" className="serif quote">
              Por trás da Legit Media está Felipe Xavier, filmmaker e fotógrafo apaixonado pela cultura automotiva.
            </p>
            <div data-reveal="" className="about-body">
              <p>Seu trabalho nasce da vontade de explorar perspectivas diferentes e criar produções que carreguem a identidade de cada projeto.</p>
              <p>Para Felipe, cada proprietário tem uma relação particular com seu carro. É essa conexão que inspira seu olhar e dá significado a cada produção.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="contact">
        <img className="cover" src="/assets/p11.webp" alt="Cockpit Ferrari" loading="lazy" />
        <div className="shade" />
        <div className="wrap contact-inner">
          <div data-reveal="" className="hero-titles">
            <span className="serif contact-italic">o momento passa,</span>
            <h2>A história fica<span className="accent">.</span></h2>
          </div>
          <div data-reveal="" className="contact-foot">
            <p>Seu carro faz parte da sua vida. Vamos criar uma recordação à altura do que ele representa para você?</p>
            <div className="btn-row">
              <Btn external href={DIRECT_URL}>Quero registrar minha história ↗</Btn>
              <Btn strong variant="secondary" href="#formatos">Conhecer os formatos</Btn>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="logo"><span>LEGIT</span><span>MEDIA</span></div>
          <nav aria-label="Rodapé">
            <a href="#vitrine">Projetos</a>
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </nav>
          <nav aria-label="Redes sociais">
            <a href={INSTAGRAM_URL} {...ext}>Instagram<span className="sr-only"> (abre em nova aba)</span></a>
            <a href={YOUTUBE_URL}>YouTube</a>
            <a href={VIMEO_URL}>Vimeo</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
