import React, { useState, useEffect } from "react";

const TableTree = () => {
  const [folders, setFolders] = useState([]);  // Liste des dossiers transformés en arbre
  const [expandedRows, setExpandedRows] = useState({});  // État des lignes ouvertes

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

  // Fonction récursive pour afficher les dossiers et sous-dossiers
  const renderRows = (items, level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <tr onClick={() => toggleRow(item.id)} style={{ cursor: "pointer" }}>
          <td style={{ paddingLeft: `${level * 20}px` }}>
            {item.children.length > 0 && (
              <i className={`fas fa-caret-${expandedRows[item.id] ? "down" : "right"} fa-fw`}></i>
            )}
            📂 {item.name}
          </td>
        </tr>
        {expandedRows[item.id] && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="content-wrapper">
    <div className="row">
      <div className="col-3">
        {/* Menu latéral des dossiers */}
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

      <div className="col-9">
        {/* Zone pour afficher les documents du dossier sélectionné */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Documents</h3>
          </div>
          <div className="card-body">
            {/* Ici, on affichera les documents du dossier sélectionné */}
            <p>Sélectionnez un dossier pour voir son contenu.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TableTree;