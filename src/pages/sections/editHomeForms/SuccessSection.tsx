// SuccessSection.tsx
import React, { useState, useEffect } from 'react';
import { SuccessStorySection } from '../../../firebase/types';
import { deleteObject, ref } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase/Firebase';
import '../../../styles/home/_edithomesection.scss';

interface SuccessSectionEditProps {
  sectionData: SuccessStorySection;
  onUpdate: (section: SuccessStorySection) => void;
  onUploadImage: (file: File, index: number) => void;
}

const SuccessSectionEdit: React.FC<SuccessSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '']);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Ensure imgUrls has two entries and update imagePreviews when sectionData.imgUrls changes
  useEffect(() => {
    if (!sectionData.imgUrls || sectionData.imgUrls.length !== 2) {
      onUpdate({ ...sectionData, imgUrls: ['', ''] });
    } else {
      setImagePreviews([...sectionData.imgUrls]);
    }
  }, [sectionData.imgUrls, onUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...sectionData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      // Update image previews
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = previewUrl;
      setImagePreviews(updatedPreviews);

      // Upload image and update sectionData.imgUrls when done
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
      const updatedImgUrls = [...sectionData.imgUrls];
      const removedImgUrl = updatedImgUrls[index];

      if (removedImgUrl) {
        const imageRef = ref(storage, removedImgUrl);
        await deleteObject(imageRef);
        updatedImgUrls[index] = '';
      }

      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, { imgUrls: updatedImgUrls });

      // Update sectionData and imagePreviews
      onUpdate({ ...sectionData, imgUrls: updatedImgUrls });
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
      await updateDoc(docRef, {
        imgUrls: sectionData.imgUrls,
        title: sectionData.title,
        hungarianTitle: sectionData.hungarianTitle,
        title1: sectionData.title1,
        title2: sectionData.title2,
        hungarianTitle1: sectionData.hungarianTitle1,
        hungarianTitle2: sectionData.hungarianTitle2,
      });
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
      <h3>Success Story Section</h3>
      {/* English Main Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          English Main Title
        </label>
        <input
          id="title"
          name="title"
          className="form-control mb-2"
          value={sectionData.title}
          onChange={handleChange}
          placeholder="Title"
        />
      </div>
      {/* Hungarian Main Title */}
      <div className="mb-3">
        <label htmlFor="hungarianTitle" className="form-label">
          Hungarian Main Title
        </label>
        <input
          id="hungarianTitle"
          name="hungarianTitle"
          className="form-control mb-2"
          value={sectionData.hungarianTitle}
          onChange={handleChange}
          placeholder="Hungarian Title"
        />
      </div>
      {/* First Image */}
      <div className="mb-3">
        <label htmlFor="title1" className="form-label">
          English Title - Image 1
        </label>
        <input
          id="title1"
          name="title1"
          className="form-control mb-2"
          value={sectionData.title1}
          onChange={handleChange}
          placeholder="Title1"
        />
        <label htmlFor="hungarianTitle1" className="form-label">
          Hungarian Title - Image 1
        </label>
        <input
          id="hungarianTitle1"
          name="hungarianTitle1"
          className="form-control mb-2"
          value={sectionData.hungarianTitle1}
          onChange={handleChange}
          placeholder="Hungarian Title1"
        />
        {imagePreviews[0] ? (
          <div className="image-wrapper">
            <img src={imagePreviews[0]} alt="First Preview" />
            <button className="remove-btn" onClick={() => handleRemoveImage(0)}>
              X
            </button>
          </div>
        ) : sectionData.imgUrls[0] ? (
          <div className="image-wrapper">
            <img src={sectionData.imgUrls[0]} alt="First Image" />
            <button className="remove-btn" onClick={() => handleRemoveImage(0)}>
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
            className="form-control mb-2"
          />
        )}
      </div>
      {/* Second Image */}
      <div className="mb-3">
        <label htmlFor="title2" className="form-label">
          English Title - Image 2
        </label>
        <input
          id="title2"
          name="title2"
          className="form-control mb-2"
          value={sectionData.title2}
          onChange={handleChange}
          placeholder="Title2"
        />
        <label htmlFor="hungarianTitle2" className="form-label">
          Hungarian Title - Image 2
        </label>
        <input
          id="hungarianTitle2"
          name="hungarianTitle2"
          className="form-control mb-2"
          value={sectionData.hungarianTitle2}
          onChange={handleChange}
          placeholder="Hungarian Title2"
        />
        {imagePreviews[1] ? (
          <div className="image-wrapper">
            <img src={imagePreviews[1]} alt="Second Preview" />
            <button className="remove-btn" onClick={() => handleRemoveImage(1)}>
              X
            </button>
          </div>
        ) : sectionData.imgUrls[1] ? (
          <div className="image-wrapper">
            <img src={sectionData.imgUrls[1]} alt="Second Image" />
            <button className="remove-btn" onClick={() => handleRemoveImage(1)}>
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
            className="form-control mb-2"
          />
        )}
      </div>

      {message && (
        <p className={`message-box ${isSuccess ? 'success' : 'error'}`}>{message}</p>
      )}

      <button onClick={handleSaveChanges} className="btn save-btn">
        Save Changes
      </button>
    </div>
  );
};

export default SuccessSectionEdit;
