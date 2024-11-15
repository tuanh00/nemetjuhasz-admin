// TestimonialSectionForm.tsx
import React, { useState } from "react";
import { TestimonialSection } from "../../../firebase/types";

interface TestimonialSectionFormProps {
  section: TestimonialSection;
  handleChange: (index: number, field: string, value: string) => void;
  handleImageFileChange: (index: number, file: File | null) => void;
}

const TestimonialSectionForm: React.FC<TestimonialSectionFormProps> = ({
  section,
  handleChange,
  handleImageFileChange,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleTextChange = (index: number, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(index, field, e.target.value);
  };

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPreview = URL.createObjectURL(file);
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev];
        updatedPreviews[index] = newPreview;
        return updatedPreviews;
      });
      handleImageFileChange(index, file);
    } else {
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev];
        updatedPreviews[index] = "";
        return updatedPreviews;
      });
      handleImageFileChange(index, null);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setImagePreviews((prev) => {
        const updatedPreviews = [...prev];
        updatedPreviews[index] = "";
        return updatedPreviews;
      });
      handleImageFileChange(index, null);
    }
  };

  return (
    <div>
      {section.testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-item">
          <h4>Testimonial {index + 1}</h4>
          <div className="input-box">
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange(index)}
            />
            {imagePreviews[index] && (
              <div className="image-preview">
                <img src={imagePreviews[index]} alt={`Preview ${index}`} style={{ width: "100px", height: "100px" }} />
                <button className="remove-btn" onClick={() => handleRemoveImage(index)}>X</button>
              </div>
            )}
          </div>
          <div className="input-box">
            <label>Content (English):</label>
            <textarea
              placeholder="Content in English"
              value={testimonial.contentEnglish}
              onChange={handleTextChange(index, "contentEnglish")}
            ></textarea>
          </div>
          <div className="input-box">
            <label>Content (Hungarian):</label>
            <textarea
              placeholder="Content in Hungarian"
              value={testimonial.contentHungarian}
              onChange={handleTextChange(index, "contentHungarian")}
            ></textarea>
          </div>
          <div className="input-box">
            <label>Author:</label>
            <input
              type="text"
              placeholder="Author"
              value={testimonial.author}
              onChange={handleTextChange(index, "author")}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialSectionForm;
