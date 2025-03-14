import { useState, useEffect } from "react";
import React from 'react';

const TableTree = () => {
  const [folders, setFolders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [documents, setDocuments] = useState([]); // Stockage des documents

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
          <td>
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

  return (
    <div className="container-fluid content-wrapper">
      <div className="row">
        {/* Menu des dossiers */}
        <div className="col-md-3">
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

        {/* Liste des documents
        <div className="col-md-9">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Documents</h3>
            </div>
            <div className="card-body">
              {selectedFolder ? (
                <>
                  <h4>Documents du dossier : {selectedFolder.name}</h4>
                  <ul>
                    {documents.length > 0 ? (
                      documents.map((doc) => 
                      <li key={doc.id}>{doc.name}</li>
                    
                    )
                    ) : (
                      <p>Aucun document trouvé.</p>
                    )}
                  </ul>
                </>
              ) : (
                <p>Sélectionnez un dossier pour voir son contenu.</p>
              )}
            </div>
          </div>
        </div> */}

<div className="col-md-9">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Documents</h3>
            </div>
            <div className="card-body">
              {selectedFolder ? (
                <>
                  <h4>Documents du dossier : {selectedFolder.name}</h4>
                  <ul>
                    
                      <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Type</th>
                          <th>Taille</th>
                          <th>Date de création</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {documents.map((doc, index) => (
                          <tr key={index}>
                            <td>{doc.name}</td>
                            <td>{doc.description}</td>
                            <td>{(doc.size / 1024).toFixed(2)} KB</td>
                            <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  
                      <p>Aucun document trouvé.</p>
                    
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