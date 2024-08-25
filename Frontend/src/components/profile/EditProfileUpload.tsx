const EditProfileUpload = () => {
  return (
    <div className="flex items-center justify-between bg-[#262626] w-3/4 rounded-3xl p-4">
      <img src="./avatar.png" alt="Avatar" className="w-20" />
      <input type="file" id="file-upload" className="hidden" />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-[#346688] h-10 text-white py-2 px-4 rounded-xl font-bold hover:bg-[#0095F6] transition-colors"
      >
        Change Photo
      </label>
    </div>
  );
};

export default EditProfileUpload;
