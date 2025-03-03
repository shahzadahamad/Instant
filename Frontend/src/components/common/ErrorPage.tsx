import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC<{ message: string, statusCode: number, data: string | null }> = ({ message, statusCode, data }) => {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="relative h-full">
          <h1 className="text-[200px] font-extrabold">
            <span>{statusCode}</span>
          </h1>
          <h2 className="text-2xl font-bold">Oops! {message}</h2>
        </div>
        {
          data && message === 'This account is private. Follow the user to view their posts.' && (
            <p onClick={() => {
              navigate(`/user/${data}`)
            }} className="text-[#0070B8] hover:underline text-lg cursor-pointer">
              Follow
            </p>
          )
        }
      </div>
    </div>
  );
};

export default ErrorPage;
