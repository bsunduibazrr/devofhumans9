"use client";

import {
  createContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Pose } from "@/lib/deck";
import { LineChart } from "./charts";
import { Counter, Icon, Reveal, Split, Tilt } from "./ui";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const GoToContext = createContext<(i: number) => void>(() => {});

const C = {
  hero: "#38bdf8",
  econ: "#f59e0b",
  tech: "#38bdf8",
  edu: "#a78bfa",
  health: "#10b981",
  culture: "#f472b6",
  peace: "#60a5fa",
  mn: "#38bdf8",
};

const LOC = {
  mongolia: [47.5, 103.5] as [number, number],
  ub: [47.92, 106.92] as [number, number],
  seoul: [37.57, 126.98] as [number, number],
  china: [33.5, 110] as [number, number],
  hanoi: [21.03, 105.85] as [number, number],
  nairobi: [-1.29, 36.82] as [number, number],
  bengaluru: [12.97, 77.59] as [number, number],
  europe: [50, 10] as [number, number],
  mainz: [50, 8.27] as [number, number],
  brussels: [50.85, 4.35] as [number, number],
};

// ---------- Туслах хэсгүүд ----------

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <Reveal i={0} className="eyebrow">
      <span className="eyebrow-n">{n}</span>
      <span className="eyebrow-sep">/</span>
      <span>{label}</span>
    </Reveal>
  );
}

function CaseTag({ n, place }: { n: string; place: string }) {
  return (
    <Reveal i={0} className="case-tag">
      <span className="case-pill">{n}</span>
      <span className="case-place">
        <span className="case-dot" />
        {place}
      </span>
    </Reveal>
  );
}

function Title({
  children,
  i = 1,
  delay = 80,
}: {
  children: string;
  i?: number;
  delay?: number;
}) {
  return (
    <h2 className="h2" style={{ "--i": i } as Vars}>
      <Split text={children} delay={delay} />
    </h2>
  );
}

function Lead({ children, i = 2 }: { children: ReactNode; i?: number }) {
  return (
    <Reveal as="p" i={i} className="lead">
      {children}
    </Reveal>
  );
}

function Points({ items, start = 4 }: { items: ReactNode[]; start?: number }) {
  return (
    <ul className="points">
      {items.map((it, k) => (
        <Reveal as="li" i={start + k} key={k} className="point">
          <span className="point-dot" />
          <span>{it}</span>
        </Reveal>
      ))}
    </ul>
  );
}

function Stat({
  value,
  label,
  i,
  accent,
}: {
  value: ReactNode;
  label: ReactNode;
  i: number;
  accent?: string;
}) {
  return (
    <Tilt i={i} className="stat" accent={accent}>
      <div className="stat-v">{value}</div>
      <div className="stat-l">{label}</div>
    </Tilt>
  );
}

function Source({ children, i = 9 }: { children: ReactNode; i?: number }) {
  return (
    <Reveal i={i} className="source">
      Эх сурвалж: {children}
    </Reveal>
  );
}

// ==========================================
// 18 СЛАЙДЫН ТЕКСТ АГУУЛГА (ДАВУУ ТАЛУУД)
// ==========================================

// 01. Нүүр гарчиг
function S01() {
  const word = "ДАЯАРШИЛ";
  return (
    <div className="layout-hero">
      <Reveal i={0} className="hero-kicker">
        Хүний хөгжил · Олон улсын харилцаа
      </Reveal>
      <h1 className="hero-title" aria-label={word}>
        {word.split("").map((ch, k) => (
          <span key={k} className="hero-ch" style={{ "--k": k } as Vars} aria-hidden>
            {ch}
          </span>
        ))}
      </h1>
      <Reveal i={2} className="hero-sub">
        Хүн төрөлхтний хамтын хөгжил ба <em>давуу талууд</em>
      </Reveal>
      <Reveal i={3} className="hero-meta">
        <span>ЧӨЛӨӨТ ХУДАЛДАА</span>
        <span className="hero-meta-dot">·</span>
        <span>ИННОВАЦИ БА МЭДЛЭГ</span>
        <span className="hero-meta-dot">·</span>
        <span>ХИЛ ХЯЗГААРГҮЙ БОЛОМЖ</span>
      </Reveal>
      <Reveal i={4} className="hero-hint">
        <span className="mouse">
          <span />
        </span>
        Гүйлгэх эсвэл чиглүүлэгч товч ашиглана уу
      </Reveal>
    </div>
  );
}

