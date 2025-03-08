
import { Link } from 'react-router-dom';


function SideNav() {
    
    return (
        <div >
            <div className="App">
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <a href="index3.html" className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
                    <span className="brand-text font-weight-light">AdminLTE 3</span>
                </a>
                
                <div className="sidebar">
                    
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <Link to="/TableTree" className="d-block">Alexander Pierce</Link>
                    </div>
                    </div>
                   
                    <div className="form-inline">
                    <div className="input-group" data-widget="sidebar-search">
                        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                        <div className="input-group-append">
                        <button className="btn btn-sidebar">
                            <i className="fas fa-search fa-fw" />
                        </button>
                        </div>
                    </div>
                    </div>
                 
                    <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        
                       
                    <li className="nav-item">
                            
                        <Link to="/TableTree" className="nav-link active">
                            <i className="nav-icon fas fa-tachometer-alt" />
                            
                            <p>
                            Tableau de bord
                             {/* <i className="right fas fa-angle-left" />  */}
                            </p>
                        </Link>
                    </li>
                        <li className="nav-item menu-open">
                        <Link to="/TableTree" className="nav-link">
                            <i className="nav-icon fas fa-copy" />
                            <p>
                            Parametrages
                            <i className="fas fa-angle-left right" />
                            
                            </p>
                        </Link>
                        <ul className="nav nav-treeview">
                            <li className="nav-item">
                            <a href="pages/layout/top-nav.html" className="nav-link">
                               
                                <p>Villes</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/layout/top-nav.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Pays</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/layout/top-nav.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Famille Tiers</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/layout/top-nav.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Tiers</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/layout/top-nav.html" className="nav-link">
                                <i className="far fa FaAlignCenter nav-icon" /> 
                                <p>Personnel</p>
                            </a>
                            </li>
                        </ul>
                        </li>
                        <li className="nav-item menu-open">
                        
                        <Link to="/TableTree" className="nav-link">
                        <i className="nav-icon fas fa-copy" />
                                <p>
                                    Archivage des documents
                                    <i className="right fas fa-angle-left" />
                                </p>
                        </Link>
                        <ul className="nav nav-treeview">
                                                    <li>
                                    <Link to="/TableTree" >
                                        <p>Ventes</p>
                                    </Link>
                            
                                    </li>
                            <li className="nav-item">
                            <a href="pages/charts/flot.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Achats</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/charts/inline.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Réglements</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/charts/inline.html" className="nav-link">
                                 <i className="far fa-circle nav-icon" /> 
                                <p>Personnel</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/charts/inline.html" className="nav-link">
                                <i className="far fa-circle nav-icon" /> 
                                <p>Projet</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/charts/inline.html" className="nav-link">
                                 <i className="far fa-circle nav-icon" /> 
                                <p>Comptabilité</p>
                            </a>
                            </li>
                            <li className="nav-item">
                            <a href="pages/charts/inline.html" className="nav-link">
                               <i className="far fa-circle nav-icon" /> 
                                <p>Appel d'offre</p>
                            </a>
                            </li>
                        </ul>
                        </li>
                    
                    </ul>
                    </nav>
                </div>
                </aside>

        </div>
      </div>
      
    );
}
  
  
  export default SideNav;