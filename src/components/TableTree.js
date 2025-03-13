import React, { useState, useEffect } from "react";

const containerStyle = {
  display: "flex",
};

const leftPanelStyle = {
  width: "35%",
  borderRight: "1px solid #ddd",
  padding: "10px",
  overflowY: "auto", // Pour le scroll si la liste est longue
  height: "100vh",
};

const rightPanelStyle = {
  width: "75%",
  padding: "10px",
};

const TableTree = ({  documents }) => {
  // const FolderDocuments = ({ folders, documents }) => {
  const [folders, setFolders] = useState([]);  // Liste des dossiers transformés en arbre
  const [expandedRows, setExpandedRows] = useState({});  // État des lignes ouvertes
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7047/api/ManageFolder/GetAllFolder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFsaWRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3lzdGVtLlJ1bnRpbWUuQ29tcGlsZXJTZXJ2aWNlcy5Bc3luY1Rhc2tNZXRob2RCdWlsZGVyYDErQXN5bmNTdGF0ZU1hY2hpbmVCb3hgMVtTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5JTGlzdGAxW1N5c3RlbS5TdHJpbmddLE1pY3Jvc29mdC5Bc3BOZXRDb3JlLklkZW50aXR5LlVzZXJNYW5hZ2VyYDErPEdldFJvbGVzQXN5bmM-ZF9fMTExW01pY3Jvc29mdC5Bc3BOZXRDb3JlLklkZW50aXR5LklkZW50aXR5VXNlcl1dIiwiZXhwIjoxNzQxNjU4ODQxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwNDciLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjcwNDcifQ.ZEYWhPlt_Fq4pzVZR8_NVAQ3OMBN2HyIL_481_F5-HI" , // Ajoute ton token ici
          },
        });
  
        if (!response.ok) {
          throw new Error("Erreur API: " + response.statusText);
        }
        
        const data = await response.json();
        console.log('Data Liste '+data);
        setFolders(buildTree(data));
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers :", error);
      }
    };
  
    fetchData();
  }, []);
  

  // Fonction pour transformer la liste en arbre
  const buildTree = (data) => {
    const map = {};
    const tree = [];

    // Créer une map avec chaque dossier
    data.forEach((item) => (map[item.id] = { ...item, children: [] }));

    // Placer chaque élément dans son parent ou dans la racine
    data.forEach((item) => {
      if (!item.idParent) {
        tree.push(map[item.id]); // Racine
      } else {
        map[item.idParent]?.children.push(map[item.id]); // Ajouter comme enfant
      }
    });

    return tree;
  };

  // Fonction pour ouvrir/fermer une ligne
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fonction pour rendre les lignes des dossiers
  // const renderRows = (folders) => {
  //   return folders.map((folder, index) => (
  //     <tr key={index} onClick={() => handleFolderClick(folder)}>
  //       <td>{folder.name}</td>
  //     </tr>
  //   ));
  // };

  // Gérer la sélection d'un dossier
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  // Récupérer les documents du dossier sélectionné
  const getDocumentsForFolder = (folder) => {
    return documents.filter(doc => doc.folderId === folder.id);
  };

  // Fonction récursive pour afficher les dossiers et sous-dossiers
  const renderRows = (items, level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <tr onClick={() => toggleRow(item.id)} style={{ cursor: "pointer" }}>
          <td >
          <div style={{ paddingLeft: `${level * 20}px` }}>
            {item.children.length > 0 && (
              <i className={`fas fa-caret-${expandedRows[item.id] ? "up" : "right"} fa-fw`}></i>
            )}
         {item.name} 
         </div>
            
          </td>
        </tr>
        {expandedRows[item.id] && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="container-fluid content-wrapper">
    <div className="row">
      {/* Menu latéral des dossiers */}
      <div className="col-md-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dossiers</h3>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover">
              <tbody>
                {folders.length > 0 ? renderRows(folders) : <tr><td>Chargement...</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tableau à droite */}
      <div className="col-md-10">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Documents</h3>
          </div>
          <div className="card-body">
            {selectedFolder ? (
              <>
                <h4>Documents du dossier: {selectedFolder.name}</h4>
                <ul>
                  {getDocumentsForFolder(selectedFolder).map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Sélectionnez un dossier pour voir son contenu.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TableTree;