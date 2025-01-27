// TestimonialSection.tsx
import React, { useState } from 'react';
import { TestimonialSection } from '../../../firebase/types';
import { deleteObject, ref } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase/Firebase';
import '../../../styles/home/_edithomesection.scss';

interface TestimonialSectionEditProps {
  sectionData: TestimonialSection;
  onUpdate: (updatedSection: TestimonialSection) => void;
  onUploadImage: (file: File, index: number) => void;
}

const TestimonialSectionEdit: React.FC<TestimonialSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const updatedTestimonials = [...sectionData.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    onUpdate({ ...sectionData, testimonials: updatedTestimonials });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadImage(file, index);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    if (!sectionData.id) {
      setMessage('Section ID is not available. Cannot delete image.');
      setIsSuccess(false);
      return;
    }

    try {
      const updatedTestimonials = [...sectionData.testimonials];
      const removedImgUrl = updatedTestimonials[index].imgUrl;

      if (removedImgUrl) {
        const imageRef = ref(storage, removedImgUrl);
        await deleteObject(imageRef);
        updatedTestimonials[index].imgUrl = '';
      }

      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, { testimonials: updatedTestimonials });

      onUpdate({ ...sectionData, testimonials: updatedTestimonials });
      setMessage('Image deleted successfully.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error deleting image: ', error);
      setMessage('Failed to delete image.');
      setIsSuccess(false);
    }

    setTimeout(() => {
      setMessage(null);
      setIsSuccess(null);
    }, 3000);
  };

  const handleSaveChanges = async () => {
    if (!sectionData.id) {
      setMessage('Section ID is not available.');
      setIsSuccess(false);
      return;
    }

    try {
      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, { testimonials: sectionData.testimonials });
      setMessage('Changes saved successfully.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setMessage('Failed to save changes.');
      setIsSuccess(false);
    }

    setTimeout(() => {
      setMessage(null);
      setIsSuccess(null);
    }, 3000);
  };

  return (
    <div className="container">
      <h3>Testimonials Section</h3>
      {sectionData.testimonials.map((testimonial, index) => (
        <div key={index} className="mb-3">
          <h4>Testimonial {index + 1}</h4>
          <label htmlFor={`contentEnglish-${index}`} className="form-label">
            English Content
          </label>
          <textarea
            id={`contentEnglish-${index}`}
            className="form-control mb-2"
            placeholder="Content (English)"
            value={testimonial.contentEnglish}
            onChange={(e) =>
              handleTestimonialChange(index, 'contentEnglish', e.target.value)
            }
          />
          <label htmlFor={`contentHungarian-${index}`} className="form-label">
            Hungarian Content
          </label>
          <textarea
            id={`contentHungarian-${index}`}
            className="form-control mb-2"
            placeholder="Content (Hungarian)"
            value={testimonial.contentHungarian}
            onChange={(e) =>
              handleTestimonialChange(index, 'contentHungarian', e.target.value)
            }
          />
          <label htmlFor={`author-${index}`} className="form-label">
            Author
          </label>
          <input
            id={`author-${index}`}
            type="text"
            className="form-control mb-2"
            placeholder="Author"
            value={testimonial.author}
            onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
          />

          <label className="form-label">Image</label>
          <div className="image-wrapper">
            {testimonial.imgUrl ? (
              <>
                <img src={testimonial.imgUrl} alt={`Testimonial ${index + 1}`} />
                <button className="remove-btn" onClick={() => handleRemoveImage(index)}>
                  X
                </button>
              </>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="form-control mb-2"
              />
            )}
          </div>
        </div>
      ))}

      {message && (
        <p className={`message-box ${isSuccess ? 'success' : 'error'}`}>{message}</p>
      )}

      <button onClick={handleSaveChanges} className="btn save-btn">
        Save Changes
      </button>
    </div>
  );
};

export default TestimonialSectionEdit;
