"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import arxivLogo from "./images/logo/arxiv-mark.svg";
import githubLogo from "./images/logo/Octicons-mark-github.svg";
import huggingFaceLogo from "./images/logo/huggingface-mark.png";
import institute1Logo from "./images/logo/institute1.png";
import institute2Logo from "./images/logo/institute2.png";
import tsinghuaLogo from "./images/logo/tsinghua.png";
import zhejiangLogo from "./images/logo/zhejiang.png";
import institute6Logo from "./images/logo/institute6-flower.png";
import motivationFigure from "./images/Figure1.png";
import overviewFigure from "./images/Figure2.png";
import toolCallsFigure from "./images/paper/tool-calls-per-question.png";
import toolDistributionFigure from "./images/paper/tool-call-distribution.png";
import ablationTrendFigure from "./images/paper/ablation-trend.png";
import ablationMixFigure from "./images/paper/ablation-tool-mix.png";
import rewardFigure from "./images/paper/rl-answer-reward.png";
import lengthFigure from "./images/paper/rl-response-length.png";

const repository = "https://github.com/JiepengZhou/MMSearch-OPD";

type Author = {
  name: string;
  affiliation: string;
  equal?: boolean;
  leader?: boolean;
  corresponding?: boolean;
};

const authors: Author[] = [
  { name: "Huanyao Zhang", affiliation: "1", equal: true, leader: true },
  { name: "Jiepeng Zhou", affiliation: "2", equal: true },
  { name: "Jiaye Lin", affiliation: "3", equal: true },
  { name: "Ontai Tang", affiliation: "4" },
  { name: "Jingtian Hao", affiliation: "1" },
  { name: "Mugeng Liu", affiliation: "1" },
  { name: "Ru Peng", affiliation: "5" },
  { name: "Lang Mei", affiliation: "6" },
  { name: "Xiaohan Yu", affiliation: "6" },
  { name: "Liyan Liu", affiliation: "6" },
  { name: "Chong Chen", affiliation: "6", corresponding: true },
  { name: "Wentao Zhang", affiliation: "1", corresponding: true },
];

const affiliations = [
  { id: "1", name: "Peking University", label: "Peking University", logo: institute1Logo },
  { id: "2", name: "HKUST(GZ)", label: "HKUST(GZ)", logo: institute2Logo },
  { id: "3", name: "Tsinghua University", label: "Tsinghua University", logo: tsinghuaLogo },
  { id: "4", name: "HKUST", label: "HKUST", logo: institute2Logo },
  { id: "5", name: "Zhejiang University", label: "Zhejiang University", logo: zhejiangLogo },
  { id: "6", name: "Huawei Cloud BU", label: "Huawei Cloud BU", logo: institute6Logo },
];

const sections = [
  { id: "motivation", short: "Motivation" },
  { id: "overview", short: "Overview" },
  { id: "performance", short: "Performance" },
  { id: "refine", short: "Refine" },
  { id: "training", short: "OPD" },
  { id: "bibtex", short: "BibTeX" },
];

type ResultRow = {
  name: string;
  values: string[];
  ours?: boolean;
};

const benchmarkColumns = [
  "MMSearch",
  "LiveVQA",
  "BC-VL",
  "MM-BC",
  "MMSearch+",
  "BC-V³",
  "VisBrowse",
  "Avg.",
];

