import { useRef,useState, useEffect } from "react";
import React from 'react';
import { FaDownload, FaEdit, FaTrash, FaUpload } from "react-icons/fa";

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
    
    const handleUpload = async () => {
      if (!selectedFile) {
        alert("Veuillez sélectionner un fichier.");
        return;
      }
    alert(selectedFile.name)
      const formData = new FormData();
     
      if (!selectedFolder) {
        alert("Veuillez sélectionner un dossier.");
        return;
      }
      alert(selectedFolder.id)
      formData.append("file", selectedFile); // Ajout du fichier
      formData.append("idparent", selectedFolder.id);
      // try {
        const response = await fetch("https://localhost:7047/api/FileUpload/Upload", {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": "Bearer TON_TOKEN",
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
        fileInputRef.current.value = "";
      // } catch (error) {
      //   console.error("Erreur d'upload :", error);
      //   alert("Échec de l'upload !");
      // }
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
      const response = await fetch(`https://localhost:7047/api/FileUpload/GetFilesByParent/${folderId}`, {
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
          <td className="w-25">
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
  const handleDownload = (doc) => {
    console.log("Téléchargement de", doc.name);
    // Logique de téléchargement ici
  };
  
  const handleEdit = (doc) => {
    console.log("Modification de", doc.name);
    // Logique de modification ici
  };
  
  const handleDelete = (doc) => {
    console.log("Suppression de", doc.name);
    // Logique de suppression ici
  };
  return (
    <div className="container-fluid content-wrapper">
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

            <div className="col-md-9">
       
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
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <input type="file" className="form-control w-auto" ref={fileInputRef} onChange={handleFileChange} />
                        <button className="btn btn-primary" onClick={handleUpload}>
                          <FaUpload /> Upload
                        </button>
                      </div>
                    {/* /.card-header */}
                    <div className="card-body">
                    {selectedFolder ? (
                <>
                  {/* <h4>Documents du dossier : {selectedFolder.name}</h4> */}
                      <table id="example1" className="table table-bordered table-striped">
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
                              <button className="btn btn-success mx-1" onClick={() => handleDownload(doc)}>
                                <FaDownload />
                              </button>
                              <button className="btn btn-primary mx-1" onClick={() => handleEdit(doc)}>
                                <FaEdit />
                              </button>
                              <button className="btn btn-danger mx-1" onClick={() => handleDelete(doc)}>
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
    </div>
  );

};

// Exemple de gestion de l'upload
const handleUpload = (file) => {
  console.log("Fichier uploadé:", file);
  // Ajouter la logique pour envoyer le fichier au backend
};
export default TableTree;