import Sidebar from '@/components/common/Sidebar'
import VerificationFailed from '@/components/verification/VerificationFailed'

const Failed = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"none"} />
      <VerificationFailed />
    </div>
  )
}

export default Failed
