// src/pages/previews/Fostering/FosteringSectionPreview.tsx
import { FosteringSection } from "../../../firebase/types";
import "../../../styles/previews/fostering/_fosteringsectionpreview.scss";

interface Props {
  section: FosteringSection;
  lang: "en" | "hu";
}

export default function FosteringSectionPreview({ section, lang }: Props) {
  const title =
    lang === "en" ? section.englishTitle : section.hungarianTitle;
  const subtitle =
    lang === "en"
      ? section.subtitleEnglish
      : section.subtitleHungarian;
  const content =
    lang === "en"
      ? section.contentEnglish
      : section.contentHungarian;

  return (
    <section className="fostering-preview">
      <div className="header">
        <h3>{title}</h3>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      <div className="body bg-light">
        <div className="image-col">
          <img src={section.imgUrl} alt={title} />
        </div>
        <div className="text-col">
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
}
