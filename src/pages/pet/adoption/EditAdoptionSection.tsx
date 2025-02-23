import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { 
  AdoptionSection, 
  AdoptionProcessSection, 
  SuccessStoriesSection, 
  BecomeAFosterSection 
} from "../../../firebase/types";
import { updateAdoptionSection } from "../../../firebase/AdoptionService";
import AdoptionPreview from "../../previews/Adoption/AdoptionPreview";
import "../../../styles/adoption/_editadoptionsection.scss";

// Define a form type where nested fields are partial
type AdoptionSectionForm = {
  sectionType?: "adoptionProcess" | "successStories" | "becomeAFoster";
  adoptionProcess?: Partial<AdoptionProcessSection>;
  successStories?: Partial<SuccessStoriesSection>;
  becomeAFoster?: Partial<BecomeAFosterSection>;
  id?: string;
};

interface EditProps {
  section: AdoptionSection;
  onClose: () => void;
}

const EditAdoptionSection: React.FC<EditProps> = ({ section, onClose }) => {
  // Set initial form state from the passed section
  const initialForm: AdoptionSectionForm = {
    sectionType: section.sectionType,
    id: section.id,
    ...(section.sectionType === "adoptionProcess"
      ? { adoptionProcess: { ...section.adoptionProcess } }
      : section.sectionType === "successStories"
      ? { successStories: { ...section.successStories } }
      : { becomeAFoster: { ...section.becomeAFoster } }),
  };

  const [sectionType, setSectionType] = useState<"adoptionProcess" | "successStories" | "becomeAFoster">(section.sectionType);
  const [sectionData, setSectionData] = useState<AdoptionSectionForm>(initialForm);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  // File states for adoptionProcess and successStories
  const [adoptionImageFile, setAdoptionImageFile] = useState<File | null>(null);
  const [englishImageFile, setEnglishImageFile] = useState<File | null>(null);
  const [hungarianImageFile, setHungarianImageFile] = useState<File | null>(null);

  useEffect(() => {
    validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionData, adoptionImageFile, englishImageFile, hungarianImageFile, sectionType]);

  const validateFields = () => {
    if (sectionType === "adoptionProcess") {
      const data = sectionData.adoptionProcess;
      setIsValid(
        !!data?.title &&
          !!data?.hungarianTitle &&
          !!data?.subtitle &&
          !!data?.content &&
          (!!data?.imageUrl || !!adoptionImageFile) &&
          !!data?.englishButtonTitle &&
          !!data?.hungarianButtonTitle &&
          !!data?.buttonLink
      );
    } else if (sectionType === "successStories") {
      const data = sectionData.successStories;
      setIsValid(
        !!data?.title &&
          !!data?.hungarianTitle &&
          !!(data.images && data.images[0]?.englishImageTitle) &&
          !!(data.images && data.images[0]?.hungarianImageTitle) &&
          !!(data.images && data.images[0]?.link) &&
          (!!data.images?.[0]?.firstImageUrl || !!englishImageFile) &&
          (!!data.images?.[0]?.secondImageUrl || !!hungarianImageFile)
      );
    } else if (sectionType === "becomeAFoster") {
      const data = sectionData.becomeAFoster;
      setIsValid(
        !!data?.englishTitle &&
        !!data?.hungarianTitle &&
        !!data?.englishContent &&
        !!data?.hungarianContent &&
        !!data?.englishButtonTitle &&
        !!data?.hungarianButtonTitle &&
        !!data?.buttonLink
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    if (sectionType === "adoptionProcess") {
      setSectionData((prev) => ({
        ...prev,
        adoptionProcess: {
          ...((prev.adoptionProcess as Partial<AdoptionProcessSection>) || {}),
          [name]: value,
        },
      }));
    } else if (sectionType === "successStories") {
      if (["englishImageTitle", "hungarianImageTitle", "link"].includes(name)) {
        setSectionData((prev) => ({
          ...prev,
          successStories: {
            ...(prev.successStories || {
              images: [{
                englishImageTitle: "",
                hungarianImageTitle: "",
                firstImageUrl: "",
                secondImageUrl: "",
                link: "",
              }],
            }),
            images: [
              {
                ...(prev.successStories?.images?.[0] || {
                  englishImageTitle: "",
                  hungarianImageTitle: "",
                  firstImageUrl: "",
                  secondImageUrl: "",
                  link: "",
                }),
                [name]: value,
              },
            ],
          },
        }));
      } else {
        setSectionData((prev) => ({
          ...prev,
          successStories: {
            ...(prev.successStories || {
              images: [{
                englishImageTitle: "",
                hungarianImageTitle: "",
                firstImageUrl: "",
                secondImageUrl: "",
                link: "",
              }],
            }),
            [name]: value,
          },
        }));
      }
    } else if (sectionType === "becomeAFoster") {
      setSectionData((prev) => ({
        ...prev,
        becomeAFoster: {
          ...((prev.becomeAFoster) || {
            englishTitle: "",
            hungarianTitle: "",
            englishContent: "",
            hungarianContent: "",
            englishButtonTitle: "",
            hungarianButtonTitle: "",
            englishButtonLink: "",
            hungarianButtonLink: ""
          }),
          [name]: value,
        },
      }));
    }
  };

  // File upload handlers for adoptionProcess
  const handleAdoptionImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setAdoptionImageFile(e.target.files[0]);
    }
  };

  // File upload handlers for successStories
  const handleEnglishImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setEnglishImageFile(e.target.files[0]);
    }
  };

  const handleHungarianImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setHungarianImageFile(e.target.files[0]);
    }
  };

  // Remove functions: show a confirm prompt and clear state so that file input reappears
  const handleRemoveAdoptionImage = (): void => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setAdoptionImageFile(null);
      setSectionData((prev) => ({
        ...prev,
        adoptionProcess: {
          ...prev.adoptionProcess,
          imageUrl: "",
        },
      }));
    }
  };

  const handleRemoveEnglishImage = (): void => {
    if (window.confirm("Are you sure you want to remove the first image?")) {
      setEnglishImageFile(null);
      setSectionData((prev) => {
        const currentSuccessStories = prev.successStories || {
          title: "",
          hungarianTitle: "",
          images: [{
            englishImageTitle: "",
            hungarianImageTitle: "",
            firstImageUrl: "",
            secondImageUrl: "",
            link: "",
          }],
        };
        const images = currentSuccessStories.images ?? [{
          englishImageTitle: "",
          hungarianImageTitle: "",
          firstImageUrl: "",
          secondImageUrl: "",
          link: "",
        }];
        const currentImage = images[0];
        return {
          ...prev,
          successStories: {
            ...currentSuccessStories,
            images: [
              {
                ...currentImage,
                firstImageUrl: "",
              },
            ],
          },
        };
      });
    }
  };

  const handleRemoveHungarianImage = (): void => {
    if (window.confirm("Are you sure you want to remove the second image?")) {
      setHungarianImageFile(null);
      setSectionData((prev) => {
        const currentSuccessStories = prev.successStories || {
          title: "",
          hungarianTitle: "",
          images: [{
            englishImageTitle: "",
            hungarianImageTitle: "",
            firstImageUrl: "",
            secondImageUrl: "",
            link: "",
          }],
        };
        const images = currentSuccessStories.images ?? [{
          englishImageTitle: "",
          hungarianImageTitle: "",
          firstImageUrl: "",
          secondImageUrl: "",
          link: "",
        }];
        const currentImage = images[0];
        return {
          ...prev,
          successStories: {
            ...currentSuccessStories,
            images: [
              {
                ...currentImage,
                secondImageUrl: "",
              },
            ],
          },
        };
      });
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!isValid) return;
    try {
      if (sectionType === "adoptionProcess") {
        await updateAdoptionSection(
          updatedSectionId(),
          { ...sectionData, sectionType } as AdoptionSection,
          adoptionImageFile || undefined
        );
      } else if (sectionType === "successStories") {
        await updateAdoptionSection(
          updatedSectionId(),
          { ...sectionData, sectionType } as AdoptionSection,
          (englishImageFile && hungarianImageFile)
            ? [englishImageFile, hungarianImageFile]
            : undefined
        );
      } else if (sectionType === "becomeAFoster") {
        await updateAdoptionSection(
          updatedSectionId(),
          { ...sectionData, sectionType } as AdoptionSection
        );
      }
      alert("Section updated!");
      onClose();
    } catch (error) {
      console.error("Error updating adoption section:", error);
    }
  };

  const updatedSectionId = (): string => {
    return sectionData.id ? sectionData.id : "";
  };

  const togglePreview = (): void => {
    setPreviewMode((prev) => !prev);
  };

  let previewSection = { ...sectionData, sectionType } as AdoptionSection;
  if (sectionType === "adoptionProcess") {
    previewSection.adoptionProcess = {
      title: previewSection.adoptionProcess?.title || "",
      subtitle: previewSection.adoptionProcess?.subtitle || "",
      hungarianSubtitle: previewSection.adoptionProcess?.hungarianSubtitle || "",
      hungarianTitle: previewSection.adoptionProcess?.hungarianTitle || "",
      content: previewSection.adoptionProcess?.content || "",
      hungarianContent: previewSection.adoptionProcess?.hungarianContent || "",
      englishButtonTitle: previewSection.adoptionProcess?.englishButtonTitle || "",
      hungarianButtonTitle: previewSection.adoptionProcess?.hungarianButtonTitle || "",
      buttonLink: previewSection.adoptionProcess?.buttonLink || "",
      imageUrl: adoptionImageFile ? URL.createObjectURL(adoptionImageFile) : previewSection.adoptionProcess?.imageUrl || ""
    };
  } else if (sectionType === "successStories") {
    previewSection.successStories = {
      title: previewSection.successStories?.title || "",
      hungarianTitle: previewSection.successStories?.hungarianTitle || "",
      images: [
        {
          englishImageTitle: previewSection.successStories?.images?.[0]?.englishImageTitle || "",
          hungarianImageTitle: previewSection.successStories?.images?.[0]?.hungarianImageTitle || "",
          link: previewSection.successStories?.images?.[0]?.link || "",
          firstImageUrl: englishImageFile ? URL.createObjectURL(englishImageFile) : previewSection.successStories?.images?.[0]?.firstImageUrl || "",
          secondImageUrl: hungarianImageFile ? URL.createObjectURL(hungarianImageFile) : previewSection.successStories?.images?.[0]?.secondImageUrl || "",
        }
      ]
    };
  } else if (sectionType === "becomeAFoster") {
    previewSection.becomeAFoster = {
      englishTitle: previewSection.becomeAFoster?.englishTitle || "",
      hungarianTitle: previewSection.becomeAFoster?.hungarianTitle || "",
      englishContent: previewSection.becomeAFoster?.englishContent || "",
      hungarianContent: previewSection.becomeAFoster?.hungarianContent || "",
      englishButtonTitle: previewSection.becomeAFoster?.englishButtonTitle || "",
      hungarianButtonTitle: previewSection.becomeAFoster?.hungarianButtonTitle || "",
      buttonLink: previewSection.becomeAFoster?.buttonLink || ""
    };
  }

  return (
    <div>
      <main className="edit-adoption-container">
        <h2>Edit Adoption Section</h2>

        {sectionType === "adoptionProcess" && (
          <div className="input-section">
            <label htmlFor="english-title">English Title:</label>
            <input type="text" id="english-title" name="title" value={sectionData.adoptionProcess?.title || ""} onChange={handleChange} />

            <label htmlFor="hungarian-title">Hungarian Title:</label>
            <input type="text" id="hungarian-title" name="hungarianTitle" value={sectionData.adoptionProcess?.hungarianTitle || ""} onChange={handleChange} />

            <label htmlFor="subtitle">English Subtitle:</label>
            <input type="text" id="subtitle" name="subtitle" value={sectionData.adoptionProcess?.subtitle || ""} onChange={handleChange} />

            <label htmlFor="english-content">English Content:</label>
            <textarea id="english-content" name="content" value={sectionData.adoptionProcess?.content || ""} onChange={handleChange}></textarea>

            <label htmlFor="hungarian-content">Hungarian Content:</label>
            <textarea id="hungarian-content" name="hungarianContent" value={sectionData.adoptionProcess?.hungarianContent || ""} onChange={handleChange}></textarea>

            <label htmlFor="englishButtonTitle">English Button Title:</label>
            <input type="text" id="englishButtonTitle" name="englishButtonTitle" value={sectionData.adoptionProcess?.englishButtonTitle || ""} onChange={handleChange} />

            <label htmlFor="hungarianButtonTitle">Hungarian Button Title:</label>
            <input type="text" id="hungarianButtonTitle" name="hungarianButtonTitle" value={sectionData.adoptionProcess?.hungarianButtonTitle || ""} onChange={handleChange} />

            <label htmlFor="buttonLink">Button Link:</label>
            <input type="text" id="buttonLink" name="buttonLink" value={sectionData.adoptionProcess?.buttonLink || ""} onChange={handleChange} />
          </div>
        )}

        {sectionType === "successStories" && (
          <div className="input-section">
            <label htmlFor="success-title">Success Story Title (English):</label>
            <input type="text" id="success-title" name="title" value={sectionData.successStories?.title || ""} onChange={handleChange} />

            <label htmlFor="success-hungarian-title">Success Story Title (Hungarian):</label>
            <input type="text" id="success-hungarian-title" name="hungarianTitle" value={sectionData.successStories?.hungarianTitle || ""} onChange={handleChange} />

            <label htmlFor="englishImageTitle">English Image Title:</label>
            <input type="text" id="englishImageTitle" name="englishImageTitle" value={sectionData.successStories?.images?.[0]?.englishImageTitle || ""} onChange={handleChange} />

            <label htmlFor="hungarianImageTitle">Hungarian Image Title:</label>
            <input type="text" id="hungarianImageTitle" name="hungarianImageTitle" value={sectionData.successStories?.images?.[0]?.hungarianImageTitle || ""} onChange={handleChange} />

            <label htmlFor="link">Link:</label>
            <input type="text" id="link" name="link" value={sectionData.successStories?.images?.[0]?.link || ""} onChange={handleChange} />
          </div>
        )}

        {sectionType === "becomeAFoster" && (
          <div className="input-section">
            <label htmlFor="englishTitle">English Title:</label>
            <input type="text" id="englishTitle" name="englishTitle" value={sectionData.becomeAFoster?.englishTitle || ""} onChange={handleChange} />

            <label htmlFor="hungarianTitle">Hungarian Title:</label>
            <input type="text" id="hungarianTitle" name="hungarianTitle" value={sectionData.becomeAFoster?.hungarianTitle || ""} onChange={handleChange} />

            <label htmlFor="englishContent">English Content:</label>
            <textarea id="englishContent" name="englishContent" value={sectionData.becomeAFoster?.englishContent || ""} onChange={handleChange}></textarea>

            <label htmlFor="hungarianContent">Hungarian Content:</label>
            <textarea id="hungarianContent" name="hungarianContent" value={sectionData.becomeAFoster?.hungarianContent || ""} onChange={handleChange}></textarea>

            <label htmlFor="englishButtonTitle">English Button Title:</label>
            <input type="text" id="englishButtonTitle" name="englishButtonTitle" value={sectionData.becomeAFoster?.englishButtonTitle || ""} onChange={handleChange} />

            <label htmlFor="hungarianButtonTitle">Hungarian Button Title:</label>
            <input type="text" id="hungarianButtonTitle" name="hungarianButtonTitle" value={sectionData.becomeAFoster?.hungarianButtonTitle || ""} onChange={handleChange} />

            <label htmlFor="buttonLink">Button Link:</label>
            <input type="text" id="buttonLink" name="buttonLink" value={sectionData.becomeAFoster?.buttonLink || ""} onChange={handleChange} />
          </div>
        )}

        {/* Image Upload Section for adoptionProcess and successStories only */}
        {sectionType === "adoptionProcess" && (
          <div className="image-preview-container">
            {adoptionImageFile ||
            (sectionData.adoptionProcess && sectionData.adoptionProcess.imageUrl) ? (
              <div className="image-preview-wrapper">
                <img src={adoptionImageFile ? URL.createObjectURL(adoptionImageFile) : sectionData.adoptionProcess?.imageUrl} alt="Preview" className="preview-image" />
                <button type="button" className="remove" onClick={handleRemoveAdoptionImage}>
                  X
                </button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleAdoptionImageUpload} />
            )}
          </div>
        )}

        {sectionType === "successStories" && (
          <div className="image-preview-container">
            <div>
              <label>First Image:</label>
              {englishImageFile ||
              (sectionData.successStories && sectionData.successStories.images?.[0]?.firstImageUrl) ? (
                <div className="image-preview-wrapper">
                  <img src={englishImageFile ? URL.createObjectURL(englishImageFile) : sectionData.successStories?.images?.[0]?.firstImageUrl} alt="First Preview" className="preview-image" />
                  <button type="button" className="remove" onClick={handleRemoveEnglishImage}>
                    X
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleEnglishImageUpload} />
              )}
            </div>
            <div>
              <label>Second Image:</label>
              {hungarianImageFile ||
              (sectionData.successStories && sectionData.successStories.images?.[0]?.secondImageUrl) ? (
                <div className="image-preview-wrapper">
                  <img src={hungarianImageFile ? URL.createObjectURL(hungarianImageFile) : sectionData.successStories?.images?.[0]?.secondImageUrl} alt="Second Preview" className="preview-image" />
                  <button type="button" className="remove" onClick={handleRemoveHungarianImage}>
                    X
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleHungarianImageUpload} />
              )}
            </div>
          </div>
        )}

        <button type="button" className="btn mt-3 mb-3" onClick={togglePreview} disabled={!isValid}>
          Preview
        </button>
        {previewMode && <AdoptionPreview section={previewSection} />}

        <button type="button" className="btn add-btn" onClick={handleSave} disabled={!isValid}>
          Save
        </button>
        <button type="button" className="btn cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </main>
    </div>
  );
};

export default EditAdoptionSection;
