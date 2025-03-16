const ViewFile: React.FC<{ file: string, type: string, handleCloseModal: () => void }> = ({ file, type, handleCloseModal }) => {

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modal-background") {
      handleCloseModal();
    }
  };

  return (
    <div 
      onClick={handleBackgroundClick} 
      id='modal-background' 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="dark:bg-[#18181b] bg-[#ffffff] rounded-3xl shadow-lg w-1/2 max-w-3xl flex items-center justify-center p-6">
        {type === 'image' ? (
          <img
            src={file}  
            className="max-w-full max-h-[80vh] rounded-2xl object-contain"
            alt="Preview"
          />
        ) : (
          <video
            src={file}
            controls
            autoPlay
            className="max-w-full max-h-[80vh] rounded-2xl object-contain"
          />
        )}
      </div>
    </div>
  );
}

export default ViewFile;
