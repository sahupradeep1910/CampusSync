import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Resource, BorrowRecord, AppState } from '../types';

const MOCK_RESOURCES: Resource[] = [
  { id:'1', name:'Introduction to Algorithms', type:'Book', category:'Library', isAvailable:true, description:'A comprehensive reference for algorithms, data structures, complexity and problem solving.', location:'Central Library • Shelf A12', rating:4.9, usageCount:42, addedDate:'2026-08-14' },
  { id:'2', name:'MacBook Pro M1', type:'Equipment', category:'Lab', isAvailable:true, description:'High-performance laptop reserved for development, coursework and technical projects.', location:'Innovation Lab • Desk 07', rating:4.8, usageCount:31, addedDate:'2026-08-22' },
  { id:'3', name:'Clean Code', type:'Book', category:'Library', isAvailable:false, description:'Practical guidance for writing readable, maintainable and professional software.', location:'Central Library • Shelf C04', rating:4.7, usageCount:56, addedDate:'2026-07-30' },
  { id:'4', name:'Digital Oscilloscope', type:'Equipment', category:'Lab', isAvailable:true, description:'Digital oscilloscope for waveform inspection and electronics laboratory experiments.', location:'Electronics Lab • Bay 03', rating:4.6, usageCount:18, addedDate:'2026-08-08' },
  { id:'5', name:'Basketball', type:'Equipment', category:'Sports', isAvailable:true, description:'Official size basketball available for student recreation and sports activities.', location:'Sports Complex • Counter 02', rating:4.5, usageCount:24, addedDate:'2026-08-18' },
  { id:'6', name:'Design Patterns', type:'Book', category:'Library', isAvailable:true, description:'Reusable object-oriented design solutions for building flexible software systems.', location:'Central Library • Shelf B18', rating:4.8, usageCount:37, addedDate:'2026-08-27' },
  { id:'7', name:'Arduino Starter Kit', type:'Equipment', category:'Lab', isAvailable:true, description:'Microcontroller kit with sensors and components for rapid IoT prototyping.', location:'Maker Lab • Cabinet 05', rating:4.9, usageCount:29, addedDate:'2026-08-29' },
  { id:'8', name:'Database System Concepts', type:'Book', category:'Library', isAvailable:true, description:'A structured introduction to database architecture, SQL, transactions and indexing.', location:'Central Library • Shelf D11', rating:4.6, usageCount:21, addedDate:'2026-08-25' },
];

const MOCK_HISTORY: BorrowRecord[] = [
  { id:'h1', studentName:'Alice Johnson', studentId:'S001', resourceId:'3', resourceName:'Clean Code', borrowDate:new Date(Date.now()-86400000*2).toISOString(), returned:false },
  { id:'h2', studentName:'Rahul Mehta', studentId:'S017', resourceId:'1', resourceName:'Introduction to Algorithms', borrowDate:new Date(Date.now()-86400000*8).toISOString(), returned:true, returnDate:new Date(Date.now()-86400000*4).toISOString() },
  { id:'h3', studentName:'Neha Das', studentId:'S024', resourceId:'5', resourceName:'Basketball', borrowDate:new Date(Date.now()-86400000*12).toISOString(), returned:true, returnDate:new Date(Date.now()-86400000*11).toISOString() },
  { id:'h4', studentName:'Arjun Patel', studentId:'S031', resourceId:'2', resourceName:'MacBook Pro M1', borrowDate:new Date(Date.now()-86400000*15).toISOString(), returned:true, returnDate:new Date(Date.now()-86400000*12).toISOString() },
  { id:'h5', studentName:'Priya Singh', studentId:'S044', resourceId:'6', resourceName:'Design Patterns', borrowDate:new Date(Date.now()-86400000*18).toISOString(), returned:true, returnDate:new Date(Date.now()-86400000*14).toISOString() },
];

type Action =
 | {type:'SET_DATA'; payload:{resources:Resource[]; history:BorrowRecord[]}}
 | {type:'BORROW_RESOURCE'; payload:{studentName:string; studentId:string; resourceId:string}}
 | {type:'RETURN_RESOURCE'; payload:{resourceId:string}};

const initialState:AppState={resources:[],borrowHistory:[],isLoading:true};
const reducer=(state:AppState,action:Action):AppState=>{
 switch(action.type){
  case 'SET_DATA': return {...state,...action.payload,isLoading:false};
  case 'BORROW_RESOURCE': { const {studentName,studentId,resourceId}=action.payload; const resource=state.resources.find(r=>r.id===resourceId); if(!resource||!resource.isAvailable)return state; const record:BorrowRecord={id:crypto.randomUUID(),studentName,studentId,resourceId,resourceName:resource.name,borrowDate:new Date().toISOString(),returned:false}; return {...state,resources:state.resources.map(r=>r.id===resourceId?{...r,isAvailable:false,usageCount:(r.usageCount??0)+1}:r),borrowHistory:[record,...state.borrowHistory]}; }
  case 'RETURN_RESOURCE': return {...state,resources:state.resources.map(r=>r.id===action.payload.resourceId?{...r,isAvailable:true}:r),borrowHistory:state.borrowHistory.map(h=>h.resourceId===action.payload.resourceId&&!h.returned?{...h,returned:true,returnDate:new Date().toISOString()}:h)};
 }
};
interface GlobalContextType extends AppState {borrowResource:(n:string,id:string,r:string)=>void;returnResource:(r:string)=>void}
const GlobalContext=createContext<GlobalContextType|undefined>(undefined);
export const GlobalProvider=({children}:{children:ReactNode})=>{const[state,dispatch]=useReducer(reducer,initialState);useEffect(()=>{const t=setTimeout(()=>dispatch({type:'SET_DATA',payload:{resources:MOCK_RESOURCES,history:MOCK_HISTORY}}),650);return()=>clearTimeout(t)},[]);return <GlobalContext.Provider value={{...state,borrowResource:(n,id,r)=>dispatch({type:'BORROW_RESOURCE',payload:{studentName:n,studentId:id,resourceId:r}}),returnResource:r=>dispatch({type:'RETURN_RESOURCE',payload:{resourceId:r}})}}>{children}</GlobalContext.Provider>};
export const useGlobal=()=>{const c=useContext(GlobalContext);if(!c)throw new Error('useGlobal must be used within GlobalProvider');return c};
