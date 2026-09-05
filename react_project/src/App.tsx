import { Suspense,lazy } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { GlobalProvider } from './context/GlobalContext';
const Home=lazy(()=>import('./pages/Home')); const History=lazy(()=>import('./pages/History')); const ResourceDetail=lazy(()=>import('./pages/ResourceDetail'));
export default function App(){return <Router><GlobalProvider><div className="app-shell"><div className="ambient ambient-a"/><div className="ambient ambient-b"/><Navbar/><main className="container page-wrap"><Suspense fallback={<div className="loading-screen"><div className="spinner"/><span>Loading CampusRes...</span></div>}><Routes><Route path="/" element={<Home/>}/><Route path="/history" element={<History/>}/><Route path="/resource/:id" element={<ResourceDetail/>}/></Routes></Suspense></main><footer className="footer">CampusRes <span>•</span> Campus resource management dashboard <span>•</span> Demo environment</footer></div></GlobalProvider></Router>}
