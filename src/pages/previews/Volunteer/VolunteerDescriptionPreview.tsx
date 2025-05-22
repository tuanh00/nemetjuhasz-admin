// src/pages/previews/Volunteer/VolunteerDescriptionPreview.tsx
import { VolunteerSection } from "../../../firebase/types";
import "../../../styles/previews/volunteer/_volunteerdescriptionpreview.scss";

interface Props {
  section: VolunteerSection;
}

const getEmbedUrl = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|watch\?v=)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

export default function VolunteerDescriptionPreview({ section }: Props) {
  return (
    <>
    <div className="vp-header">
    <h2>{section.englishTitle}</h2>
    <p className="vp-subtitle">{section.subtitleEnglish}</p>
    </div>
    <div className="volunteer-preview">
      <div className="vp-left">
        <iframe
          src={getEmbedUrl(section.youtubeUrl)}
          title="Volunteer Video"
          allowFullScreen
        />
      </div>
      <div className="vp-right">
        <p>{section.introEnglish}</p>
        <ul>
          {section.bulletPointsEnglish.map((pt, i) => {
            const link = section.bulletLinksEnglish[i];
            return (
              <li key={i}>
                {link ? (
                  <a href={link} target="_blank" rel="noreferrer">
                    {pt}
                  </a>
                ) : (
                  pt
                )}
              </li>
            );
          })}
        </ul>
        <p>{section.closingEnglish}</p>
      </div>
    </div>
    </>
  );
}
