import { useNavigate } from "react-router-dom";
import {useGetCategories} from "../hooks/GET/useGetCategories";

const Categories = () => {
  const {data} = useGetCategories();
  const navigate = useNavigate();

  return (
    <div className={`categories container`}>
      {data?.map(({name, icon, id}) => (
        <div onClick={() => navigate(`/filter/${id}`)} key={`${id} ${name}`} className="categories__item">
          <span className="categories__icon">
            <img
              className="categories__icon"
              width={30}
              height={30}
              src={icon}
              alt="icon"
            />
          </span>
          <p className="categories__text">{name}</p>
        </div>
      ))}
    </div>
  );
};

export default Categories;
