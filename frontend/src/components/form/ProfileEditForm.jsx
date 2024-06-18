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
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
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
        <Button onClick={handleOpen}>Editar perfil</Button>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            
        {isLoading
            ? <div className="flex justify-center">
                <CircularProgress size={50}/>
              </div>
            : <form className="flex flex-col space-y-2">
                <label htmlFor="name">Nombre real</label>
                <input type="text" id="name" name="name" className="bg-zinc-100 p-2 rounded"  defaultValue={profile.name} onChange={handleInputChange} />

                <label htmlFor="surname">Apellido</label>
                <input type="text" id="surname" name="surname" className="bg-zinc-100 p-2 rounded" defaultValue={profile.surname} onChange={handleInputChange} />

                <label htmlFor="username">Nombre de usuario</label>
                <input type="text" id="username" name="username" className="bg-zinc-100 p-2 rounded" defaultValue={profile.username} onChange={handleInputChange} />

                <label htmlFor="description">Descripción</label>
                <input type="text" id="description" name="description" className="bg-zinc-100 p-2 rounded" defaultValue={profile.description} onChange={handleInputChange} />

                <Button onClick={handleSubmit}>Guardar</Button>
                <Button onClick={handleClose}>Cancelar</Button>
            </form>
        }

          </Box>
        </Modal>
      </div>
    );
  }