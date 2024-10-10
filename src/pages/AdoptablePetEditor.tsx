import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase/Firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { Pet } from "../firebase/types";
import { getPets } from "../firebase/petservice";

const AdoptablePetEditor: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (petId) {
        const pets = await getPets();
        for (let i = 0; i < pets.length; i++) {
          if (pets[i].id === petId) { //check if the pet id from the url matches the pet id from the pets array
            setPet(pets[i]);
            setImgUrls(pets[i].img_urls || []); //set the img urls for the editing pet
            setTitle(pets[i].title || "");  
            setContent(pets[i].content || "");
            break;
          }
        }
      }
    };

    fetchPet();
  }, [petId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveCurrentImage = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
      const updatedImgUrls = imgUrls.filter((url) => url !== imageUrl);
      setImgUrls(updatedImgUrls);

      if (petId) {
        const petDoc = doc(db, "pets", petId);
        await updateDoc(petDoc, {
          img_urls: updatedImgUrls,
        });
      }

      setMessage("Image deleted successfully.");
      setIsSuccess(true);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting image: ", error);
      setMessage("Failed to delete image.");
      setIsSuccess(false);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `pets/${petId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
      });

      const urls = await Promise.all(uploadPromises);

      if (petId) {
        const petDoc = doc(db, "pets", petId);
        const docSnap = await getDoc(petDoc);
        if (!docSnap.exists()) {
          await setDoc(petDoc, { img_urls: urls, title, content });
        } else {
          await updateDoc(petDoc, {
            img_urls: arrayUnion(...urls),
            title,
            content,
          });
        }
        setImgUrls((prevUrls) => [...prevUrls, ...urls]);
      }

      setMessage("Changes saved successfully!");
      setIsSuccess(true);
      setFiles([]); // Clear selected files after upload
    } catch (error) {
      console.error("Error uploading images: ", error);
      setMessage("Error uploading images.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="adoptable-pet-editor">
        <h2>Manage Adoptable Pet Information</h2>
        {pet ? (
          <div>
            <p><strong>ID:</strong> {petId}</p>
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Age:</strong> {pet.age} {pet.age_type}</p>
            <p><strong>Type:</strong> {pet.type}</p>
          </div>
        ) : (
          <p>No pet found.</p>
        )}

        <label><strong>Title:</strong></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title for the pet"
          className="input-field"
        />

        <label><strong>Description:</strong></label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter description for the pet"
          className="textarea-field"
        ></textarea>

        <h3>Current Images:</h3>
        <div className="image-preview-grid">
          {imgUrls.length > 0 ? (
            imgUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`Preview ${index}`} />
                <button
                  className="remove-btn"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this image?")) {
                      handleRemoveCurrentImage(url);
                    }
                  }}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>This pet has no images yet.</p>
          )}
        </div>

        <h3>Upload More Images:</h3>
        <input type="file" multiple onChange={handleFileChange} />

        {files.length > 0 && (
          <div className="preview-container">
            <h3>Selected Images for Upload:</h3>
            <div className="image-preview-grid">
              {files.map((file, index) => (
                <div key={index} className="image-preview">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  <span className="preview-name">{file.name}</span>
                  <button className="remove-btn" onClick={() => handleRemoveFile(index)}>X</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn upload-btn" onClick={handleUpload} disabled={loading}>
          {loading ? (
            <span>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>

        {message && (
          <p className={`message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
};

export default AdoptablePetEditor;
