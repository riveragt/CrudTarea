import React, { useState,useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';


function App() {
const baseUrl="https://localhost:5001/api/empleados";
  const [data, setData]=useState([]);
  const [modalModificar,setModalModificar]=useState(false);
  const [modalAgregar,setModalAgregar]=useState(false);
  const [modalEliminar,setModalEliminar]=useState(false);
  const AbrirCerrarModalAgregarEmpelado=()=>{
    setModalAgregar(!modalAgregar);
  }
  const AbrirCerrarModalModificarEmpeleado=()=>{
    setModalModificar(!modalModificar);
  }
  const AbrirCerrarModalEliminarEmpleado=()=>{
    setModalEliminar(!modalEliminar);
  }
  const [gestorSeleccionado,setGestorSeleccionado]=useState({
    id_Empleados: '',
    codigo: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    fecha_nacimiento: '',
    id_puesto: ''
  })
const handleChange=e=>{
  const {name,value}=e.target;
setGestorSeleccionado({
  ...gestorSeleccionado,
  [name]:value
});
console.log(gestorSeleccionado);
}


const peticionGet=async()=>{
  await axios.get(baseUrl)
  .then(response=>{
    setData(response.data);
  }).catch(error=>{
    console.log('Error',error);
  })
}

const peticionPost=async()=>{
  delete gestorSeleccionado.id_Empleados;
  gestorSeleccionado.id_puesto=parseInt(gestorSeleccionado.id_puesto);
  await axios.post(baseUrl,gestorSeleccionado)
  .then(response=>{
    setData(data.concat(response.data));
    AbrirCerrarModalAgregarEmpelado();
    peticionGet();
  }).catch(error=>{
    console.log('Error',error);
  })
}

const peticionPut=async()=>{
  gestorSeleccionado.id_Empleados=parseInt(gestorSeleccionado.id_Empleados);
  gestorSeleccionado.id_puesto=parseInt(gestorSeleccionado.id_puesto);
  
  await axios.put(baseUrl,gestorSeleccionado)
  .then(response=>{
    setData(data.concat(response.data));
   
    AbrirCerrarModalModificarEmpeleado();
    peticionGet();
  }).catch(error=>{
    console.log('Error');
  })
}
const peticionDelete=async()=>{
  gestorSeleccionado.id_Empleados=parseInt(gestorSeleccionado.id_Empleados);
  gestorSeleccionado.id_puesto=parseInt(gestorSeleccionado.id_puesto);
  
  await axios.delete(baseUrl+"/"+gestorSeleccionado.id_Empleados)
  .then(response=>{
    setData(data.filter(gestor=>gestor.id_Empleados!==response.data));
   
    AbrirCerrarModalEliminarEmpleado();
    peticionGet();
  }).catch(error=>{
    console.log('Error');
  })
}

const seleccionarGestor=(gestor, caso)=>{
  setGestorSeleccionado(gestor);
(caso==="Modificar")?
AbrirCerrarModalModificarEmpeleado():AbrirCerrarModalEliminarEmpleado();
}
useEffect(()=>{
 
peticionGet();
},[])

  return (
   
    <div className="App" >

    <button className="btn btn-primary" onClick={()=>AbrirCerrarModalAgregarEmpelado()}>&ensp;Agregar Empleado</button>
  
      <br></br>
     
      <br></br>
      <br></br>
     <table className="table table-hover" >
        <thead>
          <tr>
          <td>ID</td>
            <td>Codigo</td>
            <td>Nombres</td>
            <td>Apellidos</td>
            <td>Direcion</td>
            <td>Telefono</td>
            <td>Fecha De Nacimiento</td>
            <td>Id Puesto</td>
          </tr>
        </thead>
        <tbody >
        {data.map(gestor=>(
          <tr key={gestor.id_Empleados} onClick={()=>seleccionarGestor(gestor,"Modificar")} >
            <td>{gestor.id_Empleados}</td>
            <td>{gestor.codigo}</td>
            <td>{gestor.nombres}</td>
            <td>{gestor.apellidos}</td>
            <td>{gestor.direccion}</td>
            <td>{gestor.telefono}</td>
            <td>{gestor.fecha_nacimiento}</td>
            <td>{gestor.id_puesto}</td>
          </tr>
        ))}
        </tbody>
     </table>

     <Modal isOpen={modalAgregar}>
       <ModalHeader>Agregar</ModalHeader>
       <ModalBody>
        <div className="form-group">
          <label>Codigo:</label>
          <br/>
          <input type="text" className="form-control" name="codigo" onChange={handleChange} placeholder="Introdusca su Codigo"/>
          <label>Nombres:</label>
          <br/>
          <input type="text" className="form-control" name="nombres" onChange={handleChange} placeholder="Introdusca su Nombre"/>
          <label>Apellidos:</label>
          <br/>
          <input type="text" className="form-control" name="apellidos" onChange={handleChange} placeholder="Introdusca su Apellido"/>
          <label>Direccion:</label>
          <br/>
          <input type="text" className="form-control" name="direccion" onChange={handleChange} placeholder="Introdusca su Direccion"/>
          <label>Telefono:</label>
          <br/>
          <input type="text" className="form-control" name="telefono" onChange={handleChange} placeholder="Introdusca su Telefono"/>
          <label>Fecha De Nacimiento:</label>
          <br/>
          <input type="date" className="form-control" name="fecha_nacimiento" onChange={handleChange}/>
          
          <label>Puesto:</label>
          <br/>
          <input type="number" className="form-control" name="id_puesto" onChange={handleChange} placeholder="Introdusca su Id de Puesto"/>
        </div>
       </ModalBody>
       <ModalFooter>
       <button className="btn btn-primary" onClick={()=>peticionPost()}>Agregar</button>
       <button className="btn btn-danger" onClick={()=>AbrirCerrarModalAgregarEmpelado()}>Cancelar</button>
       </ModalFooter>
     </Modal>

     
     <Modal isOpen={modalModificar}>
       <ModalHeader>Modificar/Eliminar</ModalHeader>
       <ModalBody>
        <div className="form-group">
          <label>ID:</label>
          <br/>
          <input type="number" className="form-control" name="id_Empleados" value={gestorSeleccionado && gestorSeleccionado.id_Empleados} readOnly/>
          <label>Codigo:</label>
          <br/>
          <input type="text" className="form-control" name="codigo" value={gestorSeleccionado && gestorSeleccionado.codigo} onChange={handleChange}/>
          <label>Nombres:</label>
          <br/>
          <input type="text" className="form-control" name="nombres" value={gestorSeleccionado && gestorSeleccionado.nombres} onChange={handleChange}/>
          <label>Apellidos:</label>
          <br/>
          <input type="text" className="form-control" name="apellidos" value={gestorSeleccionado && gestorSeleccionado.apellidos} onChange={handleChange}/>
          <label>Direccion:</label>
          <br/>
          <input type="text" className="form-control" name="direccion" value={gestorSeleccionado && gestorSeleccionado.direccion} onChange={handleChange}/>
          <label>Telefono:</label>
          <br/>
          <input type="text" className="form-control" name="telefono" value={gestorSeleccionado && gestorSeleccionado.telefono} onChange={handleChange}/>
          <label>Fecha De Nacimiento:</label>
          <br/>
          <input type="text" className="form-control" name="fecha_nacimiento" value={gestorSeleccionado && gestorSeleccionado.fecha_nacimiento} onChange={handleChange}/>
          <label>Puesto:</label>
          <br/>
          <input type="text" className="form-control" name="id_puesto" value={gestorSeleccionado && gestorSeleccionado.id_puesto} onChange={handleChange}/>
        </div>
       </ModalBody>
       <ModalFooter>
       <button className="btn btn-primary" onClick={()=>peticionPut()}>Modificar</button>
       <button className="btn btn-info" onClick={()=>AbrirCerrarModalEliminarEmpleado()}>Eliminar</button>
       <button className="btn btn-danger" onClick={()=>AbrirCerrarModalModificarEmpeleado()}>Cancelar</button>
       </ModalFooter>
     </Modal>


     <Modal isOpen={modalEliminar}>
       <ModalBody>
         Estas Seguro que deseas Eliminar a {gestorSeleccionado && gestorSeleccionado.nombres}
       </ModalBody>
       <ModalFooter>
         <button className="btn btn-danger" onClick={()=>peticionDelete()&&AbrirCerrarModalModificarEmpeleado()}>
           Sí
         </button>
         <button className="btn btn-secondary" onClick={()=>AbrirCerrarModalEliminarEmpleado()&&AbrirCerrarModalModificarEmpeleado()}>
           No
         </button>
       </ModalFooter>
     </Modal>
    </div>
  );

}

export default App;
