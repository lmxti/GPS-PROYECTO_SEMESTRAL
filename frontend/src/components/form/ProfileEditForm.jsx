/* <----------------------- FUNCIONES ---------------------------> */
import { useState, useEffect } from "react";

/* <---------------- COMPONENTES MATERIAL UI --------------------> */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

/* <----------------------- SERVICIOS  -------------------------> */
import { updateUser } from "@/services/user.service";

export default function ProfileEditForm({ profile, onUpdateProfile }) {
    // Seteo de estado de modal, por default esta cerrado `false`.
    const [open, setOpen] = useState(false);
    // Seteo de objeto/formulario de campos modificados, objeto vacio por default
    const [editedProfile, setEditedProfile] = useState({});
    // Seteo de estado de carga de actualizacion, por default `false`.
    const [isLoading, setIsLoading] = useState(false);
  
    //<------------------------- MANEJO DE MODAL ------------------------->
    // Funcion encargada de abrir el modal.
    const handleOpen = () => setOpen(true);
    // Funcion encargada de cerra el modal.
    const handleClose = () => setOpen(false);
  
    //<------------------------- MANEJO DE FORMULARIO ------------------------->
    // Funcion encargada de manejar los cambios de la informacion default de 
    // los inputs y almacenarlos en el formulario/objeto `editedProfile`.
    const handleInputChange = (event) => {                                      
        setEditedProfile(prevState => ({
          ...prevState,
          [event.target.name]: event.target.value
        }));
      };
    // Funcion encargada de enviar solicitud con el formulario de campos editados, manejando el estado de carga
    // y volviendo a renderizar la informacion del perfil del usuario a traves de `onUpdateProfile`.
    const handleSubmit = async () => {
      try {
        setIsLoading(true);
        await updateUser(profile._id,editedProfile);
        handleClose(); 
        onUpdateProfile(editedProfile);
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
      } finally{
        setIsLoading(false);
      }
    };
  
    return (
      <div>
        <Button onClick={handleOpen} className="bg-gray-500 hover:bg-gray-400 text-white normal-case py-2 px-4">Editar perfil</Button>
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgb(228 228 231)', width: 400, p: 4, boxShadow: 10,}}>
            {isLoading
                ? <div className="flex justify-center">
                    <CircularProgress size={50}/>
                  </div>
                : <form className="flex flex-col space-y-4">
                    <label htmlFor="name" className="text-xs">Nombre real</label>
                    <input type="text" id="name" name="name" className="bg-zinc-100 p-2 rounded"  defaultValue={profile.name} onChange={handleInputChange} />

                    <label htmlFor="surname" className="text-xs">Apellido</label>
                    <input type="text" id="surname" name="surname" className="bg-zinc-100 p-2 rounded" defaultValue={profile.surname} onChange={handleInputChange} />

                    <label htmlFor="username" className="text-xs">Nombre de usuario</label>
                    <input type="text" id="username" name="username" className="bg-zinc-100 p-2 rounded" defaultValue={profile.username} onChange={handleInputChange} />

                    <label htmlFor="description" className="text-xs">Descripción</label>
                    <input type="text" id="description" name="description" className="bg-zinc-100 p-2 rounded" defaultValue={profile.description} onChange={handleInputChange} />
                    <div className="flex flex-col space-y-2">
                      <Button className="bg-gray-500 hover:bg-gray-400 text-white normal-case py-2" onClick={handleSubmit}>Guardar</Button>
                      <Button className="bg-gray-500 hover:bg-gray-400 text-white normal-case py-2" onClick={handleClose}>Cancelar</Button>
                    </div>
                </form>
            }
          </Box>
        </Modal>
      </div>
    );
  }