import { useNavigate } from "react-router-dom";
import "./Book.css";

export default function Book({ title, route }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const book = e.currentTarget;
    book.classList.add("open");
    setTimeout(() => navigate(route), 1000); // go to new page after flip
  };

  return (
    <div className="book" onClick={handleClick}>
      <div className="cover front">
        <h3>{title}</h3>
      </div>
      <div className="pages"></div>
      <div className="cover back"></div>
    </div>
  );
}

