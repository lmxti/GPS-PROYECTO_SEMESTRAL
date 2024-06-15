/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonPost( { count }) {
  return (
    <div >
    {Array.from(new Array(count)).map((_, index) => (
      <div key={index} className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4 mb-4 p-4">
        <div className="flex w-full items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-3">
                <Skeleton variant="circular" width={45} height={40} />
                <Skeleton variant="text" width={100} />
            </div>
            <div className="flex items-center space-x-8">
                <Skeleton variant="text" width={50} />
            </div>
        </div>
        <div>
            <Skeleton variant="rectangular" width={'100%'}  height={200} />
        </div>
        <div className="px-4 py-2">
          <div className="flex space-x-4 md:space-x-8">
            <Skeleton variant="rounded" width={300} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="rounded" width={150} height={40} />
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}
