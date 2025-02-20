import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddSubscriptionForm from "./AddSubscriptionForm";
import SubscriptionActions from "./SubscriptionActions";
import { getSubscriptionPlans } from "@/apis/api/adminApi";
import { SubscriptionData } from "@/types/admin/subscription";

const SubscriptionDetials = () => {
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalSubscription, setTotalSubscription] = useState(0);
  const [page, setPage] = useState(1);
  const [subscription, setSubscription] = useState<SubscriptionData[]>([]);
  const isDisabled = page === totalPages;

  const fetchSubscriptionPlans = async (page: number) => {
    try {
      const response = await getSubscriptionPlans(page, searchVal);
      setSubscription(response.data.subscription);
      setTotalPages(response.data.totalPages);
      setTotalSubscription(response.data.totalSubscription);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptionPlans(page);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [page, searchVal]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
        <div className="w-full p-10 pb-1 flex justify-between items-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full bg-transparent p-3 pr-10 border rounded-md shadow-sm focus:outline-none"
                name="search"
                placeholder="Search"
              />
              <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
          <h1 className="text-lg font-semibold">Total Music : {totalSubscription}</h1>
        </div>
        <div className="overflow--auto p-10">
          <AddSubscriptionForm fetchSubscriptionPlans={fetchSubscriptionPlans} />
          {subscription.length > 0 ? (
            <table className="min-w-full">
              <thead className="border rounded-md">
                <tr>
                  <th className="py-3 px-4 text-left">Period</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Offer</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              {subscription.map((subscription) => (
                <tbody key={subscription._id} className="border">
                  <tr className="">
                    <td className="py-2 px-4">{subscription.period}</td>
                    <td className="py-2 px-4">₹{subscription.price}</td>
                    <td className="py-2 px-4">{subscription.offer}%</td>
                    <td
                      className={`py-2 px-4 ${subscription.isListed ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {subscription.isListed ? "Listed" : "Unlisted"}
                    </td>
                    <td className="py-2 px-4">
                      <SubscriptionActions
                        id={subscription._id}
                        isListed={subscription.isListed}
                        period={subscription.period}
                        fetchSubscriptionPlans={fetchSubscriptionPlans}
                        page={page}
                        price={subscription.price}
                        offer={subscription.offer}
                      />
                    </td>
                  </tr>
                </tbody>
              ))}
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={5}>
                    <div className={`flex items-center ${!(totalSubscription !== 0 && page === 1 && isDisabled) ? "justify-between" : "justify-end"}`}>
                      {!(totalSubscription !== 0 && page === 1 && isDisabled) && (
                        <div className="flex gap-4">
                          <Button
                            disabled={page === 1}
                            onClick={handlePrevPage}
                            variant="outline"
                          >
                            &lt;&lt;
                          </Button>
                          <Button
                            disabled={isDisabled}
                            onClick={handleNextPage}
                            variant="outline"
                          >
                            &gt;&gt;
                          </Button>
                        </div>
                      )}
                      <h1 className="p-2 font-semibold">Total Subscription: {subscription.length}</h1>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : totalSubscription === 0 ? (
            <h1>Subscription Not found in Database</h1>
          ) : (
            <h1>No search result</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetials;
