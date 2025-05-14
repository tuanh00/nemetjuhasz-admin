// src/pages/donation/forms/DonateItemsForm.tsx
import React from "react";
import { DonateItems } from "../../../firebase/types";

interface DonateItemsFormProps {
  donateItems: DonateItems;
  onUpdate: (updated: DonateItems) => void;
}

const DonateItemsForm: React.FC<DonateItemsFormProps> = ({
  donateItems,
  onUpdate,
}) => {
  // Basic field changes (title, intro)
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ ...donateItems, [name]: value });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // FOOD SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const handleFoodSectionTitleChange = (lang: "EN" | "HU", value: string) => {
    if (lang === "EN") {
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          englishSectionTitle: value,
        },
      });
    } else {
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          hungarianSectionTitle: value,
        },
      });
    }
  };

  const handleAddFoodBullet = (lang: "EN" | "HU") => {
    if (lang === "EN") {
      const updated = [...donateItems.foodSection.englishBullets, ""];
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          englishBullets: updated,
        },
      });
    } else {
      const updated = [...donateItems.foodSection.hungarianBullets, ""];
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          hungarianBullets: updated,
        },
      });
    }
  };

  const handleFoodBulletChange = (
    lang: "EN" | "HU",
    index: number,
    newValue: string
  ) => {
    if (lang === "EN") {
      const updated = [...donateItems.foodSection.englishBullets];
      updated[index] = newValue;
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          englishBullets: updated,
        },
      });
    } else {
      const updated = [...donateItems.foodSection.hungarianBullets];
      updated[index] = newValue;
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          hungarianBullets: updated,
        },
      });
    }
  };

  // NEW: Remove bullet
  const handleRemoveFoodBullet = (lang: "EN" | "HU", index: number) => {
    if (lang === "EN") {
      const updatedBullets = [...donateItems.foodSection.englishBullets];
      updatedBullets.splice(index, 1);
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          englishBullets: updatedBullets,
        },
      });
    } else {
      const updatedBullets = [...donateItems.foodSection.hungarianBullets];
      updatedBullets.splice(index, 1);
      onUpdate({
        ...donateItems,
        foodSection: {
          ...donateItems.foodSection,
          hungarianBullets: updatedBullets,
        },
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ACCESSORY SECTION
  // ─────────────────────────────────────────────────────────────────────────────
  const handleAccessorySectionTitleChange = (
    lang: "EN" | "HU",
    value: string
  ) => {
    if (lang === "EN") {
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          englishSectionTitle: value,
        },
      });
    } else {
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          hungarianSectionTitle: value,
        },
      });
    }
  };

  const handleAddAccessoryBullet = (lang: "EN" | "HU") => {
    if (lang === "EN") {
      const updated = [...donateItems.accessorySection.englishBullets, ""];
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          englishBullets: updated,
        },
      });
    } else {
      const updated = [...donateItems.accessorySection.hungarianBullets, ""];
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          hungarianBullets: updated,
        },
      });
    }
  };

  const handleAccessoryBulletChange = (
    lang: "EN" | "HU",
    index: number,
    newValue: string
  ) => {
    if (lang === "EN") {
      const updated = [...donateItems.accessorySection.englishBullets];
      updated[index] = newValue;
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          englishBullets: updated,
        },
      });
    } else {
      const updated = [...donateItems.accessorySection.hungarianBullets];
      updated[index] = newValue;
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          hungarianBullets: updated,
        },
      });
    }
  };

  // NEW: Remove bullet
  const handleRemoveAccessoryBullet = (lang: "EN" | "HU", index: number) => {
    if (lang === "EN") {
      const updatedBullets = [...donateItems.accessorySection.englishBullets];
      updatedBullets.splice(index, 1);
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          englishBullets: updatedBullets,
        },
      });
    } else {
      const updatedBullets = [...donateItems.accessorySection.hungarianBullets];
      updatedBullets.splice(index, 1);
      onUpdate({
        ...donateItems,
        accessorySection: {
          ...donateItems.accessorySection,
          hungarianBullets: updatedBullets,
        },
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Title / Intro */}
      <div className="input-box">
        <label>English Title</label>
        <input
          type="text"
          name="englishTitle"
          value={donateItems.englishTitle}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Title</label>
        <input
          type="text"
          name="hungarianTitle"
          value={donateItems.hungarianTitle}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>English Intro</label>
        <textarea
          name="englishIntro"
          rows={3}
          value={donateItems.englishIntro}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Intro</label>
        <textarea
          name="hungarianIntro"
          rows={3}
          value={donateItems.hungarianIntro}
          onChange={handleFieldChange}
        />
      </div>

      {/* FOOD SECTION */}
      <div className="food-section mt-3">
        <h4>Food Section</h4>

        <div className="input-box">
          <label>Food Section Title (EN)</label>
          <input
            type="text"
            value={donateItems.foodSection.englishSectionTitle}
            onChange={(e) =>
              handleFoodSectionTitleChange("EN", e.target.value)
            }
          />
        </div>
        <div className="input-box">
          <label>Food Section Title (HU)</label>
          <input
            type="text"
            value={donateItems.foodSection.hungarianSectionTitle}
            onChange={(e) =>
              handleFoodSectionTitleChange("HU", e.target.value)
            }
          />
        </div>

        {/* EN Bullets */}
        <label >Food Bullets (EN)</label>
        {donateItems.foodSection.englishBullets.map((bullet, idx) => (
          <div key={`food-en-${idx}`} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={bullet}
              onChange={(e) =>
                handleFoodBulletChange("EN", idx, e.target.value)
              }
              style={{ width: "70%" }}
            />
            {/* Remove bullet button */}
            <button
              type="button"
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: "0.3rem 0.6rem",
              }}
              onClick={() => handleRemoveFoodBullet("EN", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn w-100 mt-2"
          onClick={() => handleAddFoodBullet("EN")}
        >
          + Add EN Food Bullet
        </button>

        {/* HU Bullets */}
        <label className="mt-3 d-block">Food Bullets (HU)</label>
        {donateItems.foodSection.hungarianBullets.map((bullet, idx) => (
          <div key={`food-hu-${idx}`} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={bullet}
              onChange={(e) =>
                handleFoodBulletChange("HU", idx, e.target.value)
              }
              style={{ width: "70%" }}
            />
            {/* Remove bullet button */}
            <button
              type="button"
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: "0.3rem 0.6rem",
              }}
              onClick={() => handleRemoveFoodBullet("HU", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn w-100 mt-2"
          onClick={() => handleAddFoodBullet("HU")}
        >
          + Add HU Food Bullet
        </button>
      </div>

      {/* ACCESSORY SECTION */}
      <div className="accessory-section mt-4">
        <h4>Accessory & Toys Section</h4>

        <div className="input-box">
          <label>Accessory Section Title (EN)</label>
          <input
            type="text"
            value={donateItems.accessorySection.englishSectionTitle}
            onChange={(e) =>
              handleAccessorySectionTitleChange("EN", e.target.value)
            }
          />
        </div>
        <div className="input-box">
          <label>Accessory Section Title (HU)</label>
          <input
            type="text"
            value={donateItems.accessorySection.hungarianSectionTitle}
            onChange={(e) =>
              handleAccessorySectionTitleChange("HU", e.target.value)
            }
          />
        </div>

        {/* EN Bullets */}
        <label>Accessory Bullets (EN)</label>
        {donateItems.accessorySection.englishBullets.map((bullet, idx) => (
          <div key={`acc-en-${idx}`} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={bullet}
              onChange={(e) =>
                handleAccessoryBulletChange("EN", idx, e.target.value)
              }
              style={{ width: "70%" }}
            />
            {/* Remove bullet button */}
            <button
              type="button"
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: "0.3rem 0.6rem",
              }}
              onClick={() => handleRemoveAccessoryBullet("EN", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn w-100 mt-2"
          onClick={() => handleAddAccessoryBullet("EN")}
        >
          + Add EN Accessory Bullet
        </button>

        {/* HU Bullets */}
        <label className="mt-3 d-block">Accessory Bullets (HU)</label>
        {donateItems.accessorySection.hungarianBullets.map((bullet, idx) => (
          <div key={`acc-hu-${idx}`} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={bullet}
              onChange={(e) =>
                handleAccessoryBulletChange("HU", idx, e.target.value)
              }
              style={{ width: "70%" }}
            />
            {/* Remove bullet button */}
            <button
              type="button"
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                padding: "0.3rem 0.6rem",
              }}
              onClick={() => handleRemoveAccessoryBullet("HU", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn w-100 mt-2"
          onClick={() => handleAddAccessoryBullet("HU")}
        >
          + Add HU Accessory Bullet
        </button>
      </div>
    </div>
  );
};

export default DonateItemsForm;
