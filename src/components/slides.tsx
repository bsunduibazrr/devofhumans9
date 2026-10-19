"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { Pose } from "@/lib/deck";
import { Bars, LineChart } from "./charts";
import { Counter, Icon, Reveal, Split, Tilt } from "./ui";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const GoToContext = createContext<(i: number) => void>(() => {});

const C = {
  hero: "#38e1ff",
  hist: "#ffc86b",
  econ: "#ffb547",
  tech: "#38e1ff",
  edu: "#a78bfa",
  health: "#3ef0a1",
  culture: "#ff5fa2",
  peace: "#6aa8ff",
  mn: "#4d8dff",
};

const LOC = {
  mongolia: [47.5, 103.5] as [number, number],
  ub: [47.92, 106.92] as [number, number],
  seoul: [37.57, 126.98] as [number, number],
  china: [33.5, 110] as [number, number],
  hanoi: [19.5, 105.8] as [number, number],
  nairobi: [-1.29, 36.82] as [number, number],
  bengaluru: [14, 77.59] as [number, number],
  europe: [50, 10] as [number, number],
  mainz: [50, 8.27] as [number, number],
  brussels: [50.85, 4.35] as [number, number],
};

// ---------- Дахин ашиглагдах хэсгүүд ----------

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <Reveal i={0} className="eyebrow">
      <span className="eyebrow-n">{n}</span>
      <span className="eyebrow-line" />
      <span>{label}</span>
    </Reveal>
  );
}

function CaseTag({ n, place }: { n: string; place: string }) {
  return (
    <Reveal i={0} className="case-tag">
      <span className="case-pill">Кейс {n}</span>
      <span className="case-place">
        <span className="ping" />
        {place}
      </span>
    </Reveal>
  );
}

function Title({ children, i = 1, delay = 120 }: { children: string; i?: number; delay?: number }) {
  return (
    <h2 className="h2" style={{ "--i": i } as Vars}>
      <Split text={children} delay={delay} />
    </h2>
  );
}

