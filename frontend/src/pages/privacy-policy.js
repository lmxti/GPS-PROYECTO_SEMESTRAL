import Card from '@mui/material/Card';
import NavBar from '@/components/nav/NavBar.jsx'

/* <------------------------ CONTEXTO --------------------------> */
import { useAuth } from "@/context/AuthContext";

export default function PoliticasPrivacidad() {
    // Desectructuracion datos de usuario que esta navegando (user.id).
    const { user } = useAuth();
  return (
    <>
    <NavBar userId={user.id}/>
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Políticas de Privacidad</h1>
        <div className="prose text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies tincidunt, nisl
            nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt, nisl nisl
            aliquam nisl, eget aliquam nisl nisl eget nisl.
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Recopilación y uso de datos personales</h2>
            <div className="prose text-gray-600">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatCard title="Usuarios Registrados" value="+10,000" change="+20% desde el último mes" icon="users" />
              <StatCard title="Datos Recopilados" value="+5TB" change="+15% desde el último mes" icon="database" />
              <StatCard title="Solicitudes de Acceso" value="+1,200" change="+30% desde el último mes" icon="activity" />
              <StatCard title="Solicitudes de Borrado" value="+500" change="+10% desde el último mes" icon="trash" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Seguridad de los datos</h2>
            <div className="prose text-gray-600">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              </p>
            </div>
            <div className="mt-6">
              <SimpleBarChart />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Derechos de los usuarios</h2>
            <div className="prose text-gray-600">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cambios en la política de privacidad</h2>
            <div className="prose text-gray-600">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

function StatCard({ title, value, change, icon }) {
  return (
    <Card className="p-4">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-gray-500">
          {icon === 'users' && <UsersIcon />}
          {icon === 'database' && <DatabaseIcon />}
          {icon === 'activity' && <ActivityIcon />}
          {icon === 'trash' && <TrashIcon />}
        </span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{change}</p>
    </Card>
  )
}

function SimpleBarChart() {
  const data = [
    { name: "Jan", count: 111 },
    { name: "Feb", count: 157 },
    { name: "Mar", count: 129 },
    { name: "Apr", count: 150 },
    { name: "May", count: 119 },
    { name: "Jun", count: 72 },
  ];

  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <div className="w-full h-64 relative">
      <div className="flex h-full items-end absolute bottom-0 left-0 right-0">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
            <div 
              className="w-4/5 bg-blue-500 rounded-t transition-all duration-300 ease-in-out"
              style={{ height: `${(item.count / maxCount) * 100}%` }}
            >
              <div className="text-xs text-white text-center mt-1">{item.count}</div>
            </div>
            <span className="text-xs mt-2">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Definiciones simplificadas de los iconos
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
)

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)