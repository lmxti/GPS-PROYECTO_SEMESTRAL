/* <----------------------- FUNCIONES ---------------------------> */
import { useState, useEffect } from "react";

/* <---------------- COMPONENTES MATERIAL UI --------------------> */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

/* <----------------------- SERVICIOS  -------------------------> */
import { updateUser } from "@/services/user.service";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'rgb(228 228 231)',
    // border: '2px solid #000',
    boxShadow: 10,
    p: 4,
  };


  export default function ProfileEditForm({ profile, onUpdateProfile }) {
    
    const [open, setOpen] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleInputChange = (event) => {                                      
        setEditedProfile(prevState => ({
          ...prevState,
          [event.target.name]: event.target.value
        }));
      };
  
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
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            
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