const benchmarkGroups: { label: string; rows: ResultRow[] }[] = [
  {
    label: "Direct Answer",
    rows: [
      { name: "GPT-5.5", values: ["68.7", "73.0", "47.9", "17.5", "20.3", "23.0", "36.1", "40.9"] },
      { name: "Gemini-3.1-Pro", values: ["64.2", "65.0", "41.4", "11.5", "26.4", "19.3", "23.7", "35.9"] },
      { name: "Claude-Opus-4.6", values: ["59.8", "53.1", "43.5", "13.2", "13.2", "15.0", "27.2", "32.1"] },
      { name: "Seed2.1-Pro", values: ["53.7", "68.7", "45.6", "14.3", "17.7", "17.0", "27.8", "35.0"] },
      { name: "Qwen3.5-27B", values: ["29.3", "56.7", "32.3", "5.0", "4.8", "9.3", "14.8", "21.7"] },
      { name: "Qwen3.5-9B", values: ["19.0", "52.0", "25.1", "3.25", "2.3", "7.3", "11.2", "17.2"] },
    ],
  },
  {
    label: "Agentic Workflow",
    rows: [
      { name: "GPT-5.5", values: ["82.7", "90.3", "68.2", "51.9", "48.6", "55.0", "66.3", "66.1"] },
      { name: "Gemini-3.1-Pro", values: ["82.7", "87.3", "65.9", "44.4", "51.5", "50.0", "62.1", "63.4"] },
      { name: "Claude-Opus-4.6", values: ["81.7", "88.0", "63.2", "49.4", "52.1", "55.0", "62.7", "64.6"] },
      { name: "Seed2.1-Pro", values: ["82.2", "89.7", "67.9", "60.8", "62.2", "61.7", "72.8", "71.0"] },
      { name: "Qwen3.5-27B", values: ["82.7", "87.0", "59.2", "38.5", "38.9", "39.7", "50.9", "56.7"] },
      { name: "Qwen3.5-9B", values: ["75.7", "79.0", "49.9", "25.3", "29.9", "23.7", "30.8", "44.9"] },
    ],
  },
  {
    label: "Multimodal Deep Search Agents · 7B–9B",
    rows: [
      { name: "MMSearch-R1-7B", values: ["53.8", "48.4", "—", "—", "—", "4.0", "—", "—"] },
      { name: "WebWatcher-7B", values: ["49.1", "51.2", "21.2", "—", "—", "4.7", "—", "—"] },
      { name: "DeepEyesV2-7B", values: ["63.7", "—", "—", "—", "—", "—", "—", "—"] },
      { name: "Vision-DeepResearch-8B", values: ["69.6", "76.7", "42.6", "—", "20.4", "11.7", "—", "—"] },
      { name: "OpenSearch-VL-8B", values: ["64.5", "59.6", "37.6", "—", "—", "—", "—", "—"] },
      { name: "SimpleSearch-VL-8B", values: ["77.1", "75.2", "52.1", "—", "32.5", "—", "—", "—"] },
      { name: "Visual-Seeker-8B", values: ["72.2", "—", "47.6", "16.1", "27.3", "—", "34.7", "—"] },
      { name: "DeepVoyager-VL-8B", values: ["72.7", "82.7", "58.4", "24.0", "37.1", "32.3", "47.3", "50.6"] },
      { name: "MMSearch-OPD-9B (SFT)", values: ["85.3", "87.3", "65.7", "38.8", "45.7", "33.0", "49.7", "57.9"], ours: true },
      { name: "MMSearch-OPD-9B (RL)", values: ["86.3", "89.0", "67.7", "42.0", "47.0", "37.3", "52.1", "60.2"], ours: true },
    ],
  },
  {
    label: "Multimodal Deep Search Agents · 27B–32B",
    rows: [
      { name: "WebWatcher-32B", values: ["55.3", "58.7", "27.0", "—", "—", "8.7", "—", "—"] },
      { name: "Vision-DeepResearch-30B-A3B", values: ["69.6", "77.6", "53.7", "—", "28.5", "—", "—", "—"] },
      { name: "REDSearcher-MM-30B-A3B †", values: ["72.9", "79.3", "57.2", "23.5", "26.6", "—", "—", "—"] },
      { name: "OpenSearch-VL-30B-A3B", values: ["68.7", "67.4", "41.1", "—", "—", "—", "—", "—"] },
      { name: "HyperEyes-30B-A3B", values: ["86.9", "81.6", "57.9", "—", "31.5", "—", "—", "—"] },
      { name: "SimpleSearch-VL-30B-A3B", values: ["83.6", "81.1", "55.9", "—", "34.4", "—", "—", "—"] },
      { name: "DeepVoyager-VL-30B-A3B", values: ["74.0", "82.7", "64.2", "30.5", "40.6", "35.0", "53.8", "54.4"] },
      { name: "MMSearch-OPD-27B (SFT)", values: ["86.3", "90.0", "69.4", "52.3", "44.4", "45.0", "55.0", "63.2"], ours: true },
    ],
  },
];