// 02. Даяаршлын тухай ойлголт
function S02() {
  return (
    <div className="layout-left">
      <Eyebrow n="01" label="ТОДОРХОЙЛОЛТ" />
      <Title>Даяаршлын мөн чанар ба нэгдмэл орон зай</Title>
      <Lead>
        Даяаршил нь дэлхийн улс орнууд, ард түмэн худалдаа, хөрөнгө оруулалт, технологи, соёлоор холбогдон
        нэгдмэл орон зайг үүсгэх үйл явц юм.
      </Lead>
      <Points
        start={3}
        items={[
          "Хил хязгаарыг даван чөлөөтэй урсах бараа, үйлчилгээ, хөрөнгө, мэдлэгийн тасралтгүй урсгал",
          "Орон зайн саадыг арилгаж, дэлхийн хаанаас ч хамтран ажиллах, харилцах нөхцөлийг бүрдүүлдэг",
          "Хувь хүн болон улс үндэстэнд өөрийн нөөц бололцоогоо дэлхийн тавцанд үнэлүүлэх тэгш гарцыг олгодог",
          "Хүн төрөлхтний хуримтлуулсан шинжлэх ухаан, соёлын ололтыг нийтийн хүртээл болгох үндэс суурь",
        ]}
      />
    </div>
  );
}

// 03. Олон улсын худалдааны хөгжил
function S03() {
  return (
    <div className="layout-left">
      <Eyebrow n="02" label="ОЛОН УЛСЫН ХУДАЛДАА" />
      <Title>Чөлөөт худалдаа ба дэлхийн баялгийн эргэлт</Title>
      <Lead>
        Улс бүр өөрийн харьцангуй давуу тал бүхий бүтээгдэхүүнийг дэлхийн зах зээлд чөлөөтэй нийлүүлж байна.
      </Lead>
      <div className="stats">
        <Stat
          i={3}
          value={
            <>
              $<Counter to={24} />
              <small> ИХ НАЯД</small>
            </>
          }
          label="Дэлхийн барааны жилийн экспорт (1950 онд ердөө $62 тэрбум байсан)"
          accent={C.econ}
        />
        <Stat
          i={4}
          value={<Counter to={166} />}
          label="Дэлхийн худалдааны байгууллагын гишүүн орон хамтын дүрмээр хамгаалагдсан"
          accent={C.econ}
        />
      </div>
      <Points
        start={5}
        items={[
          "Гаалийн татвар, худалдааны хоригууд буурч, хэрэглэгчдийн худалдан авах чадвар дээшилсэн",
          "Бүтээгдэхүүний чанар сайжирч, өртөг зардал буурснаар хүн бүрт хүртээмжтэй болсон",
          "Монгол Улсын хувьд уул уурхай, ноолуурын бүтээгдэхүүнээ дэлхийн зах зээлд шууд борлуулах боломж",
        ]}
      />
      <Source i={8}>Дэлхийн худалдааны байгууллага (WTO)</Source>
    </div>
  );
}

// 04. Эдийн засгийн өсөлт
function S04() {
  return (
    <div className="layout-right">
      <Eyebrow n="03" label="ЭДИЙН ЗАСГИЙН ӨСӨЛТ" />
      <Title>Үндэсний баялгийн үсрэлт ба ядуурлын бууралт</Title>
      <Reveal i={3} className="chart-card">
        <div className="chart-head">
          <span>Нэн ядуу хүн амын эзлэх хувь (Дэлхий даяар)</span>
          <span className="chart-big">
            <Counter from={38} to={9} duration={2200} suffix="%" />
          </span>
        </div>
        <LineChart
          id="pov"
          unit="%"
          min={0}
          max={45}
          labelEvery={2}
          points={[
            [1990, 38],
            [1995, 35],
            [2000, 29],
            [2005, 21],
            [2010, 16],
            [2015, 10],
            [2019, 9],
          ]}
        />
      </Reveal>
      <Points
        start={5}
        items={[
          "Худалдаа, хөрөнгө оруулалтад нээлттэй болсноор 1 тэрбум гаруй хүн нэн ядуурлаас бүрэн гарсан",
          "Дотоодын жижиг зах зээлээс хальж, 8 тэрбум хүнтэй дэлхийн эдийн засагт өрсөлдөх боломж бүрдсэн",
          "Гадаадын шууд хөрөнгө оруулалт (FDI) нь шинэ дэд бүтэц, аж үйлдвэрийг хөгжүүлэх санхүүжилт болсон",
        ]}
      />
      <Source i={8}>Дэлхийн банк (World Bank)</Source>
    </div>
  );
}

