/* <----------------------- ICONOS --------------------------> */
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import BalanceIcon from '@mui/icons-material/Balance';
import SecurityIcon from '@mui/icons-material/Security';

export default function Resources() {
  return (
    <div className='block p-6'>
      <ul className='space-y-4'>

        <li className=''>
          <a href="#" className=''>
          <InfoIcon fontSize={"large"}/> Acerca de
          </a>
        </li>

        <li className=''>
          <a href="#">
            <HelpIcon fontSize={"large"}/> Ayuda
          </a>
        </li>

        <li className=''>
          <a href="#">
            <BalanceIcon fontSize={"large"}/> Politicas de privacidad
          </a>
        </li>

        <li className=''>
          <a href="#">
            <SecurityIcon fontSize={"large"}/> Politicas de contenido
          </a>
        </li>

      </ul>
    </div>
  )
}
