// FosterSection.tsx
import React, { useState } from 'react';
import { FosterSection } from '../../firebase/types';
import { deleteObject, ref } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/Firebase';
import '../../styles/_edithomesection.scss';

interface FosterSectionEditProps {
  sectionData: FosterSection;
  onUpdate: (section: FosterSection) => void;
  onUploadImage: (file: File) => void;
}

const FosterSectionEdit: React.FC<FosterSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
}) => {
  const [preview, setPreview] = useState<string | null>(sectionData.imgUrl || null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...sectionData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onUploadImage(file);
    }
  };

  const handleRemoveImageClick = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    if (!sectionData.id) {
      setMessage('Section ID is not available. Cannot delete image.');
      setIsSuccess(false);
      return;
    }

    try {
      if (sectionData.imgUrl) {
        const imageRef = ref(storage, sectionData.imgUrl);
        await deleteObject(imageRef);
      }

      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, { imgUrl: '' });

      setPreview(null);
      onUpdate({ ...sectionData, imgUrl: '' });
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
        imgUrl: sectionData.imgUrl,
        title: sectionData.title,
        content: sectionData.content,
        hungarianTitle: sectionData.hungarianTitle,
        hungarianContent: sectionData.hungarianContent,
      });
      setMessage('Changes saved successfully.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving changes: ', error);
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
      <h3>Foster Section</h3>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          English Title
        </label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={sectionData.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          English Content
        </label>
        <textarea
          id="content"
          name="content"
          className="form-control"
          value={sectionData.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianTitle" className="form-label">
          Hungarian Title
        </label>
        <input
          id="hungarianTitle"
          name="hungarianTitle"
          className="form-control"
          value={sectionData.hungarianTitle}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianContent" className="form-label">
          Hungarian Content
        </label>
        <textarea
          id="hungarianContent"
          name="hungarianContent"
          className="form-control"
          value={sectionData.hungarianContent}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="imgUrl" className="form-label">
          Current Image
        </label>
        <div className="image-wrapper">
          {preview ? (
            <>
              <img src={preview} alt="Foster" />
              <button className="remove-btn" onClick={handleRemoveImageClick}>
                X
              </button>
            </>
          ) : (
            <div>
              <input type="file" id="newImage" accept="image/*" onChange={handleImageChange} />
            </div>
          )}
        </div>
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

export default FosterSectionEdit;