// 05. Ажлын байр, хөдөлмөрийн зах зээл
function S05() {
  return (
    <div className="layout-left">
      <Eyebrow n="04" label="ХӨДӨЛМӨРИЙН ЗАХ ЗЭЭЛ" />
      <Title>Шинэ ажлын байр ба дэлхийн тавцанд үнэлэгдэх ур чадвар</Title>
      <Lead>
        Газар зүйн байршлаас үл хамааран олон улсын томоохон байгууллагуудад ажиллах шинэ боломжууд нээгдэв.
      </Lead>
      <div className="stats">
        <Stat
          i={3}
          value={<Counter to={5} suffix=" САЯ+" />}
          label="Мэдээллийн технологи, инженерийн олон улсын шууд ажлын байр (Энэтхэг)"
          accent={C.econ}
        />
        <Stat
          i={4}
          value={<>Remote</>}
          label="Зайнаас ажиллах соёл дэлгэрч, эх орондоо сууж дэлхийн цалин авах боломж"
          accent={C.econ}
        />
      </div>
      <Points
        start={5}
        items={[
          "Олон улсын компаниуд орон нутагт өндөр технологи, мэдлэг шингэсэн шинэ ажлын байр бий болгов",
          "Монгол залуус эх орондоо амьдрангаа олон улсын томоохон төслүүдэд гэрээгээр ажиллах боломж бүрдсэн",
          "Ажиллах хүчний ур чадвар, мэргэжлийн үнэлэмж дэлхийн стандартад нийцэн тасралтгүй өсөж байна",
          "Фриланс болон дижитал эдийн засгийн бие даасан шинэ мэргэжлүүд олноор үүсэв",
        ]}
      />
    </div>
  );
}

// 06. Боловсролын тэгш боломж
function S06() {
  return (
    <div className="layout-right">
      <Eyebrow n="05" label="БОЛОВСРОЛ" />
      <Title>Хил хязгааргүй мэдлэг ба олон улсын сургалт</Title>
      <div className="compare">
        <Tilt i={3} className="cmp cmp-old">
          <span>2000 ОН</span>
          <b>
            <Counter to={2.1} decimals={1} />
          </b>
          <em>Сая гадаад оюутан</em>
        </Tilt>
        <div className="cmp-arrow rv" style={{ "--i": 4 } as Vars}>
          →
        </div>
        <Tilt i={5} className="cmp cmp-new">
          <span>2024 ОН</span>
          <b>
            <Counter to={6.9} decimals={1} delay={500} />
          </b>
          <em>Сая гадаад оюутан</em>
        </Tilt>
      </div>
      <Points
        start={6}
        items={[
          "Coursera, edX, MIT OpenCourseWare зэрэг платформоор дэлхийн шилдэг мэдлэгийг үнэгүй эзэмших эрх чөлөө",
          "Erasmus+, Засгийн газрын тэтгэлэг (Монголын Ерөнхийлөгчийн «Илгээлт-2100») хөтөлбөрүүдийн өргөжилт",
          "Олон улсын диплом, кредит харилцан хүлээн зөвшөөрөгдөж, дэлхийн шилдэг сургуульд шилжин суралцах боломж",
          "Дэлхийн тэргүүлэх эрдэмтэд, профессоруудтай цахимаар шууд холбогдон хамтарсан судалгаа хийх гарц",
        ]}
      />
      <Source i={9}>ЮНЕСКО (UNESCO)</Source>
    </div>
  );
}

