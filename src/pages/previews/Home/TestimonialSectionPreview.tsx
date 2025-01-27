// TestimonialSectionPreview.tsx
import React from "react";
import { TestimonialSection as TestimonialSectionType } from "../../../firebase/types";
import "../../../styles/previews/home/_testimonialpreview.scss";

interface TestimonialSectionPreviewProps {
  section: TestimonialSectionType;
}

const TestimonialSectionPreview: React.FC<TestimonialSectionPreviewProps> = ({ section }) => {
  const testimonials = section.testimonials || [];

  return (
    <div className="testimonial-section-preview container mt-5 mb-5">
      <div className="row">
        {testimonials.map((testimonial, index) => (
          <div className="col-md-4 mb-4 text-center" key={index}>
            <div className="testimonial-image mb-3">
              {testimonial.imgUrl ? (
                <img src={testimonial.imgUrl} alt={`Testimonial ${index + 1}`} className="img-fluid rounded-circle" />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <h5 className="mb-3">
              <strong>{testimonial.author || `Author ${index + 1}`}</strong>
            </h5>
            <p>{testimonial.contentEnglish || "Enter data to preview."}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSectionPreview;
