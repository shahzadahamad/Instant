import ProfileHeaders from "@/components/common/ProfileHeader"
import Sidebar from "@/components/common/Sidebar"
import VerificationContent from "@/components/verification/VerificationContent"

const Verification = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"profile"} />
      <div className="w-full h-screen overflow-auto scrollbar-hidden">
        <ProfileHeaders name={'Verification'} />
        <VerificationContent />
      </div>
    </div>
  )
}

export default Verification
