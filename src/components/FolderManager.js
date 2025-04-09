import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [name, setName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
const [documents, setDocuments] = useState([]); // Stockage des documents
const [folderName, setFolderName] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);
  const handleAdd = async () => {
    if (!folderName.trim()) return;
  
    try {
      await axios.post("/api/folders", {
        name: folderName,
      });
  
      setFolderName(""); // Clear input
      fetchFolders();    // Rafraîchir les données
    } catch (err) {
      console.error("Erreur d'ajout :", err);
    }
  };
  const fetchFolders = async () => {
    try {
      const response = await axios.get('/api/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers', error);
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
  const handleAddOrUpdate = async () => {
    if (!name.trim()) return;

    try {
      if (editingFolder) {
        await axios.put(`/api/folders/${editingFolder.id}`, { name });
      } else {
        await axios.post('/api/folders', { name });
      }

      setName('');
      setEditingFolder(null);
      fetchFolders();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du dossier', error);
    }
  };

  const handleEdit = (folder) => {
    setName(folder.name);
    setEditingFolder(folder);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/folders/${id}`);
      fetchFolders();
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier', error);
    }
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
    
          <td className="d-flex gap-2">
            <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEdit(item)}
            >
                ✏️ Éditer
            </button>
            <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.id)}
            >
                🗑️ Supprimer
            </button>
            </td>
 
        </tr>
        {expandedRows[item.id] && renderRows(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    
    <div className="card">
                <div className="card-body">
                    <div className="card-header d-flex justify-content-between align-items-center">
                    {selectedFolder ? (
                          <>
                          <h3 className="card-title">Documents du dossier : {selectedFolder.name} {selectedFolder.id}</h3>
                          </>
                          ) : (
                            <p>Sélectionnez un dossier pour voir son contenu.</p>
                          )}
                        {/* <h3 className="card-title m-0">Dossiers </h3> */}
                        <h3 className="card-title m-0">     </h3>
                        {/* Input + bouton alignés à droite */}
                        <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du dossier"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            style={{ width: "200px" }}
                        />
                        <button className="btn btn-success" onClick={handleAdd}>
                            ➕ Ajouter
                        </button>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-hover">
                        <thead>
                            <tr>
                            <th>Nom</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.length > 0 ? renderRows(folders) : (
                            <tr><td colSpan="2">Chargement...</td></tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                    </div>
                                        
                    </div>          
             
             
           
 

  );
};

export default FolderManager;