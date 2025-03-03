import ErrorPage from '@/components/common/ErrorPage'
import Sidebar from '@/components/common/Sidebar'
import { useSearchParams } from 'react-router-dom';

const Error = () => {

  const [searchParams] = useSearchParams();
  const statusCode = parseInt(searchParams.get("statusCode") || "0", 10);
  const message = searchParams.get("message");
  const data = searchParams.get('data');

  const messages = ['Post not found.', 'User not found.', 'This account is private. Follow the user to view their posts.']

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"none"} />
      <div className="w-full overflow-auto scrollbar-hidden">
        {
          message && messages.includes(message) ?
            <ErrorPage message={message} statusCode={statusCode} data={data} /> :
            <ErrorPage message='Page not found!' statusCode={statusCode} data={data} />
        }
      </div>
    </div>
  )
}

export default Error
