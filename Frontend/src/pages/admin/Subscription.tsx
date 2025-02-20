import Header from "@/components/admin/common/Header"
import Sidebar from "@/components/admin/common/Sidebar"
import SubscriptionDetials from "@/components/admin/subscription/SubscriptionDetials"

const Subscription = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={'subscription'} />
      <div className="w-full flex flex-col overflow-auto">
        <Header title={"Subscription"} />
        <SubscriptionDetials />
      </div>
    </div>
  )
}

export default Subscription
