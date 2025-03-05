import Sidebar from '@/components/common/Sidebar'
import ReelsMainDetials from '@/components/reel/ReelsMainDetials'

const ReelsMain = () => {
  return (
    <div className="flex h-screen">
      <Sidebar page={"reel"} />
      <div className='w-full h-screen scrollbar-hidden'>
        <ReelsMainDetials />
      </div>
    </div>
  )
}

export default ReelsMain