// 07. Технологийн дэвшил, инноваци
function S07() {
  const nodes = [
    { t: "Дизайн ба Архитектур", c: "АНУ · Калифорни", x: 20, y: 12 },
    { t: "Хамгийн нарийн чип", c: "Тайвань (TSMC)", x: 80, y: 12 },
    { t: "OLED дэлгэц", c: "Өмнөд Солонгос", x: 88, y: 50 },
    { t: "Оптик мэдрэгч", c: "Япон (Sony)", x: 78, y: 88 },
    { t: "Угсралт ба туршилт", c: "Энэтхэг · Вьетнам", x: 24, y: 88 },
    { t: "Үнэт түүхий эд", c: "Африк · Австрали", x: 11, y: 50 },
  ];

  return (
    <div className="layout-split">
      <div>
        <Eyebrow n="06" label="ТЕХНОЛОГИ" />
        <Title>Технологийн дамжуулалт ба инновацийн нэгдэл</Title>
        <Lead>
          Дэлхийн тэргүүний технологийн ололтууд нэг дор төвлөрөлгүй, улс орнуудад цаг алдалгүй нэвтэрдэг болсон.
        </Lead>
        <Points
          start={3}
          items={[
            "Хиймэл оюун ухаан, автоматжуулалт, робот техникийн ололтууд дэлхий даяар түргэн түгдэг",
            "Олон орны инженерүүдийн хамтын оюун ухаанаар дээд зэрэглэлийн нарийн төхөөрөмжүүд бүтээгддэг",
            "Монгол Улс зэрэг хөгжиж буй орнууд үе шат алгасан дэвшилтэт технологи нэвтрүүлж байна (4G/5G, дижитал банк)",
          ]}
        />
      </div>
      <div className="supply rv" style={{ "--i": 3 } as Vars}>
        <svg className="supply-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {nodes.map((n, k) => (
            <line key={k} x1="50" y1="50" x2={n.x} y2={n.y} style={{ "--i": k } as Vars} />
          ))}
        </svg>
        <div className="supply-core">
          <Icon name="phone" size={38} />
        </div>
        {nodes.map((n, k) => (
          <div
            key={n.t}
            className="supply-node"
            style={{ left: `${n.x}%`, top: `${n.y}%`, "--i": k } as Vars}
            data-cursor
          >
            <b>{n.t}</b>
            <span>{n.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 08. Мэдээлэл, харилцаа холбоо
function S08() {
  return (
    <div className="layout-left">
      <Eyebrow n="07" label="ХАРИЛЦАА ХОЛБОО" />
      <Title>Мэдээллийн эрин: 5.5 тэрбум хүний нэгдсэн сүлжээ</Title>
      <div className="mega">
        <Reveal i={2} className="mega-v">
          <Counter to={5.5} decimals={1} duration={2000} />
          <small>ТЭРБУМ ХҮН</small>
        </Reveal>
        <Reveal i={3} className="mega-l">
          Дэлхийн хүн амын 68% нь интернэтэд бүрэн холбогдож, цахим үйлчилгээ авч байна
        </Reveal>
      </div>
      <Points
        start={4}
        items={[
          "Дэлхийн аль ч цэгт болж буй үйл явдал, шинжлэх ухааны мэдээллийг хэдхэн хоромд хүлээн авах эрх чөлөө",
          "Хиймэл оюун ба автомат орчуулгын системүүд хэлний бэрхшээлийг арилгаж, харилцааг хялбарчилсан",
          "Цахим засаглал, үүлэн технологийн ачаар төрийн болон хувийн хэвшлийн үйлчилгээ ил тод, түргэн шуурхай болов",
          "Монгол Улсын алслагдсан сум, багийн иргэд ч дэлхийн мэдээллийн сүлжээнд Starlink зэргээр шууд холбогдож байна",
        ]}
      />
      <Source i={8}>Олон улсын цахилгаан холбооны байгууллага (ITU)</Source>
    </div>
  );
}

// 09. Соёлын харилцан солилцоо
function S09() {
  return (
    <div className="layout-left">
      <Eyebrow n="08" label="СОЁЛЫН СОЛИЛЦОО" />
      <Title>Үндэсний өв соёл дэлхийн тавцанд гарах гарц</Title>
      <Lead>
        Даяаршил нь жижиг үндэстний өвөрмөц урлагийг ч дэлхий дахинд таниулж, соёлын харилцан баяжилтыг авчирдаг.
      </Lead>
      <div className="grid-3">
        <Tilt i={3} className="card">
          <Icon name="music" size={24} />
          <h3>Халлю давалгаа</h3>
          <p>Өмнөд Солонгосын K-Pop, кино урлаг дэлхийн хэмжээний үнэ цэнтэй эдийн засгийн хүч болон хувирсан</p>
        </Tilt>
        <Tilt i={4} className="card">
          <Icon name="sparkle" size={24} />
          <h3>The HU хамтлаг</h3>
          <p>Монгол хөөмий, морин хуурыг роктой хослуулан Billboard-ыг тэргүүлж, дэлхийн сая сая сонсогчдод хүрсэн</p>
        </Tilt>
        <Tilt i={5} className="card">
          <Icon name="film" size={24} />
          <h3>Соёлын ойлголцол</h3>
          <p>Кино, уран зохиол, урлагаар дамжуулан бусад үндэстний үнэт зүйлсийг харилцан ойлгож хүндэтгэх</p>
        </Tilt>
      </div>
      <Points
        start={6}
        items={[
          "Үндэсний өвөрмөц онцлогтой соёл дэлхийн зах зээлд өндөр үнэлэгдэх таатай орчин бүрдсэн",
          "ЮНЕСКО-ийн хүн төрөлхтний өвд Монгол наадам, уртын дуу, морин хуур бүртгэгдэн хамгаалагдав",
          "Соёлын олон талт байдал хадгалагдаж, хүн төрөлхтний оюун санааны сан хөмрөг тасралтгүй баяждаг",
        ]}
      />
    </div>
  );
}

// 10. Аялал жуулчлалын хөгжил
function S10() {
  return (
    <div className="layout-right">
      <Eyebrow n="09" label="АЯЛАЛ ЖУУЛЧЛАЛ" />
      <Title>Хил хязгааргүй аялал ба аялал жуулчлалын өсөлт</Title>
      <Lead>
        Агаарын тээвэр, визгүй зорчих бодлого хөгжсөнөөр дэлхий даяар аялах нь хялбар бөгөөд хүртээмжтэй болсон.
      </Lead>
      <div className="stats">
        <Stat
          i={3}
          value={
            <>
              <Counter to={1.4} decimals={1} />
              <small> ТЭРБУМ</small>
            </>
          }
          label="Жил бүр олон улсын хил даван зорчиж буй жуулчдын тоо"
          accent="#f59e0b"
        />
        <Stat
          i={4}
          value={<>10%</>}
          label="Дэлхийн нийт ДНБ болон 10 ажлын байр тутмын нэгийг аялал жуулчлал бүрдүүлдэг"
          accent="#f59e0b"
        />
      </div>
      <Points
        start={5}
        items={[
          "Орон нутгийн эдийн засагт гадаад валютын шууд орлого оруулж, үйлчилгээний салбарыг тэтгэдэг",
          "Түүх соёл, онгон байгалиа сурталчлах боломж нээгдэж, олон улсын найрамдалт харилцаа бэхждэг",
          "Монгол Улсын нүүдэлчин ахуй, эко-аялал жуулчлал дэлхийн аялагчдын анхаарлыг ихээр татаж байна",
          "Иргэд өөр орны соёл, хөгжилтэй газар дээр нь танилцаж, ертөнцийг үзэх үзлээ тэлэх эрх чөлөө",
        ]}
      />
      <Source i={8}>НҮБ-ын Дэлхийн аялал жуулчлалын байгууллага (UN Tourism)</Source>
    </div>
  );
}

// 11. Эрүүл мэндийн салбарын хөгжил
function S11() {
  return (
    <div className="layout-right">
      <Eyebrow n="10" label="ЭРҮҮЛ МЭНД" />
      <Title>Дэлхийн анагаахын хамтын ажиллагаа ба урт наслалт</Title>
      <Reveal i={3} className="chart-card">
        <div className="chart-head">
          <span>Дэлхийн дундаж наслалт (Жил)</span>
          <span className="chart-big">
            <Counter from={46} to={73} duration={2200} />
          </span>
        </div>
        <LineChart
          id="life"
          min={40}
          max={80}
          points={[
            [1950, 46],
            [1970, 56],
            [1990, 64],
            [2010, 70],
            [2023, 73],
          ]}
        />
      </Reveal>
      <Points
        start={5}
        items={[
          "Дэлхий нийтийн хамтын вакцинжуулалтаар цэцэг өвчнийг бүрэн устгаж, саа өвчнийг 99%-иар бууруулсан",
          "Шинэ эмийн судалгаа, оношилгооны дэвшилтэт тоног төхөөрөмж дэлхийн өнцөг булан бүрт шуурхай хүрдэг",
          "Алсын зайн оношилгоо (Телемедицин) хөгжиж, Монголын эмч нар дэлхийн шилдэг мэргэжилтнүүдтэй хамтарч байна",
          "Хүн төрөлхтний дундаж наслалт 46-аас 73 жил болж огцом өссөн нь даяаршлын шууд үр өгөөж юм",
        ]}
      />
      <Source i={8}>ДЭМБ ба НҮБ (WHO & UN)</Source>
    </div>
  );
}

// 12. Шинжлэх ухааны дэвшил
function S12() {
  const steps = [
    { d: "2020.01", t: "Хятадын эрдэмтэд вирусын геномын бүтцийг дэлхий даяар нээлттэй хуваалцав" },
    { d: "2020.04", t: "Германы BioNTech ба АНУ-ын Pfizer хил дамнан mRNA технологийг нэгтгэв" },
    { d: "2020.12", t: "Ердийн 10 жилийн судалгааг 11-хэн сарын дотор хамтран бүтээн баталгаажуулав" },
    { d: "COVAX", t: "2 тэрбум гаруй тун вакциныг 140 гаруй улсад шуурхай түгээж хүн төрөлхтнийг хамгаалсан" },
  ];

  return (
    <div className="layout-bottom">
      <CaseTag n="ШИНЖЛЭХ УХААН" place="ДЭЛХИЙН ХАМТЫН ОЛОЛТ" />
      <Title>Олон улсын шинжлэх ухааны нэгдсэн хүч ба хурд</Title>
      <Lead>
        Дэлхийн тулгамдсан асуудлуудыг олон орны эрдэмтэд хамтран, өгөгдлөө нээлттэй солилцсоноор богино
        хугацаанд шийдвэрлэж байна.
      </Lead>
      <div className="timeline">
        <div className="timeline-line rv" style={{ "--i": 3 } as Vars} />
        {steps.map((s, k) => (
          <Tilt i={4 + k} key={k} className="tl">
            <span className="tl-dot" />
            <b>{s.d}</b>
            <p>{s.t}</p>
          </Tilt>
        ))}
      </div>
      <Points
        start={8}
        items={[
          "Нээлттэй шинжлэх ухаан (Open Science): Судалгааны үр дүнг хүн төрөлхтөн хамтран ашигладаг болсон",
          "Жеймс Уэбб сансрын дуран, ЦЕРН-ийн адрон коллайдер зэрэг аварга төслүүд олон улсын хүчээр хэрэгждэг",
          "Монгол эрдэмтэд олон улсын багт багтан генетик, палеонтологи, сэргээгдэх эрчим хүчний чиглэлээр амжилт гаргаж байна",
        ]}
      />
    </div>
  );
}

// 13. Бизнесийн боломж
function S13() {
  return (
    <div className="layout-left">
      <Eyebrow n="11" label="БИЗНЕС БА ХӨРӨНГӨ ОРУУЛАЛТ" />
      <Title>Олон улсын зах зээлд өргөжих ба шинэ боломжууд</Title>
      <Lead>
        Жижиг, дунд бизнесүүд ч интернетээр дамжуулан дэлхийн 8 тэрбум хэрэглэгчид бүтээгдэхүүнээ шууд санал
        болгох боломж бүрдлээ.
      </Lead>
      <div className="stats">
        <Stat
          i={3}
          value={<Counter to={50} suffix=" САЯ+" />}
          label="M-Pesa мобайл банкаар бизнесээ эхлүүлсэн Африк тивийн жижиг бизнес эрхлэгчид"
          accent="#10b981"
        />
        <Stat
          i={4}
          value={<>Global</>}
          label="Amazon, Shopify, Stripe зэрэг платформуудаар дэлхийн зах зээлээс шууд орлого олох гарц"
          accent="#10b981"
        />
      </div>
      <Points
        start={5}
        items={[
          "Олон улсын венчур сангууд, хөрөнгө оруулагчдаас гарааны бизнесүүд санхүүжилт татах үүд нээгдсэн",
          "Монголын үндэсний үйлдвэрлэгчид (ноолуур, арьс шир, чацаргана) олон улсын цахим худалдаанд гарч байна",
          "Цахим төлбөр тооцооны системүүд хил дамнасан санхүүгийн гүйлгээг найдвартай, хялбар болгосон",
          "Дэлхийн бизнесийн түншлэлүүд нь дотоодын компаниудын засаглал, стандартыг олон улсын түвшинд хүргэв",
        ]}
      />
    </div>
  );
}

// 14. Гадаад хэл сурах боломж
function S14() {
  return (
    <div className="layout-right">
      <Eyebrow n="12" label="ГАДААД ХЭЛ" />
      <Title>Гадаад хэл эзэмших таатай орчин ба дэлхийн иргэн</Title>
      <Lead>
        Гадаад хэл сурах нь зөвхөн хичээлийн танхимд бус, өдөр тутмын амьдралын салшгүй хэрэглээ, соёл болон
        хувирсан.
      </Lead>
      <div className="grid-2">
        <Tilt i={3} className="card">
          <Icon name="book" size={24} />
          <h3>Дижитал сургалт</h3>
          <p>Duolingo, YouTube, олон улсын подкаст, кино контентоор дамжуулан төрөлх хэл шигээ үнэгүй сурах орчин</p>
        </Tilt>
        <Tilt i={4} className="card">
          <Icon name="users" size={24} />
          <h3>Олон соёлын ур чадвар</h3>
          <p>Гадаад хэл эзэмшсэнээр олон улсын байгууллагуудад ажиллах, дэлхийн хэмжээний үнэлэмжтэй болох түлхүүр</p>
        </Tilt>
      </div>
      <Points
        start={5}
        items={[
          "Англи болон бусад гадаад хэлийг бага наснаасаа эзэмшиж, дэлхийн залуустай эн тэнцүү өрсөлдөх нөхцөл бүрдсэн",
          "Гадаад хэлтэй монгол мэргэжилтнүүд олон улсын төслүүдийг эх орондоо амжилттай удирдаж байна",
          "Хэлний мэдлэг нь олон улсын тэтгэлэг авах, дэлхийн тэргүүлэгч мэдээллийн эх сурвалжийг шууд ашиглах үндэс",
          "Өөр өөр үндэстний сэтгэлгээг ойлгож, соёлын харилцааны зөв дадал эзэмших боломж",
        ]}
      />
    </div>
  );
}

// 15. Байгаль орчны олон улсын хамтын ажиллагаа
function S15() {
  return (
    <div className="layout-left">
      <Eyebrow n="13" label="БАЙГАЛЬ ОРЧИН" />
      <Title>Эх дэлхийгээ хамгаалах олон улсын нэгдсэн хамтын ажиллагаа</Title>
      <Lead>
        Байгаль орчны доройтол, уур амьсгалын өөрчлөлтийг аль нэг улс дангаараа бус, дэлхий нийтээр нэгдэн
        шийдвэрлэж байна.
      </Lead>
      <div className="grid-2">
        <Tilt i={3} className="card">
          <Icon name="leaf" size={24} />
          <h3>Парисын хэлэлцээр</h3>
          <p>190 гаруй орон нэгдэж, дэлхийн дулаарлыг хязгаарлах хамтын үүрэг амлалт авсан нь түүхэн алхам юм</p>
        </Tilt>
        <Tilt i={4} className="card">
          <Icon name="sparkle" size={24} />
          <h3>Ногоон технологи</h3>
          <p>Нар, салхины сэргээгдэх эрчим хүчний технологи дэлхий даяар түгэж, өртөг нь 80 гаруй хувиар хямдарсан</p>
        </Tilt>
      </div>
      <Points
        start={5}
        items={[
          "Олон улсын санхүүжилт (Ногоон уур амьсгалын сан)-ээр хөгжиж буй орнуудын экологийг хамгаалж байна",
          "Монгол Улсын «Тэрбум мод» үндэсний хөдөлгөөн НҮБ-ын Цөлжилттэй тэмцэх конвенц (COP17)-той нягт уялдаж байна",
          "Байгаль орчны мэдээлэл, хиймэл дагуулын хяналтын системийг дэлхийн улсууд нээлттэй хуваалцаж байна",
          "Ховордсон ан амьтан, онгон байгалиа дэлхийн нийтийн өв болгон хамгаалах тогтолцоо бүрдсэн",
        ]}
      />
    </div>
  );
}

// 16. Амьдралын чанарын дээшлэлт
function S16() {
  return (
    <div className="layout-split">
      <div>
        <Eyebrow n="14" label="АМЬДРАЛЫН ЧАНАР" />
        <Title>Хүний хөгжил ба амьдралын чанарын түүхэн өсөлт</Title>
        <Lead>
          Даяаршлын үр дүнд хүний сонголтын эрх чөлөө, эрүүл мэнд, боловсрол, тав тухтай амьдрах боломж
          мэдэгдэхүйц дээшилсэн.
        </Lead>
        <Points
          start={3}
          items={[
            "Дэлхийн Хүний Хөгжлийн Индекс (HDI) сүүлийн гучин жилд тогтвортой өсөж, ядуурлын түвшин буурсан",
            "Ахуйн хөдөлмөрийг хөнгөвчилсөн ухаалаг төхөөрөмжүүд жирийн иргэдийн өдөр тутмын хэрэглээ болов",
            "Мэдээлэл, харилцаа, аяллын хялбар байдал нь амьдралын сэтгэл ханамж, эрх чөлөөг эрс нэмэгдүүлсэн",
            "Хүн төрөлхтний дундаж давхарга дэлхийн түүхэнд анх удаа олонх болж, боломж тэгш тархаж байна",
          ]}
        />
      </div>
      <Reveal i={3} className="chart-card">
        <div className="chart-head">
          <span>Дэлхийн хүний хөгжлийн индекс (HDI)</span>
          <span className="chart-big">
            <Counter from={0.601} to={0.739} decimals={3} duration={2200} />
          </span>
        </div>
        <LineChart
          id="hdi"
          min={0.55}
          max={0.78}
          format={(v) => v.toFixed(3)}
          points={[
            [1990, 0.601],
            [2000, 0.645],
            [2010, 0.698],
            [2022, 0.739],
          ]}
        />
        <div className="source in-card">Эх сурвалж: НҮБ-ын Хөгжлийн хөтөлбөр (UNDP)</div>
      </Reveal>
    </div>
  );
}

// 17. Даяаршлын Монгол Улсад үзүүлж буй эерэг нөлөө
function S17() {
  return (
    <div className="layout-left">
      <CaseTag n="МОНГОЛ УЛС" place="БОДИТ ОЛОЛТ БА БОЛОМЖУУД" />
      <Title>Даяаршлын Монгол Улсад авчирсан түүхэн үр өгөөж</Title>
      <div className="stats stats-4">
        <Stat
          i={2}
          value={<Counter from={1990} to={1997} duration={1200} grouping={false} />}
          label="ДХБ-ын бүрэн эрхт гишүүн болж, дэлхийн худалдааны дүрмээр хамгаалагдсан"
          accent={C.mn}
        />
        <Stat
          i={3}
          value={<Counter to={200} suffix="K+" />}
          label="Монгол иргэн гадаадад суралцаж, олон улсын өндөр туршлага хуримтлуулсан"
          accent={C.mn}
        />
        <Stat
          i={4}
          value={<Counter to={0.741} decimals={3} />}
          label="Монгол Улсын HDI — «Хүний хөгжил өндөр» орны ангилалд баттай орсон"
          accent={C.mn}
        />
        <Stat
          i={5}
          value={<>Оюу толгой</>}
          label="Дэлхийн хамгийн орчин үеийн гүний уурхайн хөрөнгө оруулалт, технологи"
          accent={C.mn}
        />
      </div>
      <Points
        start={6}
        items={[
          "The HU, морин хуур, үндэсний урлаг дэлхийн тайзнаа гарч, Монгол брэндийн нэр хүндийг өсгөсөн",
          "Цахим эдийн засгийн ачаар монгол залуус Google, Amazon, Meta зэрэг дэлхийн аваргуудад ажиллаж байна",
          "Эх орондоо дэлхийн түвшний 4G/5G, дижитал банк, финтекийн үйлчилгээг бүрэн дүүрэн ашиглаж байна",
          "Уул уурхай, ноолууран бүтээгдэхүүн дэлхийн нийлүүлэлтийн сүлжээнд чухал байр суурь эзэлдэг болсон",
        ]}
      />
    </div>
  );
}

// 18. Дүгнэлт
function S18() {
  return (
    <div className="layout-final">
      <Reveal i={0} className="hero-kicker">
        ИЛТГЭЛИЙН ДҮГНЭЛТ
      </Reveal>
      <h2 className="final-title">
        <Split text="Даяаршил — Хүн төрөлхтний хамтын хөгжил ба ирээдүйн давуу тал" delay={100} step={50} />
      </h2>
      <div className="final-row">
        {[
          ["trend", "Худалдаа ба баялаг"],
          ["cpu", "Технологи ба инноваци"],
          ["heart", "Эрүүл мэнд ба урт наслалт"],
          ["cap", "Тэгш боловсрол"],
          ["music", "Соёлын солилцоо"],
          ["shield", "Энх тайван ба байгаль орчин"],
        ].map(([ic, t], k) => (
          <Tilt i={3 + k} key={t} className="final-chip">
            <Icon name={ic} size={20} />
            {t}
          </Tilt>
        ))}
      </div>
      <Points
        start={7}
        items={[
          "Даяаршил нь дэлхийн улс орнуудыг худалдаа, шинжлэх ухаан, технологиор холбосон хамгийн том давуу тал",
          "Боловсрол, гадаад хэл, дижитал ур чадвартай залуусын өмнө дэлхий тэр чигээрээ нээлттэй талбар болсон",
          "Монгол Улс дэлхийтэй хөл нийлүүлэн алхаж, өөрийн онцлог давуу талуудаараа олон улсад манлайлах бүрэн боломжтой",
        ]}
      />
      <Reveal i={10} className="thanks">
        Анхаарал хандуулсанд баярлалаа!
      </Reveal>
    </div>
  );
}

// ---------- 18 Слайдын тодорхойлолт ----------

export type SlideDef = { nav: string; pose: Pose; Comp: () => ReactNode };

export const SLIDES: SlideDef[] = [
  { nav: "Нүүр", Comp: S01, pose: { x: 0, y: -1.25, s: 2.7, dim: 1, color: C.hero, arcs: 1.2 } },
  { nav: "Тодорхойлолт", Comp: S02, pose: { x: 0, y: 0, s: 1.6, dim: 0.35, color: "#38bdf8", arcs: 0.6 } },
  { nav: "Худалдаа", Comp: S03, pose: { x: 0.52, y: 0, s: 1.55, dim: 1, color: C.econ, arcs: 2.2 } },
  { nav: "Эдийн засаг", Comp: S04, pose: { x: -0.58, y: 0, s: 1.25, dim: 0.75, color: C.econ } },
  { nav: "Ажлын байр", Comp: S05, pose: { x: 0.55, y: 0, s: 1.5, dim: 1, color: C.econ, focus: LOC.bengaluru } },
  { nav: "Боловсрол", Comp: S06, pose: { x: -0.55, y: 0, s: 1.4, dim: 0.95, color: C.edu, arcs: 1.6 } },
  { nav: "Технологи", Comp: S07, pose: { x: 0.5, y: 0, s: 1.25, dim: 0.55, color: C.tech, arcs: 2.4 } },
  { nav: "Харилцаа холбоо", Comp: S08, pose: { x: 0.52, y: 0, s: 1.55, dim: 1, color: C.tech, arcs: 2.6 } },
  { nav: "Соёл", Comp: S09, pose: { x: 0.55, y: 0, s: 1.5, dim: 1, color: C.culture, focus: LOC.seoul } },
  { nav: "Аялал жуулчлал", Comp: S10, pose: { x: -0.55, y: 0, s: 1.5, dim: 1, color: "#fbbf24", focus: LOC.europe } },
  { nav: "Эрүүл мэнд", Comp: S11, pose: { x: -0.58, y: 0, s: 1.25, dim: 0.8, color: C.health } },
  { nav: "Шинжлэх ухаан", Comp: S12, pose: { x: 0, y: 0.56, s: 0.75, dim: 1, color: C.health, focus: LOC.mainz } },
  { nav: "Бизнес", Comp: S13, pose: { x: -0.55, y: 0, s: 1.5, dim: 1, color: "#10b981", focus: LOC.nairobi } },
  { nav: "Гадаад хэл", Comp: S14, pose: { x: 0.55, y: 0, s: 1.5, dim: 1, color: C.edu, focus: LOC.europe } },
  { nav: "Байгаль орчин", Comp: S15, pose: { x: 0.55, y: 0, s: 1.5, dim: 1, color: C.peace, focus: LOC.brussels } },
  { nav: "Амьдралын чанар", Comp: S16, pose: { x: 0.5, y: 0, s: 1.3, dim: 0.4, color: "#38bdf8", arcs: 1.4 } },
  { nav: "Монгол Улс", Comp: S17, pose: { x: 0.55, y: 0, s: 1.55, dim: 1, color: C.mn, focus: LOC.ub } },
  { nav: "Дүгнэлт", Comp: S18, pose: { x: 0, y: 0, s: 1.25, dim: 0.55, color: C.hero, arcs: 2.4 } },
];
