import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { 
  AdoptionSection, 
  AdoptionProcessSection, 
  SuccessStoriesSection, 
  BecomeAFosterSection 
} from "../../../firebase/types";
import { addAdoptionSection } from "../../../firebase/AdoptionService";
import AdoptionPreview from "../../previews/Adoption/AdoptionPreview";
import "../../../styles/adoption/_addadoptionsection.scss";

// Define a form type where nested fields are partial
type AdoptionSectionForm = {
  sectionType?: "adoptionProcess" | "successStories" | "becomeAFoster";
  adoptionProcess?: Partial<AdoptionProcessSection>;
  successStories?: Partial<SuccessStoriesSection>;
  becomeAFoster?: Partial<BecomeAFosterSection>;
  id?: string;
};

const AddAdoptionSection: React.FC = () => {
  // Common state
  const [sectionType, setSectionType] = useState<"adoptionProcess" | "successStories" | "becomeAFoster">("adoptionProcess");
  const [sectionData, setSectionData] = useState<AdoptionSectionForm>({ sectionType: "adoptionProcess" });
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const navigate = useNavigate();

  // State for adoptionProcess image
  const [adoptionImageFile, setAdoptionImageFile] = useState<File | null>(null);
  // State for successStories images
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
        !!data?.hungarianSubtitle &&
        !!data?.content &&
        !!data?.hungarianContent &&
        !!data?.englishButtonTitle &&
        !!data?.hungarianButtonTitle &&
        !!data?.buttonLink &&
        !!adoptionImageFile
      );
    } else if (sectionType === "successStories") {
      const data = sectionData.successStories;
      setIsValid(
        !!data?.title &&
        !!data?.hungarianTitle &&
        !!(data.images && data.images[0]?.englishImageTitle) &&
        !!(data.images && data.images[0]?.hungarianImageTitle) &&
        !!(data.images && data.images[0]?.link) &&
        !!englishImageFile &&
        !!hungarianImageFile
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
            buttonLink: ""
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

  const handleSave = async (): Promise<void> => {
    if (!isValid) return;
    try {
      if (sectionType === "adoptionProcess") {
        await addAdoptionSection({ ...sectionData, sectionType } as AdoptionSection, adoptionImageFile || undefined);
      } else if (sectionType === "successStories") {
        await addAdoptionSection(
          { ...sectionData, sectionType } as AdoptionSection,
          (englishImageFile && hungarianImageFile) ? [englishImageFile, hungarianImageFile] : undefined
        );
      } else if (sectionType === "becomeAFoster") {
        await addAdoptionSection({ ...sectionData, sectionType } as AdoptionSection);
      }
      alert("Adoption Section added!");
      navigate("/manage-adoption");
    } catch (error) {
      console.error("Error adding adoption section:", error);
    }
  };

  const togglePreview = (): void => {
    setPreviewMode((prev) => !prev);
  };

  // Build a preview object that injects temporary blob URLs for images
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
    <div className="admin-container">
      <Sidebar />
      <main className="add-adoption-container">
        <h2>Add Adoption Section</h2>

        <label htmlFor="section-type">Select Section Type:</label>
        <select
          id="section-type"
          value={sectionType}
          onChange={(e) => setSectionType(e.target.value as "adoptionProcess" | "successStories" | "becomeAFoster")}
        >
          <option value="adoptionProcess">Adoption Process</option>
          <option value="successStories">Success Stories</option>
          <option value="becomeAFoster">Become a Foster</option>
        </select>

        {sectionType === "adoptionProcess" && (
          <div className="input-section">
            <label htmlFor="english-title">English Title:</label>
            <input type="text" id="english-title" name="title" placeholder="English Title" onChange={handleChange} />

            <label htmlFor="hungarian-title">Hungarian Title:</label>
            <input type="text" id="hungarian-title" name="hungarianTitle" placeholder="Hungarian Title" onChange={handleChange} />

            <label htmlFor="english-subtitle">English Subtitle:</label>
            <input type="text" id="english-subtitle" name="subtitle" placeholder="English Subtitle" onChange={handleChange} />

            <label htmlFor="hungarian-subtitle">Hungarian Subtitle:</label>
            <input type="text" id="hungarian-subtitle" name="hungarianSubtitle" placeholder="Hungarian Subtitle" onChange={handleChange} />

            <label htmlFor="english-content">English Content:</label>
            <textarea id="english-content" name="content" placeholder="English Content" onChange={handleChange}></textarea>

            <label htmlFor="hungarian-content">Hungarian Content:</label>
            <textarea id="hungarian-content" name="hungarianContent" placeholder="Hungarian Content" onChange={handleChange}></textarea>

            <label htmlFor="englishButtonTitle">English Button Title:</label>
            <input type="text" id="englishButtonTitle" name="englishButtonTitle" placeholder="English Button Title" onChange={handleChange} />

            <label htmlFor="hungarianButtonTitle">Hungarian Button Title:</label>
            <input type="text" id="hungarianButtonTitle" name="hungarianButtonTitle" placeholder="Hungarian Button Title" onChange={handleChange} />

            <label htmlFor="buttonLink">Button Link:</label>
            <input type="text" id="buttonLink" name="buttonLink" placeholder="Button Link" onChange={handleChange} />
          </div>
        )}

        {sectionType === "successStories" && (
          <div className="input-section">
            <label htmlFor="success-title">Success Story Title (English):</label>
            <input type="text" id="success-title" name="title" placeholder="Success Story Title (English)" onChange={handleChange} />

            <label htmlFor="success-hungarian-title">Success Story Title (Hungarian):</label>
            <input type="text" id="success-hungarian-title" name="hungarianTitle" placeholder="Success Story Title (Hungarian)" onChange={handleChange} />

            <label htmlFor="englishImageTitle">English Image Title:</label>
            <input type="text" id="englishImageTitle" name="englishImageTitle" placeholder="English Image Title" onChange={handleChange} />

            <label htmlFor="hungarianImageTitle">Hungarian Image Title:</label>
            <input type="text" id="hungarianImageTitle" name="hungarianImageTitle" placeholder="Hungarian Image Title" onChange={handleChange} />

            <label htmlFor="link">Link:</label>
            <input type="text" id="link" name="link" placeholder="Link" onChange={handleChange} />
          </div>
        )}

        {sectionType === "becomeAFoster" && (
          <div className="input-section">
            <label htmlFor="englishTitle">English Title:</label>
            <input type="text" id="englishTitle" name="englishTitle" placeholder="English Title" onChange={handleChange} />

            <label htmlFor="hungarianTitle">Hungarian Title:</label>
            <input type="text" id="hungarianTitle" name="hungarianTitle" placeholder="Hungarian Title" onChange={handleChange} />

            <label htmlFor="englishContent">English Content:</label>
            <textarea id="englishContent" name="englishContent" placeholder="English Content" onChange={handleChange}></textarea>

            <label htmlFor="hungarianContent">Hungarian Content:</label>
            <textarea id="hungarianContent" name="hungarianContent" placeholder="Hungarian Content" onChange={handleChange}></textarea>

            <label htmlFor="englishButtonTitle">English Button Title:</label>
            <input type="text" id="englishButtonTitle" name="englishButtonTitle" placeholder="English Button Title" onChange={handleChange} />

            <label htmlFor="hungarianButtonTitle">Hungarian Button Title:</label>
            <input type="text" id="hungarianButtonTitle" name="hungarianButtonTitle" placeholder="Hungarian Button Title" onChange={handleChange} />

            <label htmlFor="buttonLink">Button Link:</label>
            <input type="text" id="buttonLink" name="buttonLink" placeholder="Button Link" onChange={handleChange} />
          </div>
        )}

        {/* Image Upload Section for adoptionProcess and successStories only */}
        {sectionType === "adoptionProcess" && (
          <div className="image-preview-container">
            {adoptionImageFile ? (
              <div className="image-preview-wrapper">
                <img src={URL.createObjectURL(adoptionImageFile)} alt="Preview" className="preview-image" />
                <button type="button" className="remove" onClick={() => setAdoptionImageFile(null)}>
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
              {englishImageFile ? (
                <div className="image-preview-wrapper">
                  <img src={URL.createObjectURL(englishImageFile)} alt="First Preview" className="preview-image" />
                  <button type="button" className="remove" onClick={() => setEnglishImageFile(null)}>
                    X
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleEnglishImageUpload} />
              )}
            </div>
            <div>
              <label>Second Image:</label>
              {hungarianImageFile ? (
                <div className="image-preview-wrapper">
                  <img src={URL.createObjectURL(hungarianImageFile)} alt="Second Preview" className="preview-image" />
                  <button type="button" className="remove" onClick={() => setHungarianImageFile(null)}>
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
          Add Adoption Section
        </button>
      </main>
    </div>
  );
};

export default AddAdoptionSection;