const refineRows: ResultRow[] = [
  { name: "Before Refine", values: ["72.7", "74.0", "29.0", "18.0"] },
  { name: "After Refine", values: ["79.0", "76.0", "35.8", "33.0"], ours: true },
  { name: "Δ", values: ["+6.3", "+2.0", "+6.8", "+15.0"] },
];

const stageRows: ResultRow[] = [
  { name: "Seed", values: ["79", "9.8", "18.4"] },
  { name: "Expand", values: ["65", "10.2", "21.4"] },
  { name: "Blur", values: ["44", "15.1", "30.2"] },
  { name: "Visualize", values: ["33", "20.2", "34.7"], ours: true },
];

const bibtex = `@misc{zhang2026mmsearchopdeasyhardhard,
      title={MMSearch-OPD: Easy Made Hard, Hard Made Learnable for Long-Horizon Multimodal Search Agents},
      author={Huanyao Zhang and Jiepeng Zhou and Jiaye Lin and Ontai Tang and Jingtian Hao and Mugeng Liu and Ru Peng and Lang Mei and Xiaohan Yu and Liyan Liu and Chong Chen and Wentao Zhang},
      year={2026},
      eprint={2610.22240},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2610.22240},
}`;

function SectionNavigation({ active, visible }: { active: string; visible: boolean }) {
  return (
    <aside
      className={`section-rail ${visible ? "is-visible" : ""} ${active === "bibtex" ? "on-dark" : ""}`}
      aria-label="Page sections"
    >
      <div className="rail-line" />
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={active === section.id ? "active" : ""}
          aria-current={active === section.id ? "location" : undefined}
        >
          <span className="rail-dot" />
          <small>{String(index + 1).padStart(2, "0")}</small>
          <b>{section.short}</b>
        </a>
      ))}
    </aside>
  );
}

function getNumericScore(value: string) {
  const scores = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return scores.length ? Math.max(...scores) : null;
}