function Lead({ children, i = 3 }: { children: ReactNode; i?: number }) {
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
        <Reveal as="li" i={start + k} key={k} className="point" >
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

// ---------- Слайдууд ----------

function S01() {
  const word = "ДАЯАРШИЛ";
  return (
    <div className="layout-hero">
      <Reveal i={0} className="hero-kicker">
        <span className="ping" /> Хүний хөгжил · Илтгэл
      </Reveal>
      <h1 className="hero-title" aria-label={word}>
        {word.split("").map((ch, k) => (
          <span key={k} className="hero-ch" style={{ "--k": k } as Vars} aria-hidden>
            {ch}
          </span>
        ))}
      </h1>
      <Reveal i={6} className="hero-sub">
        түүний <em>давуу талууд</em>
      </Reveal>
      <Reveal i={8} className="hero-hint">
        <span className="mouse">
          <span />
        </span>
        Доош гүйлгэх эсвэл → товч
      </Reveal>
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, r) => (
            <span key={r}>
              Худалдаа ✦ Технологи ✦ Боловсрол ✦ Эрүүл мэнд ✦ Соёл ✦ Хамтын ажиллагаа ✦ Боломж ✦
              Хөгжил ✦&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function S02() {
  const goTo = useContext(GoToContext);
  const items: [string, string, number][] = [
    ["Даяаршил гэж юу вэ?", "Тодорхойлолт", 2],
    ["Түүхэн дэх даяаршил", "Фридман · Их Монгол Улс", 3],
    ["Эдийн засгийн давуу тал", "Худалдаа · Ядуурал · Кейсүүд", 6],
    ["Технологи ба мэдлэг", "Интернет · M-Pesa · Энэтхэг", 12],
    ["Боловсрол ба эрүүл мэнд", "Erasmus+ · Вакцин", 15],
    ["Соёл ба энх тайван", "Халлю · Монгол соёл · ЕХ", 19],
    ["Хүний хөгжил ба Монгол", "HDI · Монгол · Дүгнэлт", 22],
  ];
  return (
    <div className="layout-left">
      <Eyebrow n="00" label="Агуулга" />
      <Title>Өнөөдрийн аялал</Title>
      <ol className="agenda">
        {items.map(([t, s, to], k) => (
          <Reveal as="li" i={3 + k} key={t}>
            <button className="agenda-row" onClick={() => goTo(to)} data-cursor>
              <span className="agenda-n">{String(k + 1).padStart(2, "0")}</span>
              <span className="agenda-t">{t}</span>
              <span className="agenda-s">{s}</span>
              <span className="agenda-arrow">→</span>
            </button>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function S03() {
  return (
    <div className="layout-right">
      <Eyebrow n="01" label="Тодорхойлолт" />
      <Title>Даяаршил гэж юу вэ?</Title>
      <Reveal as="blockquote" i={3} className="quote">
        <span className="quote-mark">“</span>
        Дэлхийн улс орнууд, хүн ам бие биетэйгээ холбоо хамааралтай байж, тасралтгүй харилцаанд байх
        явцыг <b>ихэсгэж</b>, <b>илүү хүчтэй</b> болгож, <b>хурдасгаж</b> байгаа үйл явц.
        <cite>— Дэвид Хэлд нар, 1999</cite>
      </Reveal>
      <div className="chips">
        {[
          ["ship", "Бараа, худалдаа"],
          ["wallet", "Хөрөнгө оруулалт"],
          ["globe", "Мэдээлэл, санаа"],
          ["users", "Хүмүүс, соёл"],
        ].map(([ic, t], k) => (
          <Tilt i={5 + k} key={t} className="chip" max={18}>
            <Icon name={ic} size={20} />
            {t}
          </Tilt>
        ))}
      </div>
    </div>
  );
}

function S04() {
  const eras = [
    { v: "1.0", y: "1492 – 1800", who: "Улс орнууд", t: "Дэлхий аварга томоос дунд хэмжээтэй болов" },
    { v: "2.0", y: "1800 – 2000", who: "Компаниуд", t: "Дэлхий дунд хэмжээнээс жижиг болов" },
    { v: "3.0", y: "2000 – өнөөдөр", who: "Хувь хүн", t: "Дэлхий өчүүхэн болж, хүн бүр дэлхийн тавцанд гарах боломжтой боллоо" },
  ];
  return (
    <div className="layout-bottom">
      <Eyebrow n="02" label="Түүхэн дэх даяаршил" />
      <Title>Дэлхий жижгэрч, боломж томорсоор</Title>
      <div className="eras">
        {eras.map((e, k) => (
          <Tilt i={4 + k} key={e.v} className={`era era-${k}`}>
            <div className="era-v">
              <span>Даяаршил</span>
              {e.v}
            </div>
            <div className="era-y">{e.y}</div>
            <div className="era-who">{e.who}</div>
            <p className="era-t">{e.t}</p>
            <div className="era-bar" style={{ "--w": `${100 - k * 34}%` } as Vars} />
          </Tilt>
        ))}
      </div>
      <Source i={8}>Томас Л. Фридман, «Дэлхий хавтгай»</Source>
    </div>
  );
}

function S05() {
  return (
    <div className="layout-left">
      <Eyebrow n="02" label="Түүхэн дэх даяаршил" />
      <Title>Их Монгол Улс — түүхэн даяаршил</Title>
      <Lead>
        XIII зуунд Их Монгол Улс Ази, Европын ихэнх нутгийг нэг удирдлага дор нэгтгэснээр
        «Pax Mongolica» буюу Монголын энх тайвны үе эхэлсэн.
      </Lead>
      <div className="grid-2">
        <Tilt i={5} className="card">
          <Icon name="route" />
          <h3>Торгоны зам</h3>
          <p>Худалдаачид Хятадаас Европ хүртэл аюулгүй зорчдог болов</p>
        </Tilt>
        <Tilt i={6} className="card">
          <Icon name="mail" />
          <h3>Өртөөний шуудан</h3>
          <p>Евразийг холбосон мэдээллийн хурдан сүлжээ</p>
        </Tilt>
        <Tilt i={7} className="card">
          <Icon name="badge" />
          <h3>Пайз</h3>
          <p>Зорчигчийг хамгаалсан дэлхийн анхны «паспорт»-уудын нэг</p>
        </Tilt>
        <Tilt i={8} className="card">
          <Icon name="sparkle" />
          <h3>Мэдлэг солилцоо</h3>
          <p>Цаас, луужин, анагаах ухаан, одон орон зүй тархсан</p>
        </Tilt>
      </div>
    </div>
  );
}

function S06() {
  const pillars = [
    { ic: "trend", t: "Эдийн засаг", s: "Худалдаа, ажлын байр, баялаг", c: C.econ },
    { ic: "cpu", t: "Технологи", s: "Мэдээлэл, инноваци", c: C.tech },
    { ic: "cap", t: "Боловсрол", s: "Хил хязгааргүй мэдлэг", c: C.edu },
    { ic: "heart", t: "Эрүүл мэнд", s: "Анагаах ухааны хамтын ололт", c: C.health },
    { ic: "music", t: "Соёл", s: "Харилцан баяжих", c: C.culture },
    { ic: "users", t: "Энх тайван", s: "Хамтын ажиллагаа", c: C.peace },
  ];
  return (
    <div className="layout-center">
      <Eyebrow n="03" label="Тойм" />
      <Title>Давуу талын 6 тулгуур</Title>
      <div className="pillars">
        {pillars.map((p, k) => (
          <Tilt i={3 + k} key={p.t} className="pillar" accent={p.c}>
            <div className="pillar-ic">
              <Icon name={p.ic} size={28} />
            </div>
            <div className="pillar-n">0{k + 1}</div>
            <h3>{p.t}</h3>
            <p>{p.s}</p>
          </Tilt>
        ))}
      </div>
    </div>
  );
}

function S07() {
  return (
    <div className="layout-left">
      <Eyebrow n="04" label="Эдийн засаг" />
      <Title>Чөлөөт худалдаа баялгийг өсгөдөг</Title>
      <Lead>
        Улс бүр хамгийн сайн хийдэг зүйлдээ төвлөрч, дэлхийн зах зээлд гаргаснаар үйлдвэрлэл, орлого,
        ажлын байр нэмэгддэг.
      </Lead>
      <div className="stats">
        <Stat
          i={5}
          value={
            <>
              $<Counter to={24} />
              <small> их наяд</small>
            </>
          }
          label={<>Дэлхийн барааны экспорт, 2023 он (1950 онд ердөө $62 тэрбум)</>}
        />
        <Stat
          i={6}
          value={<Counter to={166} />}
          label={<>Дэлхийн худалдааны байгууллагын гишүүн орон</>}
        />
      </div>
      <Source>Дэлхийн худалдааны байгууллага (ДХБ)</Source>
    </div>
  );
}

function S08() {
  return (
    <div className="layout-right">
      <Eyebrow n="04" label="Эдийн засаг" />
      <Title>Түүхэн дэх ядуурлын хамгийн хурдан бууралт</Title>
      <Reveal i={4} className="chart-card">
        <div className="chart-head">
          <span>Нэн ядуу хүн амын эзлэх хувь</span>
          <span className="chart-big">
            <Counter from={38} to={9} duration={2400} delay={500} suffix="%" />
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
      <Lead i={6}>
        Худалдаа, хөрөнгө оруулалтад нээлттэй болсон орнуудад <b>1 тэрбум гаруй хүн</b> нэн ядуурлаас
        гарсан.
      </Lead>
      <Source i={7}>Дэлхийн банк (өдөрт $2.15-аас бага орлоготой)</Source>
    </div>
  );
}

function S09() {
  return (
    <div className="layout-left">
      <CaseTag n="01" place="Өмнөд Солонгос" />
      <Title>Ядуу орноос технологийн аварга болсон нь</Title>
      <Reveal i={4} className="chart-card">
        <div className="chart-head">
          <span>Нэг хүнд ногдох ДНБ (ам.доллар)</span>
        </div>
        <Bars
          prefix="$"
          data={[
            { label: "1960", value: 158 },
            { label: "1980", value: 1715 },
            { label: "2000", value: 12260 },
            { label: "2023", value: 33120 },
          ]}
        />
      </Reveal>
      <Points
        start={6}
        items={[
          "Экспортод чиглэсэн бодлого — дэлхийн зах зээл рүү",
          "Samsung, Hyundai, LG дэлхийн брэнд болсон",
          "1996 онд хөгжингүй орнуудын OECD-д элссэн",
        ]}
      />
    </div>
  );
}

function S10() {
  return (
    <div className="layout-right">
      <CaseTag n="02" place="Хятад" />
      <Title>Нээлттэй бодлогын хүч</Title>
      <div className="mega">
        <Reveal i={3} className="mega-v">
          <Counter to={800} duration={2200} />
          <small>сая</small>
        </Reveal>
        <Reveal i={4} className="mega-l">
          хүн 1978 оноос хойш ядуурлаас гарсан
        </Reveal>
      </div>
      <div className="timeline-mini">
        {[
          ["1978", "Шинэчлэл, нээлттэй бодлого"],
          ["2001", "ДХБ-д элссэн"],
          ["2009", "Дэлхийн хамгийн том экспортлогч"],
        ].map(([y, t], k) => (
          <Tilt i={5 + k} key={y} className="tm">
            <b>{y}</b>
            <span>{t}</span>
          </Tilt>
        ))}
      </div>
      <Source i={8}>Дэлхийн банк, 2022</Source>
    </div>
  );
}

function S11() {
  return (
    <div className="layout-left">
      <CaseTag n="03" place="Вьетнам" />
      <Title>«Đổi Mới» — шинэчлэлийн гайхамшиг</Title>
      <Lead>1986 онд эдийн засгаа дэлхийд нээж, гадаадын хөрөнгө оруулалтыг урьсан.</Lead>
      <div className="compare">
        <Tilt i={5} className="cmp cmp-old">
          <span>1990-ээд оны эх</span>
          <b>
            <Counter to={50} suffix="%+" />
          </b>
          <em>ядуу хүн ам</em>
        </Tilt>
        <div className="cmp-arrow rv" style={{ "--i": 6 } as Vars}>
          →
        </div>
        <Tilt i={7} className="cmp cmp-new">
          <span>Өнөөдөр</span>
          <b>
            <Counter from={50} to={5} prefix="<" suffix="%" duration={2400} delay={700} />
          </b>
          <em>ядуу хүн ам</em>
        </Tilt>
      </div>
      <Points
        start={8}
        items={["2007 онд ДХБ-д элссэн", "Samsung-ийн гар утасны тал орчим нь Вьетнамд үйлдвэрлэгддэг"]}
      />
    </div>
  );
}

function S12() {
  const nodes = [
    { t: "Дизайн", c: "АНУ", x: 20, y: 10 },
    { t: "Чип", c: "Тайвань", x: 80, y: 10 },
    { t: "Дэлгэц", c: "Өмнөд Солонгос", x: 88, y: 50 },
    { t: "Камер", c: "Япон", x: 78, y: 90 },
    { t: "Угсралт", c: "Хятад · Энэтхэг · Вьетнам", x: 24, y: 90 },
    { t: "Ашигт малтмал", c: "Африк · Өмнөд Америк", x: 11, y: 50 },
  ];
  return (
    <div className="layout-split">
      <div>
        <Eyebrow n="04" label="Эдийн засаг" />
        <Title>Нэг утас — олон орны хөдөлмөр</Title>
        <Lead>Дэлхийн нийлүүлэлтийн сүлжээ бүтээгдэхүүнийг хямд, чанартай болгож, сонголтыг олшруулсан.</Lead>
        <Points
          start={5}
          items={["Хэрэглэгчид — хямд үнэ, олон сонголт", "Хөгжиж буй орнуудад — сая сая ажлын байр"]}
        />
      </div>
      <div className="supply rv" style={{ "--i": 4 } as Vars}>
        <svg className="supply-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {nodes.map((n, k) => (
            <line key={k} x1="50" y1="50" x2={n.x} y2={n.y} style={{ "--i": k } as Vars} />
          ))}
        </svg>
        <div className="supply-core">
          <Icon name="phone" size={44} />
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

function S13() {
  return (
    <div className="layout-left">
      <Eyebrow n="05" label="Технологи ба мэдлэг" />
      <Title>Мэдээлэл гэрлийн хурдаар</Title>
      <div className="mega">
        <Reveal i={3} className="mega-v">
          <Counter to={5.5} decimals={1} duration={2000} />
          <small>тэрбум</small>
        </Reveal>
        <Reveal i={4} className="mega-l">
          хүн интернет хэрэглэж байна — дэлхийн хүн амын 68% (2024)
        </Reveal>
      </div>
      <div className="grid-3">
        {[
          ["book", "Мэдлэг", "Дэлхийн номын сан халаасанд"],
          ["wallet", "Бизнес", "Жижиг бизнес ч дэлхийд худалдаална"],
          ["users", "Харилцаа", "Тив дамнан хоромхон зуур"],
        ].map(([ic, t, s], k) => (
          <Tilt i={5 + k} key={t} className="card card-sm">
            <Icon name={ic} />
            <h3>{t}</h3>
            <p>{s}</p>
          </Tilt>
        ))}
      </div>
      <Source i={8}>Олон улсын цахилгаан холбооны байгууллага (ITU)</Source>
    </div>
  );
}

function S14() {
  return (
    <div className="layout-right">
      <CaseTag n="04" place="Кени" />
      <Title>M-Pesa: утсаар ядуурлыг ялсан нь</Title>
      <Lead>
        2007 онд Британийн Vodafone, Кенийн Safaricom хамтран гар утсаар мөнгө шилжүүлэх үйлчилгээг
        нэвтрүүлсэн — банкгүй сая сая хүнд санхүүгийн хүртээмж.
      </Lead>
      <div className="stats">
        <Stat
          i={5}
          value={<Counter to={194000} />}
          label="өрх буюу Кений нийт өрхийн 2% нэн ядуурлаас гарсан"
        />
        <Stat i={6} value={<Counter to={50} suffix=" сая+" />} label="хэрэглэгч Африкийн олон оронд" />
      </div>
      <Points start={7} items={["Эмэгтэй тэргүүлэгчтэй өрхөд хамгийн их үр өгөөжтэй"]} />
      <Source i={8}>Suri & Jack, Science сэтгүүл, 2016</Source>
    </div>
  );
}

function S15() {
  return (
    <div className="layout-left">
      <CaseTag n="05" place="Энэтхэг · Бангалор" />
      <Title>Дэлхийн «оффис» болсон Энэтхэг</Title>
      <Lead>
        Дэлхийн компаниуд програм хангамж, үйлчилгээгээ Энэтхэгт хийлгэснээр шинэ дунд анги бий болсон.
      </Lead>
      <div className="stats">
        <Stat i={5} value={<Counter to={5} suffix=" сая+" />} label="IT салбарын ажилтан" />
        <Stat
          i={6}
          value={
            <>
              $<Counter to={200} />
              <small> тэрбум</small>
            </>
          }
          label="IT үйлчилгээний жилийн экспорт"
        />
      </div>
      <Points start={7} items={["Google, Microsoft-ын гүйцэтгэх захирлууд Энэтхэгт төрж өссөн"]} />
      <Source i={8}>NASSCOM, 2024</Source>
    </div>
  );
}

function S16() {
  return (
    <div className="layout-right">
      <Eyebrow n="06" label="Боловсрол" />
      <Title>Мэдлэг хил хязгааргүй</Title>
      <div className="compare">
        <Tilt i={4} className="cmp cmp-old">
          <span>2000 он</span>
          <b>
            <Counter to={2.1} decimals={1} />
          </b>
          <em>сая гадаад оюутан</em>
        </Tilt>
        <div className="cmp-arrow rv" style={{ "--i": 5 } as Vars}>
          →
        </div>
        <Tilt i={6} className="cmp cmp-new">
          <span>2022 он</span>
          <b>
            <Counter to={6.9} decimals={1} delay={600} />
          </b>
          <em>сая гадаад оюутан</em>
        </Tilt>
      </div>
      <Points
        start={7}
        items={[
          "Coursera-д 150 сая гаруй хүн онлайнаар суралцаж байна",
          "Khan Academy, YouTube — дэлхийн шилдэг хичээл үнэ төлбөргүй",
          "Гадаад хэл, олон соёлын туршлага — ирээдүйн ур чадвар",
        ]}
      />
      <Source i={10}>ЮНЕСКО</Source>
    </div>
  );
}

function S17() {
  return (
    <div className="layout-left">
      <CaseTag n="06" place="Европын Холбоо" />
      <Title>Erasmus+: хилгүй их сургууль</Title>
      <Lead>1987 оноос хойш Европын оюутнууд өөр оронд 3–12 сар суралцаж, дадлага хийх боломжтой болсон.</Lead>
      <div className="stats">
        <Stat i={5} value={<Counter to={15} suffix=" сая+" />} label="хүн хөтөлбөрт хамрагдсан" />
        <Stat i={6} value={<Counter to={1} suffix=" сая" />} label="«Erasmus хүүхэд» — хөтөлбөрөөр танилцсан хосуудын хүүхэд (тооцоо)" />
      </div>
      <Points start={7} items={["Оролцогчид ажилд орох чадвар, хэлний мэдлэгээрээ давуу"]} />
      <Source i={8}>Европын Комисс</Source>
    </div>
  );
}

function S18() {
  return (
    <div className="layout-right">
      <Eyebrow n="07" label="Эрүүл мэнд" />
      <Title>Хүн төрөлхтөн урт удаан насалдаг болов</Title>
      <Reveal i={4} className="chart-card">
        <div className="chart-head">
          <span>Дэлхийн дундаж наслалт (жил)</span>
          <span className="chart-big">
            <Counter from={46} to={73} duration={2400} delay={500} />
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
        start={6}
        items={[
          "1980 онд цэцэг өвчнийг дэлхий нийтийн хамтын вакцинжуулалтаар бүрэн устгасан",
          "Саа өвчний тохиолдол 1988 оноос хойш 99%-иар буурсан",
        ]}
      />
      <Source i={8}>НҮБ, ДЭМБ</Source>
    </div>
  );
}

function S19() {
  const steps = [
    { d: "2020.01", t: "Хятадын эрдэмтэд вирусын геномыг дэлхийд нээлттэй нийтэлсэн" },
    { d: "2020", t: "BioNTech (Герман) + Pfizer (АНУ) хамтран вакцин бүтээв" },
    { d: "2020.12", t: "Анхны вакцин зөвшөөрөгдсөн — 1 жил хүрэхгүй хугацаанд" },
    { d: "COVAX", t: "~2 тэрбум тун 140 гаруй оронд хүргэгдсэн" },
  ];
  return (
    <div className="layout-bottom">
