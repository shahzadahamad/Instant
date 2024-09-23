import { setCustomFilters } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import { Slider } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomFilter = () => {
  const dispatch = useDispatch();
  const { post, postIndex } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    
    return () => {};
  }, []);

  const handleSliderChange = (_event: Event, newValue: number | number[],index:number) => {
    console.log('inin')
    if (typeof newValue === "number") {
      dispatch(
        setCustomFilters({
          postIndex,
          newValue,
          index
        })
      );
    }
  };
  return (
    <>
      {post[postIndex].customFilter.map((item,index) => {
        return (
          <div className="w-[28vw] pl-5 pt-5 pr-2">
            <h1>{item.label}</h1>
            <Slider
              size="small"
              valueLabelDisplay="auto"
              value={post[postIndex].customFilter[index].value}
              onChange={(e,newValue)=>handleSliderChange(e,newValue,index)}
              max={200}
            />
          </div>
        );
      })}
    </>
  );
};

export default CustomFilter;
