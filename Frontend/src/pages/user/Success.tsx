import Sidebar from "@/components/common/Sidebar"
import VerificationSuccess from "@/components/verification/VerificationSuccess"

const Success = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"none"} />
      <VerificationSuccess />
    </div>
  )
}

export default Success
