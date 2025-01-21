// TestimonialSectionForm.tsx
import React, { useState, useEffect } from "react";
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
  // Initialize imagePreviews with empty strings matching the number of testimonials
  const [imagePreviews, setImagePreviews] = useState<string[]>(() =>
    section.testimonials.map(() => "")
  );

  useEffect(() => {
    // Clean up object URLs to prevent memory leaks
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  const handleTextChange = (
    index: number,
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(index, field, e.target.value);
  };

  const handleFileChange = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            <label htmlFor={`testimonial-image-${index}`}>Image:</label>
            {/* Conditionally render input or image preview */}
            {imagePreviews[index] ? (
              <div className="image-preview">
                <img
                  src={imagePreviews[index]}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </button>
              </div>
            ) : (
              <input
                type="file"
                id={`testimonial-image-${index}`}
                accept="image/*"
                onChange={handleFileChange(index)}
              />
            )}
          </div>
          <div className="input-box">
            <label htmlFor={`testimonial-content-en-${index}`}>
              Content (English):
            </label>
            <textarea
              id={`testimonial-content-en-${index}`}
              placeholder="Content in English"
              value={testimonial.contentEnglish}
              onChange={handleTextChange(index, "contentEnglish")}
            ></textarea>
          </div>
          <div className="input-box">
            <label htmlFor={`testimonial-content-hu-${index}`}>
              Content (Hungarian):
            </label>
            <textarea
              id={`testimonial-content-hu-${index}`}
              placeholder="Content in Hungarian"
              value={testimonial.contentHungarian}
              onChange={handleTextChange(index, "contentHungarian")}
            ></textarea>
          </div>
          <div className="input-box">
            <label htmlFor={`testimonial-author-${index}`}>Author:</label>
            <input
              type="text"
              id={`testimonial-author-${index}`}
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
