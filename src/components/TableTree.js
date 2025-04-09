import { useRef,useState, useEffect } from "react";
import React from 'react';
import { FaDownload, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import './TableTree.css';

 const TableTree = () => {

  const [folders, setFolders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [documents, setDocuments] = useState([]); // Stockage des documents

  //  const DocumentTable = ({ documents, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedType, setSelectedType] = useState(""); // Stocke le type du fichier
    const [description, setDescription] = useState(""); //
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    //Ajoutez un état pour stocker le document à modifier et pour gérer l’affichage du modal.
    const [showModal, setShowModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      
      setSelectedFile(file);
      console.log("Fichier sélectionné :", file);
    };
  
    // const handleUpload = () => {
    //   if (!selectedFile) {
    //     alert("Veuillez sélectionner un fichier.");
    //     return;
    //   }
    //   console.log("Uploading:", selectedFile.name);
    //   onUpload(selectedFile);
    //   setSelectedFile(null); // Réinitialiser l'input après l'upload
    // };
    //Model edit
    //Cette fonction ouvrira le modal et remplira les champs avec les données du document sélectionné
    const handleEdit = (doc) => {
      setSelectedDoc(doc);
      setShowModal(true);
    };
    //Ajoutez un modal pour modifier les informations du document.
    const EditModal = ({ show, onClose, doc, onSave }) => {
      const [formData, setFormData] = useState(doc || {});
    
      useEffect(() => {
        setFormData(doc || {});
      }, [doc]);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = () => {
        onSave(formData);
        onClose();
      };
    
      if (!show) return null;
    
      return (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le Document</h2>
            <label>Nom:</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
            <label>Description:</label>
            <input type="text" name="description" value={formData.description || ''} onChange={handleChange} />
            <label>Date:</label>
            <input type="date" name="date" value={formData.date || ''} onChange={handleChange} />
            <button onClick={handleSubmit} className="btn btn-success">Enregistrer</button>
            <button onClick={onClose} className="btn btn-secondary">Annuler</button>
          </div>
        </div>
      );
    };
    //Créez une fonction pour mettre à jour l’état des documents après modification
    const handleSave = (updatedDoc) => {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
      );
    };
    <EditModal show={showModal} onClose={() => setShowModal(false)} doc={selectedDoc} onSave={handleSave} />
//fin Model
    const handleUpload = async () => {
      if (!selectedFile) {
        alert("Veuillez sélectionner un fichier.");
        return;
      }
    alert(selectedFile.name)
      const formData = new FormData();
    
      formData.append("file", selectedFile);
      if (!selectedFolder) {
        alert("Veuillez sélectionner un dossier.");
        return;
      }
      alert(selectedFolder.id)
      // formData.append("file", selectedFile); // Ajout du fichier
      // formData.append("idparent", selectedFolder.id);
       try {
        const response = await fetch('https://localhost:7047/api/FileUpload/Upload/', {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": "Bearer TON_TOKEN",
            "idParent": selectedFolder.id,        // Passer idParent via le header
            "file": selectedFile 
          },
        });
    
        // if (!response.ok) {
        //   throw new Error("Erreur lors de l'upload : " + response.statusText);
        // }
        console.log("Réponse complète du serveur :", response);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur lors de l'upload : ${response.status} - ${errorText}`);
        }
        alert("Fichier uploadé avec succès !");
        setSelectedFile(null);
        fetchDocuments(selectedFolder.id);
        fileInputRef.current.value = "";
      } catch (error) {
        console.error("Erreur d'upload :", error);
        alert("Échec de l'upload !");
      }
    };
  useEffect(() => {
    const fetchFolders = async () => {
      
      try {
        const response = await fetch("https://localhost:7047/api/ManageFolder/GetAllFolder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer TON_TOKEN",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur API: " + response.statusText);
        }

        const data = await response.json();
        setFolders(buildTree(data));
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers :", error);
      }
    };

    fetchFolders();
  }, []);

  const fetchDocuments = async (folderId) => {
    try {
      setDocuments([]);
      const response = await fetch(`https://localhost:7047/api/Business/GetDocumentBusinessByParent/${folderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer TON_TOKEN",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur API: " + response.statusText);
      }

      const data = await response.json();
      setDocuments(data);
     
    } catch (error) {
      console.error("Erreur lors du chargement des documents :", error);
    }
  };

  const buildTree = (data) => {
    const map = {};
    const tree = [];

    data.forEach((item) => (map[item.id] = { ...item, children: [] }));

    data.forEach((item) => {
      if (!item.idParent) {
        tree.push(map[item.id]);
      } else {
        map[item.idParent]?.children.push(map[item.id]);
      }
    });

    return tree;
  };

  const toggleRow = (folder) => {
    setExpandedRows((prev) => ({
      ...prev,
      [folder.id]: !prev[folder.id],
    }));
    setSelectedFolder(folder);
    fetchDocuments(folder.id);
  };

  const renderRows = (items, level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <tr onClick={() => toggleRow(item)} style={{ cursor: "pointer" }}>
          <td style={{ width: "100px", whiteSpace: "nowrap" }}>
            <div style={{ paddingLeft: `${level * 20}px` }}>
              {item.children.length > 0 && (
                <i className={`fas fa-caret-${expandedRows[item.id] ? "down" : "right"} fa-fw`}></i>
              )}
              {item.name}
            </div>
          </td>
        </tr>
        {expandedRows[item.id] && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));
  };
  // const handleDownload = (doc) => {
  //   console.log("Téléchargement de", doc.name);
  //   // Logique de téléchargement icis
  // };
  const handleDownload = async (id) => {
    try {
      const response = await fetch(`https://localhost:7047/api/FileUpload/DownloadFile/${id}`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer TON_TOKEN", // Ajoute le token si nécessaire
        },
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }
  
      // Convertir la réponse en Blob (données binaires)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Créer un lien et déclencher le téléchargement
      const a = document.createElement("a");
      a.href = url;
      a.download = documents.name; // Nom du fichier téléchargé
      document.body.appendChild(a);
      a.click();
  
      // Nettoyage
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
      alert("Téléchargement réussi !");
    } catch (error) {
      console.error("Erreur de téléchargement :", error);
      alert("Échec du téléchargement !");
    }
  };
 
  
  const handleDelete = async (id) => {
    
    if (!window.confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;
    console.log("Tentative de suppression avec l'ID :", id);
    console.log(`URL appelée : https://localhost:7047/api/FileUpload/DeleteFile/${id}`);
    try {
      const response = await fetch(`https://localhost:7047/api/FileUpload/DeleteFile/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer TON_TOKEN", // Ajoute le token si nécessaire
        },
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
  
      alert("Fichier supprimé avec succès !");
      fetchDocuments(selectedFolder.id);
     // setFiles(files.filter(file => file.id !== id)); // Met à jour l'affichage
     setFiles((prevFiles) => prevFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression !");
    }
  };

  return (
    // <div className="container-fluid content-wrapper">
      <div className="row">
        {/* Menu des dossiers */}
        <div className="col-md-3 w-25">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dossiers</h3>
            </div>
            <div  className="card-body p-0 ">
              <table className="table table-hover">
                <tbody>
                  {folders.length > 0 ? renderRows(folders) : <tr><td>Chargement...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

            <div className="col-md-9 ">
       
                 {/* /.card */}
                  <div className="card">
                    <div className="card-header">
                            {selectedFolder ? (
                          <>
                          <h3 className="card-title">Documents du dossier : {selectedFolder.name}</h3>
                          </>
                          ) : (
                            <p>Sélectionnez un dossier pour voir son contenu.</p>
                          )}
                      
                    </div>
                      {/* Upload File Section */}
                      <div className="d-flex justify-content-end align-items-center  ">
                        <input type="file" className="form-control w-auto" ref={fileInputRef} onChange={handleFileChange} />
                        <button className="btn btn-primary" onClick={handleUpload}>
                          <FaUpload /> Upload
                        </button>
                      </div>
                    {/* /.card-header */}
                    <div className="card-body d-flex justify-content-end align-items-center">
                              {selectedFolder ? (
                          <>
                            {/* <h4>Documents du dossier : {selectedFolder.name}</h4> */}
                                <table id="example1" className="table justify-content-end table-bordered table-striped">
                                  <thead>
                                    <tr>
                                    <th>Id</th>
                                      <th>Name</th>
                                      <th>Description(s)</th>
                                      <th>Date</th>
                                      <th>Tiers</th>
                                      <th>Mt. HT</th>
                                      <th>Mt. Tva</th>
                                      <th>Mt. TTC</th> 
                                      <th>Path</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {documents.map((doc, index) => (
                                    <tr key={index}>
                                      <td>{doc.id}</td>
                                      <td>{doc.name}</td>
                                      <td>"{doc.description}"</td>
                                      <td>"{doc.date}"</td>
                                      <td>"{doc.Tiersid}"</td>
                                      <td style={{ width: "120px", fontSize: "18px", fontWeight: "bold" }}>"{doc.Mht}"</td>
                                      <td style={{ width: "120px", fontSize: "18px", fontWeight: "bold" }}>"{doc.Mdt}"</td>
                                      <td style={{ width: "120px", fontSize: "18px", fontWeight: "bold" }}>"{doc.Mttc}"</td>
                                      <td>"{doc.path}"</td>
                                      <td>
                                        <button className="btn btn-success mx-1" onClick={() => handleDownload(doc.id)}>
                                          <FaDownload />
                                        </button>
                                        <button className="btn btn-primary mx-1" onClick={() => handleEdit(doc)}>
                                          <FaEdit />
                                        </button>
                                        <button className="btn btn-danger mx-1" onClick={() => handleDelete(doc.id)}>
                                          <FaTrash />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  
                                  </tbody>
                                  {/* <tfoot>
                                    <tr>
                                      <th>Rendering engine</th>
                                      <th>Browser</th>
                                      <th>Platform(s)</th>
                                      <th>Engine version</th>
                                      <th>CSS grade</th>
                                    </tr>
                                  </tfoot> */}
                                </table>
                                </>
                        ) : (
                          <p></p>
                        )}
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
           
                  </div>


      </div>
    // </div>
  );

};


export default TableTree;