function BenchmarkTable() {
  return (
    <figure className="data-card data-card-wide" id="performance-table" data-reveal="scale">
      <div className="card-heading">
        <div>
          <h3>Performance across seven multimodal search benchmarks</h3>
        </div>
        <p>Accuracy; higher is better.</p>
      </div>
      <div className="table-shell">
        <table className="paper-table benchmark-table">
          <thead>
            <tr>
              <th>Model</th>
              {benchmarkColumns.map((column) => <th key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {benchmarkGroups.map((group) => {
              const rankings = benchmarkColumns.map((_, columnIndex) => {
                const scores = group.rows
                  .map((row) => getNumericScore(row.values[columnIndex]))
                  .filter((score): score is number => score !== null);
                const uniqueScores = [...new Set(scores)].sort((a, b) => b - a);
                return { best: uniqueScores[0], second: uniqueScores[1] };
              });

              return (
                <Fragment key={group.label}>
                  <tr className="table-group">
                    <th colSpan={benchmarkColumns.length + 1}><span>{group.label}</span></th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr className={row.ours ? "ours-row" : ""} key={`${group.label}-${row.name}`}>
                      <th>{row.name}</th>
                      {row.values.map((value, index) => {
                        const score = getNumericScore(value);
                        const className = score === rankings[index].best
                          ? "best-result"
                          : score === rankings[index].second
                            ? "second-result"
                            : undefined;
                        return <td className={className} key={`${row.name}-${index}`}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <figcaption>
        <span>Table 1.</span> Performance (%) on seven multimodal search benchmarks. Within each
        comparison group, the best and second-best results are bolded and underlined, respectively.
        Avg. is the seven-benchmark mean. “—” denotes unreported results.
        † denotes initialization from a Thinking checkpoint.
      </figcaption>
    </figure>
  );
}

function CompactTable({
  number,
  title,
  columns,
  rows,
  caption,
  rowHeader,
}: {
  number: string;
  title: string;
  columns: string[];
  rows: ResultRow[];
  caption: string;
  rowHeader: string;
}) {
  return (
    <figure className="data-card compact-data-card" data-reveal="scale">
      <div className="card-heading">
        <div>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="table-shell">
        <table className="paper-table compact-table">
          <thead>
            <tr>
              <th>{rowHeader}</th>
              {columns.map((column) => <th key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className={row.ours ? "ours-row" : ""} key={`${row.name}-${rowIndex}`}>
                <th>{row.name}</th>
                {row.values.map((value, index) => <td key={`${row.name}-${index}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption><span>{number}.</span> {caption}</figcaption>
    </figure>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("motivation");
  const [showSectionNavigation, setShowSectionNavigation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const overview = elements[0];
    let animationFrame = 0;

    const updateNavigation = () => {
      animationFrame = 0;
      const readingLine = window.innerHeight * 0.38;
      let currentSection = elements[0]?.id ?? "motivation";

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top <= readingLine) currentSection = element.id;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24) {
        currentSection = elements.at(-1)?.id ?? currentSection;
      }

      setActiveSection(currentSection);
      setShowSectionNavigation(
        Boolean(overview && overview.getBoundingClientRect().top <= window.innerHeight * 0.7),
      );
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("top") ?? document.body;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = new Set<number>();

    const revealTargets = () => Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets().forEach((element) => element.setAttribute("data-revealed", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute("data-revealed", "true");
          else entry.target.removeAttribute("data-revealed");
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    const bind = (element: HTMLElement) => {
      if (element.dataset.revealBound === "true") return;
      element.dataset.revealBound = "true";
      element.dataset.revealReady = "true";
      const frame = window.requestAnimationFrame(() => observer.observe(element));
      pending.add(frame);
    };

    const scan = () => revealTargets().forEach(bind);
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      pending.forEach((frame) => window.cancelAnimationFrame(frame));
      mutations.disconnect();
      observer.disconnect();
      revealTargets().forEach((element) => {
        delete element.dataset.revealBound;
      });
    };
  }, []);

  const copyBibtex = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main id="top">
      <nav className="site-nav">
        <div className="wide-container nav-inner">
          <a className="brand" href="#top">MMSearch-OPD</a>
          <a className="github-link" href={repository} target="_blank" rel="noreferrer">
            <Image className="github-icon" src={githubLogo} alt="" aria-hidden="true" />
            GitHub Repo <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <SectionNavigation active={activeSection} visible={showSectionNavigation} />

      <header className="paper-hero container">
        <div className="venue-label" data-reveal="up">Data Refinement & OPD · 2026</div>
        <h1 data-reveal="up" data-reveal-delay="1">MMSearch-OPD</h1>
        <p className="paper-title" data-reveal="up" data-reveal-delay="2">
          Easy Made Hard, Hard Made Learnable for Long-Horizon Multimodal Search Agents
        </p>
        <div className="author-list" aria-label="Paper authors" data-reveal="up" data-reveal-delay="3">
          {authors.map((author) => (
            <span key={author.name}>
              {author.name}
              <sup>
                {author.affiliation}
                {author.equal && <span className="equal-mark" aria-label="Equal contribution" />}
                {author.leader && <span className="leader-mark" aria-label="Project leader" />}
                {author.corresponding && <span className="corresponding-mark" aria-label="Corresponding author">†</span>}
              </sup>
            </span>
          ))}
        </div>
        <p className="author-note" data-reveal="up" data-reveal-delay="3">
          <span><span className="equal-mark" aria-hidden="true" />Equal contribution</span>
          <span><span className="leader-mark" aria-hidden="true" />Project leader</span>
          <span><span className="corresponding-mark" aria-hidden="true">†</span>Corresponding authors</span>
        </p>
        <div className="affiliation-logos" aria-label="Author affiliations" data-reveal="scale">
          {affiliations.map((affiliation) => (
            <div className={`affiliation-logo affiliation-logo-${affiliation.id}`} key={affiliation.id} title={affiliation.name}>
              <span className="affiliation-image">
                <Image src={affiliation.logo} alt={`${affiliation.name} logo`} />
              </span>
              <span className="affiliation-caption"><sup>{affiliation.id}</sup>{affiliation.label}</span>
            </div>
          ))}
        </div>
        <div className="paper-tags" data-reveal="up" data-reveal-delay="1">
          <span>Data Refinement</span>
          <span>On-Policy Distillation</span>
          <span>Reinforcement Learning</span>
          <span>Long-Horizon Search</span>
        </div>
        <div className="resource-links" data-reveal="up" data-reveal-delay="2">
          <div className="resource-row">
            <a className="resource primary" href="https://arxiv.org/pdf/2610.22240" target="_blank" rel="noreferrer">
              <Image className="resource-logo arxiv-logo" src={arxivLogo} alt="" />
              <span><b>Paper</b></span>
            </a>
            <a className="resource" href={repository} target="_blank" rel="noreferrer">
              <Image className="resource-logo github-resource-logo" src={githubLogo} alt="" />
              <span><b>Code</b></span>
            </a>
            <span className="resource resource-pending">
              <Image className="resource-logo huggingface-logo" src={huggingFaceLogo} alt="" />
              <span><b>Dataset</b></span>
            </span>
          </div>
          <div className="resource-row">
            <span className="resource resource-pending">
              <Image className="resource-logo huggingface-logo" src={huggingFaceLogo} alt="" />
              <span><b>MMSearch-OPD-9B</b></span>
            </span>
            <span className="resource resource-pending">
              <Image className="resource-logo huggingface-logo" src={huggingFaceLogo} alt="" />
              <span><b>MMSearch-OPD-27B</b></span>
            </span>
          </div>
        </div>
      </header>

      <section className="paper-section container" id="motivation">
        <div className="section-number" data-reveal="up">01 / Motivation</div>
        <div className="section-intro" data-reveal="up" data-reveal-delay="1">
          <h2>Why existing questions are not enough.</h2>
          <div>
            <p>
              <b>The training gap.</b> Long-horizon multimodal search needs harder questions and
              process feedback. Existing datasets are often solvable from parametric knowledge or a
              short retrieval, while a terminal reward says little about redundant verification,
              premature stopping, or an unsupported answer.
            </p>
          </div>
        </div>
        <div className="figure-stack">
          <figure className="figure-card" data-reveal="scale">
            <div className="figure-frame">
              <Image
                src={motivationFigure}
                alt="Motivation for MMSearch-OPD and an example of Refine for long-horizon multimodal search"
                sizes="(max-width: 900px) 94vw, 1080px"
              />
            </div>
            <figcaption>
              <p>
                <span>Figure 1.</span> Motivation for MMSearch-OPD and an example of Refine for
                long-horizon multimodal search.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="paper-section section-band" id="overview">
        <div className="container section-inner">
          <div className="section-number" data-reveal="up">02 / Overview</div>
          <div className="section-intro" data-reveal="up" data-reveal-delay="1">
            <h2>Easy questions made hard, then made learnable.</h2>
            <div>
              <p>
                <b>MMSearch-OPD</b> refines an easy image–question pair, then trains with joint RL and
                on-policy distillation (<span className="opd-mark">OPD</span>).{" "}
                <span className="stage stage-buildlink">BuildLink</span> extracts the entity chain,{" "}
                <span className="stage stage-expand">Expand</span> extends it,{" "}
                <span className="stage stage-blur">Blur</span> adds disambiguation,{" "}
                <span className="stage stage-visualize">Visualize</span> introduces retrievable visual evidence, and{" "}
                <span className="stage stage-synthesis">Synthesis</span> rewrites the question with indirect clues.
                Answer rewards and behavior penalties guide RL, while the reward gap weights token-level{" "}
                <span className="opd-mark">OPD</span> on imperfect student trajectories.
              </p>
            </div>
          </div>
          <div className="figure-stack">
            <figure className="figure-card" data-reveal="scale">
              <div className="figure-heading">
                <h3>Overview of MMSearch-OPD</h3>
              </div>
              <div className="figure-frame">
                <Image
                  src={overviewFigure}
                  alt="Overview of data refinement and joint reinforcement learning with on-policy distillation"
                  sizes="(max-width: 900px) 94vw, 1080px"
                />
              </div>
              <figcaption>
                <p>
                  <span>Figure 2.</span> Overview of MMSearch-OPD: data refinement and joint RL–OPD
                  training.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="paper-section container" id="performance">
        <div className="section-inner">
          <div className="section-number" data-reveal="up">03 / Performance</div>
          <div className="section-intro compact-intro" data-reveal="up" data-reveal-delay="1">
            <h2>Stronger search at 9B, and a stronger 27B teacher.</h2>
            <p>
              On seven multimodal search benchmarks, <b>MMSearch-OPD-9B (RL)</b> reaches
              <b> 60.2</b> average accuracy, <b>15.3</b> points above the Qwen3.5-9B agentic
              workflow and <b>9.6</b> points above DeepVoyager-VL-8B. The 27B SFT teacher reaches
              <b> 63.2</b>, <b>6.5</b> points above its own agentic workflow.
            </p>
          </div>
          <div className="result-highlights">
            <article data-reveal="up">
              <span className="result-model">MMSearch-OPD-9B (RL)</span>
              <strong>60.2</strong>
              <span className="result-detail">Average accuracy · +15.3 over the 9B agentic workflow</span>
            </article>
            <article data-reveal="up" data-reveal-delay="1">
              <span className="result-model">MMSearch-OPD-27B (SFT)</span>
              <strong>63.2</strong>
              <span className="result-detail">Average accuracy · +6.5 over the 27B agentic workflow</span>
            </article>
          </div>
          <div className="data-stack">
            <BenchmarkTable />
          </div>
        </div>
      </section>

      <section className="paper-section container" id="refine">
        <div className="section-number" data-reveal="up">04 / Refine</div>
        <div className="section-intro compact-intro" data-reveal="up" data-reveal-delay="1">
          <h2>The same training, on questions Refine has made harder.</h2>
          <p>
            Refine is read in two ways. One comparison trains the same model on questions
            before and after the full pipeline. The other follows those questions through
            each stage.
          </p>
        </div>
        <div className="refine-split">
          <div className="refine-copy" data-reveal="up">
            <h3>Before and after refine</h3>
            <p>
              Both runs start from Qwen3.5-9B and share the SFT configuration and training budget.
              Only the questions change. The model trained on refined questions is stronger on all
              four benchmarks. The largest gain is <b>+15.0</b> on BrowseComp-V³, and average tool
              calls per trajectory rise from <b>6.61</b> to <b>33.71</b>.
            </p>
          </div>
          <CompactTable
            number="Table 2"
            title="Effect of Refine after SFT"
            rowHeader="Training data"
            columns={["SimpleVQA", "FVQA", "VDR", "BC-V³"]}
            rows={refineRows}
            caption="Before versus after Refine. Qwen3.5-9B after the same SFT. Δ is the accuracy gain in percentage points."
          />
        </div>
        <div className="figure-stack">
          <figure className="figure-card" data-reveal="scale">
            <div className="figure-heading">
              <h3>Before and after Refine</h3>
            </div>
            <div className="analysis-grid">
              <div>
                <Image
                  src={toolCallsFigure}
                  alt="Tool calls per question before and after Refine"
                  sizes="(max-width: 900px) 90vw, 520px"
                />
                <b>(a) Tool calls per question</b>
              </div>
              <div>
                <Image
                  src={toolDistributionFigure}
                  alt="Distribution of tool calls before and after Refine"
                  sizes="(max-width: 900px) 90vw, 520px"
                />
                <b>(b) Tool-call distribution</b>
              </div>
            </div>
            <figcaption>
              <p>
                <span>Figure 3.</span> Tool use for the same before-and-after comparison.
                (a) counts tool invocations. (b) counts each search query separately; dashed lines
                mark the averages. ImageSearch rises from 0.38 to 4.88 per question, and FetchImage
                from 0.51 to 3.47.
              </p>
            </figcaption>
          </figure>
        </div>
        <div className="refine-split refine-split-flip">
          <CompactTable
            number="Table 3"
            title="Stage-wise search requirements"
            rowHeader="Stage"
            columns={["Accuracy", "Turns", "Tool calls"]}
            rows={stageRows}
            caption="Stages of Refine on 100 paired questions. Seed is the starting point; Expand, Blur, and Visualize follow."
          />
          <div className="refine-copy" data-reveal="up">
            <h3>Stage by stage</h3>
            <p>
              On the same 100 questions, Seed2.1-Pro accuracy falls from <b>79%</b> before Refine to
              <b> 65%</b> after Expand, <b>44%</b> after Blur, and <b>33%</b> after Visualize. Turns
              rise from <b>9.8</b> to <b>20.2</b>, and tool calls from <b>18.4</b> to <b>34.7</b>.
            </p>
          </div>
        </div>
        <div className="figure-stack">
          <figure className="figure-card" data-reveal="scale">
            <div className="figure-heading">
              <h3>Expand, Blur, and Visualize</h3>
            </div>
            <div className="analysis-grid">
              <div>
                <Image
                  src={ablationTrendFigure}
                  alt="Accuracy and search length before Refine and after Expand, Blur, and Visualize"
                  sizes="(max-width: 900px) 90vw, 520px"
                />
                <b>(a) Accuracy and search length</b>
              </div>
              <div>
                <Image
                  src={ablationMixFigure}
                  alt="Tool-use composition before Refine and after Expand, Blur, and Visualize"
                  sizes="(max-width: 900px) 90vw, 520px"
                />
                <b>(b) Tool-use composition</b>
              </div>
            </div>
            <figcaption>
              <p>
                <span>Figure 4.</span> The same 100 questions through the stages in Table 3.
                ImageSearch and FetchImage together rise from 6.3% to 47.5% of tool actions after Visualize.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="paper-section container" id="training">
        <div className="section-number" data-reveal="up">05 / Training</div>
        <div className="section-intro compact-intro" data-reveal="up" data-reveal-delay="1">
          <h2>Joint training adds accuracy, then spends less search.</h2>
          <p>
            Joint RL–OPD lifts the 9B SFT average from <b>57.9</b> to <b>60.2</b>, with a gain on
            every one of the <a className="text-link" href="#performance-table">seven benchmarks</a>. Later in training, rollouts use fewer tool calls and
            fewer tokens while answer reward stays comparable.
          </p>
        </div>
        <div className="opd-layout" data-reveal="up">
          <figure className="opd-code">
            <figcaption><b>Algorithm 1</b> On-policy distillation</figcaption>
            <div className="opd-body">
              <p><b>Require:</b> student <i>π<sub>θ</sub></i>, frozen teacher <i>π<sub>T</sub></i></p>
              <ol>
                <li><span><b>for</b> each question <b>do</b></span></li>
                <li className="lv1"><span>sample <i>G</i> rollouts from <i>π<sub>θ</sub></i></span></li>
                <li className="lv1"><span><i>R<sub>i</sub></i> ← <i>c<sub>i</sub></i> + <i>H<sub>i</sub></i></span></li>
                <li className="lv1"><span><i>A<sub>i</sub><sup>RL</sup></i> ← <i>R<sub>i</sub></i> − mean<sub>j</sub> <i>R<sub>j</sub></i></span></li>
                <li className="lv1"><span><b>if</b> <i>c<sub>i</sub></i> &lt; 1 <b>then</b></span></li>
                <li className="lv2"><span><i>ω<sub>i</sub></i> ← [1 − <i>R<sub>i</sub></i>]<sub>+</sub></span></li>
                <li className="lv2"><span><i>A<sub>i,t</sub><sup>OPD</sup></i> ← <i>ω<sub>i</sub></i> · clip(log <i>π<sub>T</sub></i> / <i>π<sub>θ</sub></i>)</span></li>
                <li className="lv1"><span><b>else</b></span></li>
                <li className="lv2"><span><i>A<sub>i,t</sub><sup>OPD</sup></i> ← 0</span></li>
                <li className="lv1"><span><b>end if</b></span></li>
                <li className="lv1"><span>minimize <i>L</i><sub>RL</sub> + <i>λ L</i><sub>OPD</sub> + <i>β L</i><sub>KL</sub></span></li>
                <li><span><b>end for</b></span></li>
                <li><span>decay <i>λ</i> every ten steps</span></li>
              </ol>
            </div>
          </figure>
          <div className="opd-note">
            <h3>On-policy distillation</h3>
            <p>
              A frozen 27B teacher guides the student on its own rollouts. For each question the
              student samples a group. Correctness <i>c</i> and a penalty <i>H</i> for wasteful
              search form the reward, and reinforcement learning uses the group-centered gap.
            </p>
            <p>
              Distillation runs only when a rollout is not fully correct. The reward gap sets the
              token-level strength, and fully correct trajectories get none. The weight <i>λ</i> then
              decays, so later updates rely more on the outcome.
            </p>
          </div>
        </div>

        <div className="insight-grid">
          <article data-reveal="up">
            <span>Joint training beyond SFT</span>
            <strong>+2.3</strong>
            <p>average points from joint RL–OPD on the 9B student, with a gain on every one of the seven benchmarks.</p>
          </article>
          <article data-reveal="up" data-reveal-delay="1">
            <span>Answer reward</span>
            <strong>0.587</strong>
            <p>mean answer reward after 19 steps, up from 0.347. Later rollouts use 18.3% fewer tool calls and 19.5% fewer tokens.</p>
          </article>
        </div>

        <figure className="figure-card analysis-figure" data-reveal="scale">
          <div className="figure-heading">
            <h3>How the search changes during training</h3>
          </div>
          <div className="analysis-grid">
            <div>
              <Image
                src={rewardFigure}
                alt="Answer reward during joint RL and on-policy distillation"
                sizes="(max-width: 900px) 90vw, 520px"
              />
              <b>(a) Answer reward</b>
            </div>
            <div>
              <Image
                src={lengthFigure}
                alt="Response length during joint RL and on-policy distillation"
                sizes="(max-width: 900px) 90vw, 520px"
              />
              <b>(b) Response length</b>
            </div>
          </div>
          <figcaption>
            <p>
              <span>Figure 5.</span> Joint RL–OPD training. Mean answer reward rises from 0.347 to
              0.587. Comparing steps 14–19 with steps 6–13, average tool calls fall from 26.0 to
              21.3 and response length from 29.0k to 23.4k tokens, while mean answer reward stays
              comparable (0.544 versus 0.525).
            </p>
          </figcaption>
        </figure>
      </section>

      <section className="bibtex-section" id="bibtex">
        <div className="container bibtex-layout">
          <div data-reveal="up">
            <div className="section-number">06 / BibTeX</div>
            <h2>Cite <span className="bibtex-name">MMSearch-OPD.</span></h2>
          </div>
          <div className="bibtex-card" data-reveal="scale" data-reveal-delay="1">
            <button type="button" onClick={copyBibtex} aria-live="polite">
              {copied ? "Copied" : "Copy BibTeX"}
            </button>
            <pre><code>{bibtex}</code></pre>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <a className="brand" href="#top">MMSearch-OPD</a>
          <p className="footer-tagline">Easy made hard · Hard made learnable</p>
          <p className="footer-copyright">MMSearch-OPD © 2026</p>
        </div>
      </footer>
    </main>
  );
}
